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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

// Initialize and start
async function start() {
  try {
    // Database
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL is required in environment');
    }

    console.log('[DB] Connecting to database...');
    initDB(dbUrl);
    await initializeSchema();

    // Email
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      initEmail(resendKey);
      console.log('[Email] Resend configured');
    } else {
      console.warn('[Email] ⚠️  Resend not configured — email delivery disabled');
    }

    // Server
    app.listen(PORT, () => {
      console.log(`\n✓ Server running at http://localhost:${PORT}`);
      console.log(`✓ API endpoint: POST http://localhost:${PORT}/api/leads/submit`);
      console.log(`✓ Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (err) {
    console.error('[Startup] Failed to start server:', err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down...');
  process.exit(0);
});

start();

export default app;
