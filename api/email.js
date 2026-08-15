import { Resend } from 'resend';

let resend = null;

export function initEmail(apiKey) {
  if (!apiKey) {
    console.warn('⚠️  RESEND_API_KEY not configured — email sending will be disabled');
    return;
  }
  resend = new Resend(apiKey);
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (char) => map[char]);
}

function getServiceLabel(service) {
  if (!service) return 'General Inquiry';
  return service
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function sendLeadEmail(leadData) {
  if (!resend) {
    console.warn('[Email] Resend not configured — skipping email');
    return false;
  }

  const {
    id: leadId,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    zip_code: zipCode,
    service,
    message,
  } = leadData;

  const serviceLabel = getServiceLabel(service);

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 0;">
      <div style="background: #14120e; padding: 24px 32px; text-align: center;">
        <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663185405705/XWktSgb6MUdpB4asHcYi7A/mhg_logo_cdb20e13.png" alt="Mile High Glass" style="height: 48px;" />
      </div>
      <div style="background: #c9a84c; padding: 12px 32px;">
        <h2 style="margin: 0; color: #14120e; font-size: 18px; font-family: Arial, sans-serif;">
          🔔 New Quote Request — ${escapeHtml(serviceLabel)}
        </h2>
      </div>
      <div style="background: white; padding: 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px; width: 140px;"><strong>Name</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 15px; color: #14120e;">${escapeHtml(firstName)} ${escapeHtml(lastName)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;"><strong>Email</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 15px;"><a href="mailto:${escapeHtml(email)}" style="color: #c9a84c;">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;"><strong>Phone</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 15px;">${phone ? `<a href="tel:${escapeHtml(phone)}" style="color: #c9a84c;">${escapeHtml(phone)}</a>` : 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;"><strong>Zip Code</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 15px; color: #14120e;">${escapeHtml(zipCode) || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;"><strong>Service</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 15px; color: #14120e;">${escapeHtml(serviceLabel)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666; font-size: 13px; vertical-align: top;"><strong>Message</strong></td>
            <td style="padding: 10px 0; font-size: 15px; color: #14120e; white-space: pre-wrap; word-break: break-word;">${escapeHtml(message) || 'No additional message provided.'}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 4px; font-size: 12px; color: #999;">
          Lead ID: ${leadId} · Submitted via milehighglassdenver.co
        </div>
      </div>
      <div style="background: #14120e; padding: 16px 32px; text-align: center;">
        <p style="color: #666; font-size: 11px; margin: 0;">© Mile High Glass Denver · (303) 455-9552 · Admin@MileHighGlassDenver.com</p>
      </div>
    </div>
  `;

  try {
    const response = await resend.emails.send({
      from: 'noreply@milehighglassdenver.co',
      to: process.env.LEAD_EMAIL || 'Admin@MileHighGlassDenver.com',
      replyTo: email,
      subject: `New Lead: ${firstName} ${lastName} — ${serviceLabel}`,
      html: htmlBody,
    });

    console.log(`[Email] Lead ${leadId} sent to ${process.env.LEAD_EMAIL || 'Admin@MileHighGlassDenver.com'}`);
    return true;
  } catch (err) {
    console.error(`[Email] Failed to send lead ${leadId}:`, err);
    return false;
  }
}
