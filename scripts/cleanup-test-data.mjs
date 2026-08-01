import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  console.log('=== Cleaning Up Test Data ===\n');

  // Find test entries
  const findResult = await pool.query(`
    SELECT id, first_name, last_name, email
    FROM leads
    WHERE first_name IN ('RateTest', 'Test', 'XSS')
    ORDER BY id DESC
  `);

  if (findResult.rows.length > 0) {
    console.log(`Found ${findResult.rows.length} test entries:\n`);
    findResult.rows.forEach(row => {
      console.log(`  ✗ ID ${row.id}: ${row.first_name} ${row.last_name} (${row.email})`);
    });

    // Delete test entries
    const deleteResult = await pool.query(`
      DELETE FROM leads
      WHERE first_name IN ('RateTest', 'Test', 'XSS')
    `);
    console.log(`\n✓ Deleted ${deleteResult.rowCount} test entries from database`);
  } else {
    console.log('✓ No test entries found');
  }

  process.exit(0);
} catch (err) {
  console.error('Error:', err.message || err);
  console.error('Full error:', err);
  process.exit(1);
} finally {
  try {
    await pool.end();
  } catch (e) {
    // ignore
  }
}
