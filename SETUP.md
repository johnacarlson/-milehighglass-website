# Mile High Glass Rebuild - Setup Guide

## What You're Building

A complete lead capture system for milehighglassdenver.co with:
- ✅ React frontend (same design, just redone)
- ✅ Express.js backend API (Vercel-deployed)
- ✅ PostgreSQL database (Supabase)
- ✅ Email delivery (Resend)
- ✅ Lead storage + tracking

---

## Phase 1 Setup (What We Just Built)

### Step 1: Create Supabase Account & Database

1. Go to [supabase.com](https://supabase.com)
2. Sign up with your email
3. Create a new project:
   - Organization: `Mile High Glass`
   - Project name: `mhg-leads`
   - Database password: (create secure password, save it)
   - Region: `us-east-1` (closest to Colorado)
4. Wait for it to provision (2-5 min)
5. Go to **Settings → Database → Connection String**
6. Copy the connection string (looks like: `postgresql://postgres:PASSWORD@...`)
7. Save it somewhere safe

### Step 2: Create Resend Account & API Key

1. Go to [resend.com](https://resend.com)
2. Sign up with your email
3. Go to **Settings → API Keys**
4. Create new API key, name it `MHG`
5. Copy the key (looks like: `re_xxxxxxxxxxxx`)
6. **Important:** Go to **Domains** and verify `milehighglassdenver.co`
   - Add DNS records they provide
   - Takes 5-10 min to verify

### Step 3: Set Up Local Environment

1. In this project folder, create `.env.local`:

```bash
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres?sslmode=require
RESEND_API_KEY=re_xxxxxxxxxxxx
LEAD_EMAIL=Admin@MileHighGlassDenver.com
PORT=3001
```

2. Install dependencies:
```bash
npm install
```

3. Start the API locally:
```bash
npm run dev
```

You should see:
```
✓ Server running at http://localhost:3001
✓ API endpoint: POST http://localhost:3001/api/leads/submit
✓ Health check: http://localhost:3001/api/health
```

### Step 4: Test the API

```bash
curl -X POST http://localhost:3001/api/leads/submit \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "(303) 555-1234",
    "zipCode": "80202",
    "service": "window-replacement",
    "message": "Interested in window replacement for my home"
  }'
```

Expected response:
```json
{
  "success": true,
  "leadId": 1,
  "message": "Lead submitted successfully"
}
```

Check:
1. Lead appears in Supabase dashboard (SQL Editor → select * from leads)
2. Email arrives at Admin@MileHighGlassDenver.com

---

## Phase 2: Rebuild Frontend (Next)

We'll rebuild the React component to call this API endpoint instead of the old Manus setup.

---

## Phase 3: Deploy to Vercel (Final)

Once tested locally, we deploy to Vercel and point DNS to it.

---

## Troubleshooting

**"DATABASE_URL is required"**
- Make sure `.env.local` exists in this folder
- Verify DATABASE_URL value is copied correctly

**"Resend not configured"**
- Check RESEND_API_KEY in `.env.local`
- Make sure it starts with `re_`

**Email not arriving**
- Check Resend dashboard for delivery status
- Verify domain is verified in Resend
- Check `from` address matches verified domain

---

## Files Created

```
mhg-rebuild/
├── api/
│   ├── index.js              ← Main Express server
│   ├── email.js              ← Resend email handler
│   ├── db/
│   │   ├── client.js         ← PostgreSQL connection
│   │   └── schema.js         ← Database tables + queries
│   └── routes/
│       └── leads.js          ← POST /api/leads/submit
├── .env.example              ← Template for .env.local
├── .env.local                ← Your actual secrets (don't commit)
├── package.json
├── vercel.json               ← Vercel deployment config
└── SETUP.md                  ← This file
```

---

## Next Steps

1. Create Supabase account
2. Create Resend account  
3. Set up `.env.local`
4. Run `npm install && npm run dev`
5. Test with curl or Postman
6. Message me when it's working locally

Let me know when you're at each step!
