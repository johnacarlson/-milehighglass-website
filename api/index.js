import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initDB } from './db/client.js';
import { initializeSchema } from './db/schema.js';
import { initEmail } from './email.js';
import leadsRouter from './routes/leads.js';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Set once the schema has initialized successfully. Reported by /api/health so a
// database outage is visible without having to read function logs.
let dbReady = false;

// Vercel terminates TLS at its edge and forwards the visitor address in
// X-Forwarded-For. Without this, req.ip is the proxy for every request, so
// express-rate-limit buckets ALL visitors together and starts rejecting real
// leads after 5 submissions site-wide per 15 minutes. Trust exactly one hop.
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://milehighglassdenver.co',
      'https://www.milehighglassdenver.co',
    ],
    credentials: true,
  })
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: dbReady ? 'connected' : 'unavailable',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/leads', leadsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Server error' });
});

// Initialize once per process.
//
// This must never call process.exit(). On Vercel the module is imported on every
// cold start, so exiting on a failed dependency takes down *every* route —
// including /api/health, which touches nothing. A database outage degrades lead
// persistence only; the email path stays up and the lead still reaches the inbox.
async function start() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('[Startup] DATABASE_URL is not set — lead persistence disabled');
  } else {
    try {
      console.log('[DB] Connecting to database...');
      initDB(dbUrl);
      await initializeSchema();
      dbReady = true;
    } catch (err) {
      console.error('[Startup] Database unavailable — lead persistence disabled:', err.message);
    }
  }

  // Email
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    initEmail(resendKey);
    console.log('[Email] Resend configured');
  } else {
    console.warn('[Email] ⚠️  Resend not configured — email delivery disabled');
  }

  // Bind a port only when run directly (local dev). Vercel invokes the exported
  // app as a handler; calling listen() there serves no purpose.
  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`\n✓ Server running at http://localhost:${PORT}`);
      console.log(`✓ API endpoint: POST http://localhost:${PORT}/api/leads/submit`);
      console.log(`✓ Health check: http://localhost:${PORT}/api/health\n`);
    });
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down...');
  process.exit(0);
});

// A rejection here must not become an unhandled rejection that crashes the process.
start().catch((err) => {
  console.error('[Startup] Initialization error:', err);
});

export default app;
