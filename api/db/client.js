import pg from 'pg';

const { Pool } = pg;

let pool = null;

export function initDB(connectionString) {
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  return pool;
}

export function getPool() {
  if (!pool) {
    throw new Error('Database not initialized. Call initDB first.');
  }
  return pool;
}

export async function query(text, params) {
  const client = await getPool().connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function closeDB() {
  if (pool) {
    await pool.end();
  }
}
