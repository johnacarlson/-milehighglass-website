import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { ensureInit, isDbReady } from './init.js';
import leadsRouter from './routes/leads.js';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

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
app.get('/api/health', async (req, res) => {
  await ensureInit();
  res.json({
    status: 'ok',
    database: isDbReady() ? 'connected' : 'unavailable',
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

// Local development only. On Vercel the exported app is invoked as a handler and
// initialization is awaited per request in ensureInit(), so nothing runs here.
async function startLocalServer() {
  await ensureInit();
  app.listen(PORT, () => {
    console.log(`\n✓ Server running at http://localhost:${PORT}`);
    console.log(`✓ API endpoint: POST http://localhost:${PORT}/api/leads/submit`);
    console.log(`✓ Health check: http://localhost:${PORT}/api/health\n`);
  });
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down...');
  process.exit(0);
});

if (!process.env.VERCEL) {
  startLocalServer().catch((err) => {
    console.error('[Startup] Local server failed to start:', err);
  });
}

export default app;
