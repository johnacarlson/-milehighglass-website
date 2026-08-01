# Mile High Glass — Security Fix Deployment Checklist

## Pre-Deployment (Local Testing)

### Database Connection
- [ ] Update `.env.local` with fresh Supabase credentials
- [ ] Run `npm start` and verify server starts without auth errors
- [ ] Confirm `/api/health` returns `200 OK`

### Rate Limiting
- [ ] Start server locally
- [ ] Submit lead form 5 times rapidly from same IP
- [ ] 6th submission should return `429 Too Many Requests`
- [ ] Verify error message: "Too many submissions. Please try again later."
- [ ] Form submits normally after 15-minute window resets

### Security Headers
- [ ] Run: `curl -I http://localhost:3001/api/health`
- [ ] Verify these headers are present:
  - `Content-Security-Policy: default-src 'self'; frame-src 'none'; object-src 'none'`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`

### XSS Escaping
- [ ] Submit form with message: `<img src=x onerror="alert(1)">`
- [ ] Check email received (check Admin@MileHighGlassDenver.com)
- [ ] Verify message displays as escaped HTML, not as an image tag
- [ ] Confirm no JavaScript executes

### Golden Path
- [ ] Submit normal form with valid data
- [ ] Verify lead appears in database
- [ ] Confirm email arrives in inbox
- [ ] Frontend shows success message
- [ ] No errors in server logs

### Test Data Cleanup
- [ ] Query database: `SELECT * FROM leads WHERE first_name LIKE 'RateTest%' OR first_name = 'Test User'`
- [ ] Should return 7 rows (6 RateTest + 1 Test User)
- [ ] Delete: `DELETE FROM leads WHERE first_name LIKE 'RateTest%' OR first_name = 'Test User'`
- [ ] Verify count drops to 0

---

## Vercel Deployment

### Environment Variables
1. Log into Vercel project: https://vercel.com/
2. Go to Settings → Environment Variables
3. For each of these variables, check the **Sensitive** checkbox:
   - `DATABASE_URL` ✓
   - `POSTGRES_URL` → Mark as Sensitive
   - `POSTGRES_PRISMA_URL` → Mark as Sensitive
   - `POSTGRES_URL_NON_POOLING` → Mark as Sensitive
   - `POSTGRES_PASSWORD` (if present) → Mark as Sensitive
4. Redeploy to apply changes

### Code Deployment
```bash
git add -A
git commit -m "chore: add security hardening (rate limiting, headers, XSS escaping)"
git push origin main
```

Vercel will auto-deploy. Monitor the deployment log for errors.

---

## Post-Deployment (Production Verification)

### Security Headers (Production)
```bash
curl -I https://milehighglassdenver.co/api/health
```
Verify same headers as local testing are present.

### Rate Limiting (Production)
- [ ] Submit form 5 times from your phone
- [ ] 6th submission returns 429
- [ ] Wait 15 minutes, try again → Should work

### XSS Escaping (Production)
- [ ] Submit test form with HTML payload
- [ ] Check email (Admin@MileHighGlassDenver.com)
- [ ] Verify escaping works

### Form Functionality
- [ ] Submit a real quote request
- [ ] Verify lead appears in your CRM/database
- [ ] Confirm email notification arrives
- [ ] Test from mobile and desktop

### Monitoring
- [ ] Watch server logs for `429` responses (rate limit hits)
- [ ] Monitor `/api/health` uptime
- [ ] Set up alerts if 429s spike (potential attack)

---

## Rollback Plan (If Issues)

If deployed code causes problems:

```bash
git revert HEAD
git push origin main
# Vercel auto-deploys the previous working version
```

All changes are backward-compatible and only add security without changing form behavior.

---

## Files Modified

| File | Change | Risk |
|------|--------|------|
| `api/routes/leads.js` | Added rate limiter | None — Additive security |
| `api/index.js` | Added helmet middleware | None — Additive security |
| `api/email.js` | Added HTML escaping | None — Escapes safely |
| `package.json` | Added 2 dependencies | Low — Standard packages |
| `SECURITY.md` | Documentation | None — Docs only |

---

## Success Criteria

✅ Rate limiting works (429 after 5 attempts)  
✅ Security headers present  
✅ XSS payloads escaped in emails  
✅ Form still works normally  
✅ Test data cleaned up  
✅ Vercel env vars marked Sensitive  

**Estimated time to complete:** 30 minutes (including 15-min rate limit window reset)
