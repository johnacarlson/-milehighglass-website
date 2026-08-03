import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto('https://milehighglassdenver.co', { waitUntil: 'networkidle' });

// Check the First Name label
const firstNameLabel = await page.locator('label').filter({ hasText: 'First Name' }).first();
const exists = await firstNameLabel.isVisible();

if (exists) {
  const color = await firstNameLabel.evaluate(el => window.getComputedStyle(el).color);
  const classes = await firstNameLabel.getAttribute('class');
  console.log(`✅ First Name label visible: ${exists}`);
  console.log(`✅ Label classes: ${classes}`);
  console.log(`✅ Computed color: ${color}`);
} else {
  console.log('❌ First Name label not found');
}

await browser.close();
