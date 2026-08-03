import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto('https://milehighglassdenver.co', { waitUntil: 'networkidle' });

const labels = [
  { text: 'First Name', name: 'First Name' },
  { text: 'Last Name', name: 'Last Name' },
  { text: 'Email Address', name: 'Email Address' },
  { text: 'Phone Number', name: 'Phone Number' },
  { text: 'Zip Code', name: 'Zip Code' },
  { text: "I'm Interested In", name: "I'm Interested In" }
];

console.log('Checking live site labels at milehighglassdenver.co:\n');

for (const label of labels) {
  const el = await page.locator('label').filter({ hasText: label.text }).first();
  if (await el.isVisible()) {
    const color = await el.evaluate(e => window.getComputedStyle(e).color);
    const isWhite = color === 'rgb(255, 255, 255)';
    console.log(`${isWhite ? '✅' : '❌'} ${label.name}: ${color}`);
  }
}

await browser.close();
