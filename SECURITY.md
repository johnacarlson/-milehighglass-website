# Security Hardening — Mile High Glass

## Changes Implemented

### 1. Rate Limiting
**File:** `api/routes/leads.js`
- Limit: **5 submissions per IP per 15 minutes**
- Returns: `429 Too Many Requests` when exceeded
- Disabled in development mode (`NODE_ENV=development`)
- Compatible with Vercel (uses `X-Forwarded-For` header)

**Why:** Prevents bot spam and denial-of-service attacks on the lead form.

---

### 2. Security Headers
**File:** `api/index.js`
- **Content-Security-Policy (CSP)**
  - `default-src: 'self'` — Only load resources from your own domain
  - `frame-src: 'none'` — Prevent embedding in iframes (clickjacking protection)
  - `object-src: 'none'` — Disable Flash/plugins
  
- **X-Frame-Options:** DENY (redundant clickjacking protection)
- **X-Content-Type-Options:** nosniff (prevents MIME type sniffing)
- **Referrer-Policy:** strict-origin-when-cross-origin (privacy)
- **HSTS:** Enabled (forces HTTPS)

**Why:** Protects against clickjacking, MIME sniffing, and other browser-based attacks.

---

### 3. XSS Prevention (Output Encoding)
**File:** `api/email.js`
- Added `escapeHtml()` function to sanitize all user input before inserting into email HTML
- User fields escaped: firstName, lastName, email, phone, zipCode, service, message
- All HTML special characters (`<`, `>`, `&`, `"`, `'`) converted to HTML entities

**Why:** Prevents malicious HTML/JavaScript from executing if email is rendered in a web interface or if an attacker submits HTML in the message field.

---

### 4. Input Validation
**File:** `api/routes/leads.js` (existing, validated)
- Zod schema validates:
  - Email format
  - Phone length (min 7 chars)
  - Required fields (firstName, lastName, email, phone)
  - Optional fields (zipCode, service, message)
- Returns clean `400` errors without exposing stack traces

**Why:** Rejects malformed data at the API boundary.

---

## Remaining Configuration

### Vercel Environment Variables (Dashboard Only)
Mark these as **Sensitive** in Vercel Settings → Environment Variables:
- `DATABASE_URL`
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_PASSWORD` (if present)

**Why:** Prevents accidental exposure of database credentials in the Vercel dashboard.

### Test Data Cleanup
Remove fake entries created during security testing:
```sql
DELETE FROM leads WHERE first_name LIKE 'RateTest%' OR first_name = 'Test User';
```

---

## Testing Checklist

Before deploying to production:

- [ ] Rate limiting: Submit form 5 times rapidly from same IP → 6th request returns 429
- [ ] Security headers: `curl -I https://milehighglassdenver.co/api/health` → Verify CSP, X-Frame-Options present
- [ ] XSS escaping: Submit message with `<script>` tags → Email displays escaped HTML, no execution
- [ ] Golden path: Normal form submission works without errors
- [ ] Database: Vercel environment variables marked Sensitive
- [ ] Test data: Fake "RateTest" and "Test User" entries removed

---

## Security Best Practices (Going Forward)

1. **Never commit secrets** — Use `.env.local` (already in .gitignore)
2. **Update dependencies** — Run `npm audit` regularly
3. **Validate all input** — Keep Zod schemas updated as form fields change
4. **Escape all output** — Use `escapeHtml()` when displaying user data anywhere
5. **Log security events** — Monitor `/api/leads/submit` 429 responses for potential attacks
6. **Monitor headers** — Use https://securityheaders.com to verify headers persist after deployment

---

**Last Updated:** 2026-07-31  
**Implemented by:** Claude secure-code-guardian skill  
**Review Status:** Ready for production deployment (pending DB credential verification)
