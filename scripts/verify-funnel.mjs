#!/usr/bin/env node
//
// Post-deploy funnel check. Run this after ANY change to the site.
//
//   node scripts/verify-funnel.mjs
//
// Answers the only question that matters: can a lead still get through, and is
// anything sitting in the database that never reached the inbox?
//
// Requires DATABASE_URL. Pull it first with:
//   vercel env pull .env.check --environment=production --yes
//
// Exits non-zero if the funnel is broken, so it can gate a deploy.

import fs from 'fs';
import pg from 'pg';

const SITE = process.env.SITE || 'https://milehighglassdenver.co';
const ENV_FILE = process.env.ENV_FILE || '.env.check';

let failures = 0;
const fail = (msg) => { console.error(`  ✗ ${msg}`); failures++; };
const ok = (msg) => console.log(`  ✓ ${msg}`);

console.log(`\nVerifying ${SITE}\n`);

// 1. The API is up and the database is reachable from the deployed function.
console.log('API');
try {
  const res = await fetch(`${SITE}/api/health`, { signal: AbortSignal.timeout(20000) });
  const body = await res.json();
  res.ok ? ok(`health ${res.status}`) : fail(`health returned ${res.status}`);
  body.database === 'connected'
    ? ok('database connected')
    : fail(`database reports "${body.database}" — leads will not persist`);
} catch (err) {
  fail(`health check unreachable: ${err.message}`);
}

// 2. The form still posts to the API. A front-end refactor that drops the call
//    is invisible to every server-side check — the page looks perfect and the
//    lead goes nowhere.
console.log('\nFront end');
try {
  const html = await (await fetch(SITE, { signal: AbortSignal.timeout(20000) })).text();
  const bundles = [...html.matchAll(/\/assets\/[^"']+\.js/g)].map((m) => m[0]);
  if (!bundles.length) fail('no JS bundle found on the page');
  let posts = false;
  for (const b of [...new Set(bundles)]) {
    const js = await (await fetch(`${SITE}${b}`, { signal: AbortSignal.timeout(20000) })).text();
    if (js.includes('/api/leads/submit')) posts = true;
  }
  posts
    ? ok('bundle posts to /api/leads/submit')
    : fail('BUNDLE DOES NOT CALL THE API — submissions are discarded silently');
} catch (err) {
  fail(`bundle check failed: ${err.message}`);
}

// 3. Validation rejects junk without touching the database.
console.log('\nValidation');
try {
  const res = await fetch(`${SITE}/api/leads/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName: '', email: 'not-an-email' }),
    signal: AbortSignal.timeout(20000),
  });
  res.status === 400
    ? ok('invalid payload rejected with 400')
    : fail(`invalid payload returned ${res.status}, expected 400`);
} catch (err) {
  fail(`validation probe failed: ${err.message}`);
}

// 4. Leads that were saved but never emailed. This is the alarm that would have
//    caught Ron Mungo on 17 Aug within minutes instead of two days.
console.log('\nUndelivered leads');
if (!fs.existsSync(ENV_FILE)) {
  console.log(`  – skipped: no ${ENV_FILE} (run: vercel env pull ${ENV_FILE} --environment=production --yes)`);
} else {
  const env = Object.fromEntries(
    fs.readFileSync(ENV_FILE, 'utf8').split('\n').filter((l) => l.includes('='))
      .map((l) => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^"|"$/g, '')]; })
  );
  const pool = new pg.Pool({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  try {
    const r = await pool.query(
      'SELECT id, created_at, first_name, last_name, email, phone FROM leads WHERE email_sent = false ORDER BY id'
    );
    if (r.rowCount === 0) {
      ok('every lead in the database was emailed');
    } else {
      fail(`${r.rowCount} lead(s) saved but NEVER emailed — nobody was notified:`);
      for (const x of r.rows) {
        console.error(`      #${x.id} ${new Date(x.created_at).toISOString().slice(0, 16)}Z  ${x.first_name} ${x.last_name || ''}  ${x.email}  ${x.phone || '(no phone)'}`);
      }
    }
  } catch (err) {
    fail(`database query failed: ${err.message}`);
  } finally {
    await pool.end();
  }
}

console.log(failures === 0 ? '\nFunnel OK\n' : `\n${failures} problem(s) found\n`);
process.exit(failures === 0 ? 0 : 1);
