import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { insertLead, updateLeadEmailStatus } from '../db/schema.js';
import { sendLeadEmail } from '../email.js';
import { ensureInit } from '../init.js';
import { sendLeadEvent } from '../meta-capi.js';

const router = Router();

// Rate limit: 20 submissions per IP per 15 minutes.
//
// This is spam protection, not a quota. 5 was low enough to lock out a shared
// office or apartment NAT, where many legitimate prospects share one address —
// and it counted rejected attempts, so a visitor who mistyped their email four
// times was locked out before submitting once. Failed requests no longer count.
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Too many submissions from your network. Please call us at (303) 455-9552.',
  },
  skipFailedRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development',
});

const leadSchema = z.object({
  firstName: z.string().min(1, 'Name required'),
  lastName: z.string().optional().default(''),
  email: z.string().email('Valid email required'),
  phone: z.string().optional().default(''),
  zipCode: z.string().optional(),
  service: z.string().optional(),
  message: z.string().optional(),
  // Shared with the browser pixel so Meta deduplicates the two Lead events into
  // one. Optional: an older cached bundle omits it and must still submit.
  eventId: z.string().max(64).optional(),
});

router.post('/submit', submitLimiter, async (req, res) => {
  try {
    // Must complete before the first insert. On a cold start the pool does not
    // exist yet, and skipping this would drop the lead to email-only.
    await ensureInit();

    const ipAddress =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.ip ||
      null;

    const validation = leadSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.errors[0]?.message || 'Validation failed',
      });
    }

    const leadData = validation.data;

    // 1. Save to database. A failure here must NOT abort the submission — the
    // email is what actually reaches a human, and a lead that only lands in the
    // inbox beats a lead that is lost because Postgres was unreachable.
    let savedLead = null;
    try {
      savedLead = await insertLead({ ...leadData, ipAddress });
      console.log(`[Lead] Created lead #${savedLead.id} from ${leadData.email}`);
    } catch (err) {
      console.error(`[DB] Persist failed for ${leadData.email} — continuing to email:`, err);
    }

    // Fall back to the validated payload so the email body is identical whether
    // or not the row was written. sendLeadEmail reads snake_case DB columns.
    const emailPayload = savedLead || {
      id: 'unsaved',
      first_name: leadData.firstName,
      last_name: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone,
      zip_code: leadData.zipCode,
      service: leadData.service,
      message: leadData.message,
    };

    // 2 + 3. The email and the Meta CAPI event must both COMPLETE before the
    // response — Vercel freezes the function the moment it responds, so anything
    // still in flight silently never runs. Run them concurrently, never let
    // either reject, and answer the visitor only once both have settled.
    let emailed = false;
    let emailResult = 'not-run';
    let capiResult = 'not-run';

    const sideEffects = [
      sendLeadEmail(emailPayload)
        .then(async (success) => {
          emailed = success;
          emailResult = success ? 'sent' : 'send-returned-false';
          if (success && savedLead) {
            await updateLeadEmailStatus(savedLead.id, true).catch((err) => {
              console.error(`[DB] Failed to update email status for lead ${savedLead.id}:`, err);
            });
          }
        })
        .catch((err) => {
          emailResult = `threw: ${err?.message || err}`;
          console.error(`[Email] Error sending email for ${leadData.email}:`, err);
        }),
    ];

    // Server-side Lead event. Carries the same eventId the browser pixel fired
    // with, so Meta collapses the pair into one conversion instead of counting
    // it twice. Skipped when the client sent no id — an older cached bundle.
    if (leadData.eventId) {
      const cookies = Object.fromEntries(
        (req.headers.cookie || '')
          .split(';')
          .map((c) => {
            const i = c.indexOf('=');
            return [c.slice(0, i).trim(), c.slice(i + 1).trim()];
          })
          .filter(([k]) => k)
      );
      sideEffects.push(
        sendLeadEvent({
          eventId: leadData.eventId,
          phone: leadData.phone,
          firstName: leadData.firstName,
          email: leadData.email,
          fbp: cookies._fbp,
          fbc: cookies._fbc,
          ipAddress,
          userAgent: req.headers['user-agent'],
          sourceUrl: req.headers.referer,
        })
          .then((sent) => {
            capiResult = sent ? 'sent' : 'skipped-or-failed';
          })
          .catch((err) => {
            capiResult = `threw: ${err?.message || err}`;
            console.error('[CAPI] unexpected error:', err);
          })
      );
    }

    await Promise.allSettled(sideEffects);

    // Only a genuine loss — neither stored nor delivered — is an error. Telling
    // the visitor to call is better than a false "we got it".
    if (!savedLead && !emailed) {
      console.error(`[Lead] LOST: ${leadData.email} was neither saved nor emailed`);
      return res.status(500).json({
        success: false,
        error: 'Server error processing submission',
      });
    }

    const body = {
      success: true,
      leadId: savedLead ? savedLead.id : null,
      message: 'Lead submitted successfully',
    };

    // Live verification without log spelunking:
    //   curl -H 'x-mhg-debug: 1' -X POST ... | jq .debug
    if (req.headers['x-mhg-debug'] === '1') {
      body.debug = {
        savedToDatabase: Boolean(savedLead),
        emailResult,
        capiResult,
        resendConfigured: Boolean(process.env.RESEND_API_KEY),
        capiConfigured: Boolean(process.env.META_PIXEL_ID && process.env.META_CAPI_TOKEN),
      };
    }

    return res.status(200).json(body);
  } catch (err) {
    console.error('[API] Lead submission error:', err);
    return res.status(500).json({
      success: false,
      error: 'Server error processing submission',
    });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

export default router;
