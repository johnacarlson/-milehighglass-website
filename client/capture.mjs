import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1024 } });

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

// Scroll to testimonials section
const testimonials = await page.locator('h2:has-text("REAL REVIEWS")');
if (await testimonials.isVisible()) {
  await testimonials.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  // Screenshot the section
  await page.screenshot({ path: '/tmp/mhg-testimonials.png', fullPage: false });
  console.log('✓ Screenshot captured');
} else {
  console.log('Testimonials section not found');
}

await browser.close();
