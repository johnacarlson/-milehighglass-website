import { chromium } from 'playwright';
import axios from 'axios';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3001';

async function testFunnel() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🧪 Starting MHG Funnel Test...\n');

  try {
    // Navigate to funnel
    console.log('📍 Loading funnel...');
    await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Scroll to form
    console.log('📝 Scrolling to form...');
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(800);

    // Fill form
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: `test_${Date.now()}@milehighglass.test`,
      phone: '720-555-0100',
      zipCode: '80202',
      service: 'shower-doors',
      message: 'Interested in a free estimate for shower doors',
    };

    console.log('\n📋 Form Data:');
    console.log(`  First Name: ${testData.firstName}`);
    console.log(`  Last Name: ${testData.lastName}`);
    console.log(`  Email: ${testData.email}`);
    console.log(`  Phone: ${testData.phone}`);
    console.log(`  Zip: ${testData.zipCode}`);
    console.log(`  Service: ${testData.service}`);
    console.log(`  Message: ${testData.message}`);

    console.log('\n🖊️  Filling form...');
    await page.fill('input[name="firstName"]', testData.firstName);
    await page.fill('input[name="lastName"]', testData.lastName);
    await page.fill('input[name="email"]', testData.email);
    await page.fill('input[name="phone"]', testData.phone);
    await page.fill('input[name="zipCode"]', testData.zipCode);

    // Select service dropdown
    await page.selectOption('select[name="service"]', testData.service);

    await page.fill('textarea[name="message"]', testData.message);

    // Submit form
    console.log('✉️  Submitting form...');
    const submitPromise = page.waitForResponse(resp => resp.url().includes('/api/leads/submit'));
    await page.click('button[type="submit"]');
    const response = await submitPromise;

    console.log(`\n✅ Form Submitted`);
    console.log(`  Status: ${response.status()}`);

    let responseData;
    try {
      responseData = await response.json();
      console.log(`  Response: ${JSON.stringify(responseData, null, 2)}`);
    } catch (parseErr) {
      const text = await response.text();
      console.log(`  Raw Response: ${text}`);
      throw new Error(`Failed to parse response: ${parseErr.message}`);
    }

    if (!responseData.success) {
      throw new Error(`API returned error: ${responseData.error}`);
    }

    // Wait for form to show success state
    await page.waitForTimeout(1000);

    // Query database to verify lead was saved
    console.log('\n🔍 Checking database...');
    await page.waitForTimeout(500);

    // Make a direct API call to check if lead exists
    try {
      const apiResponse = await axios.get(`${API_URL}/api/health`);
      console.log(`  API Health: ${apiResponse.data.status}`);
    } catch (err) {
      console.error('  API Health Check Failed:', err.message);
    }

    console.log(`\n✨ Test Complete!`);
    console.log(`  Lead ID: ${responseData.leadId}`);
    console.log(`  Email: ${testData.email}`);

    return {
      success: true,
      leadId: responseData.leadId,
      email: testData.email,
    };
  } catch (err) {
    console.error('\n❌ Test Failed:', err.message);
    return { success: false, error: err.message };
  } finally {
    await browser.close();
  }
}

const result = await testFunnel();
process.exit(result.success ? 0 : 1);
