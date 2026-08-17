import { query } from './client.js';

export async function initializeSchema() {
  const createLeadsTable = `
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(320) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      zip_code VARCHAR(10),
      service VARCHAR(100),
      message TEXT,
      ip_address VARCHAR(45),
      email_sent BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createIndexes = `
    CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
    CREATE INDEX IF NOT EXISTS idx_leads_service ON leads(service);
  `;

  try {
    await query(createLeadsTable);
    await query(createIndexes);
    console.log('✓ Database schema initialized');
  } catch (err) {
    console.error('Failed to initialize schema:', err);
    throw err;
  }
}

export async function insertLead(leadData) {
  const {
    firstName,
    lastName,
    email,
    phone,
    zipCode,
    service,
    message,
    ipAddress,
  } = leadData;

  const result = await query(
    `INSERT INTO leads (first_name, last_name, email, phone, zip_code, service, message, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [firstName, lastName, email, phone, zipCode || null, service || null, message || null, ipAddress || null]
  );

  return result.rows[0];
}

export async function getAllLeads() {
  const result = await query(
    'SELECT * FROM leads ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function updateLeadEmailStatus(leadId, emailSent) {
  await query(
    'UPDATE leads SET email_sent = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [emailSent, leadId]
  );
}
