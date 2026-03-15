const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://eduscale.vercel.app';
const IMAGES_DIR = '/Users/shaileshchaudhary/Desktop/Coding/portfolio_next/public/Images';

async function finalCapture() {
  const browser = await chromium.launch({ headless: true });
  
  for (const theme of ['dark', 'light']) {
    console.log(`\n--- STARTING ${theme.toUpperCase()} THEME ---`);
    const context = await browser.newContext({ 
      viewport: { width: 1440, height: 1200 }, 
      colorScheme: theme 
    });
    const page = await context.newPage();

    try {
      console.log('Logging in...');
      await page.goto(`${BASE_URL}/auth/login`);
      await page.locator('#login-email').fill('testuser@yopmail.com');
      await page.locator('#login-password').fill('Test@123');
      await page.keyboard.press('Enter');
      
      await page.waitForURL('**/dashboard', { timeout: 30000 });
      console.log('Authenticated!');
      
      const pages = [
        { name: 'dashboard', url: `${BASE_URL}/dashboard` },
        { name: 'roadmap', url: `${BASE_URL}/career-roadmap` },
        { name: 'challenges', url: `${BASE_URL}/coding-challenges` }
      ];

      for (const p of pages) {
        console.log(`Capturing ${p.name} in ${theme}...`);
        await page.goto(p.url, { waitUntil: 'networkidle' });
        await page.waitForTimeout(10000); // Give plenty of time
        await page.screenshot({ 
          path: path.join(IMAGES_DIR, `eduscale_${p.name}_${theme}.png`), 
          fullPage: true 
        });
      }
    } catch (e) {
      console.log(`ERROR:`, e.message);
    }
    await context.close();
  }

  await browser.close();
}

finalCapture();
