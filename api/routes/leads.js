import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { insertLead, updateLeadEmailStatus } from '../db/schema.js';
import { sendLeadEmail } from '../email.js';

const router = Router();

// Rate limit: 5 submissions per IP per 15 minutes
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many submissions. Please try again later.' },
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
});

router.post('/submit', submitLimiter, async (req, res) => {
  try {
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

    // 1. Save to database
    const savedLead = await insertLead({
      ...leadData,
      ipAddress,
    });

    console.log(`[Lead] Created lead #${savedLead.id} from ${leadData.email}`);

    // 2. Send email async (don't block response)
    sendLeadEmail(savedLead)
      .then((success) => {
        if (success) {
          updateLeadEmailStatus(savedLead.id, true).catch((err) => {
            console.error(`[DB] Failed to update email status for lead ${savedLead.id}:`, err);
          });
        }
      })
      .catch((err) => {
        console.error(`[Email] Error sending email for lead ${savedLead.id}:`, err);
      });

    return res.status(200).json({
      success: true,
      leadId: savedLead.id,
      message: 'Lead submitted successfully',
    });
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
