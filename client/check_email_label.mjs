import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

// Check Email label
const emailLabel = await page.locator('label').filter({ hasText: 'Email Address' }).first();
const color = await emailLabel.evaluate(el => window.getComputedStyle(el).color);
console.log(`✅ Email Address label color: ${color}`);

// Check I'm Interested In label
const serviceLabel = await page.locator('label').filter({ hasText: "I'm Interested In" }).first();
const serviceColor = await serviceLabel.evaluate(el => window.getComputedStyle(el).color);
console.log(`✅ I'm Interested In label color: ${serviceColor}`);

await browser.close();
