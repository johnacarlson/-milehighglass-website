import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto('https://milehighglassdenver.co', { waitUntil: 'networkidle' });

// Check the First Name label
const firstNameLabel = await page.locator('label').filter({ hasText: 'First Name' }).first();
const exists = await firstNameLabel.isVisible();

if (exists) {
  const color = await firstNameLabel.evaluate(el => window.getComputedStyle(el).color);
  console.log(`✅ First Name label visible: ${exists}`);
  console.log(`✅ Computed color: ${color}`);
  
  if (color === 'rgb(255, 255, 255)') {
    console.log('✅ Labels are WHITE - fix deployed successfully!');
  } else {
    console.log(`⚠️  Labels still showing: ${color}`);
  }
} else {
  console.log('❌ First Name label not found');
}

await browser.close();
