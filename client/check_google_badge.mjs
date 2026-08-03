import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto('https://milehighglassdenver.co', { waitUntil: 'networkidle' });

// Find the Google badge link
const googleLink = await page.locator('a[href*="google.com/maps/place/Mile"]').first();

// Check if it exists
const exists = await googleLink.isVisible();
console.log(`✅ Google badge link visible: ${exists}`);

// Check if the image loads
const img = await googleLink.locator('img[alt="Google"]').first();
const imgExists = await img.isVisible();
console.log(`✅ Google logo image visible: ${imgExists}`);

// Get the link href
const href = await googleLink.getAttribute('href');
console.log(`✅ Link href: ${href ? 'Google Maps link found' : 'No href'}`);

// Check the text
const text = await googleLink.textContent();
console.log(`✅ Badge text: ${text.trim()}`);

await browser.close();
