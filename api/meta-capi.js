import crypto from 'crypto';

export function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

export function normalizePhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  return digits.length === 10 ? `1${digits}` : digits;
}

export function buildLeadEventPayload({
  eventId, phone, firstName, email, fbp, fbc, ipAddress, userAgent, sourceUrl, testEventCode,
}) {
  // Every identifier is SHA-256 hashed before it leaves this server — Meta
  // never receives a raw phone number, name, or email address.
  const user_data = {};
  if (phone) user_data.ph = [sha256(normalizePhone(phone))];
  if (firstName) user_data.fn = [sha256(String(firstName).trim().toLowerCase())];
  // Email is one of Meta's strongest match signals. B's form was phone-only so
  // it never sent one; this form collects it, so include it.
  if (email) user_data.em = [sha256(String(email).trim().toLowerCase())];
  if (ipAddress) user_data.client_ip_address = ipAddress;
  if (userAgent) user_data.client_user_agent = userAgent;
  if (fbp) user_data.fbp = fbp;
  if (fbc) user_data.fbc = fbc;

  const payload = {
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: sourceUrl || 'https://milehighglassdenver.co/',
      user_data,
    }],
  };
  if (testEventCode) payload.test_event_code = testEventCode;
  return payload;
}

export async function sendLeadEvent(args) {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) {
    console.warn('[CAPI] META_PIXEL_ID / META_CAPI_TOKEN not configured — skipping server event');
    return false;
  }
  try {
    const payload = buildLeadEventPayload({
      ...args,
      testEventCode: process.env.META_TEST_EVENT_CODE,
    });
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(3000) }
    );
    const json = await res.json();
    if (!res.ok) {
      console.error('[CAPI] API error:', JSON.stringify(json));
      return false;
    }
    console.log(`[CAPI] Lead event sent (event_id=${args.eventId})`);
    return true;
  } catch (err) {
    console.error('[CAPI] send failed:', err);
    return false;
  }
}
