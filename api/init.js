import { initDB } from './db/client.js';
import { initializeSchema } from './db/schema.js';
import { initEmail } from './email.js';

// Serverless initialization.
//
// This must be awaited from inside a request handler, never fired at import
// time. Vercel freezes the instance as soon as it responds, so async work
// started at import is suspended mid-flight and may never complete — the same
// trap that made fire-and-forget lead emails silently vanish.
//
// The promise is memoized, so the connection and schema check happen once per
// warm instance and every later request resolves immediately.

let initPromise = null;
let dbReady = false;

export function isDbReady() {
  return dbReady;
}

async function init() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('[Startup] DATABASE_URL is not set — lead persistence disabled');
  } else {
    try {
      console.log('[DB] Connecting to database...');
      initDB(dbUrl);
      await initializeSchema();
      dbReady = true;
      console.log('[DB] Ready');
    } catch (err) {
      // Never rethrow. A database outage must degrade lead persistence only —
      // the email path still delivers the lead to a human.
      console.error('[Startup] Database unavailable — lead persistence disabled:', err.message);
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    initEmail(resendKey);
    console.log('[Email] Resend configured');
  } else {
    console.warn('[Email] ⚠️  Resend not configured — email delivery disabled');
  }
}

export function ensureInit() {
  if (!initPromise) {
    initPromise = init();
  }
  return initPromise;
}
