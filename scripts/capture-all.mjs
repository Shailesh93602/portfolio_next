import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const eduscaleDir = path.join(process.cwd(), "public", "Images", "eduscale");
const khatagoDir = path.join(process.cwd(), "public", "Images", "khatago");

fs.mkdirSync(eduscaleDir, { recursive: true });
fs.mkdirSync(khatagoDir, { recursive: true });

async function captureEduScale() {
  console.log("Starting EduScale capture...");
  const browser = await chromium.launch({ headless: true });
  
  for (const theme of ['dark', 'light']) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: theme
    });
    
    // Set cookie or local storage to enforce theme if needed. 
    // Usually colorScheme: theme sets the prefers-color-scheme media query.
    const page = await context.newPage();
    
    try {
      await page.goto('https://eduscale.vercel.app/auth');
      await page.waitForTimeout(3000);
      
      const emailInput = await page.$('input[type="email"]');
      if (emailInput) {
          await emailInput.fill('testuser@yopmail.com');
          await page.fill('input[type="password"]', 'Test@123');
          await page.click('button[type="submit"]');
          await page.waitForURL('**/dashboard', { timeout: 15000 });
      } else {
          console.log("Already logged in or login not found");
      }
      
      await page.waitForTimeout(3000); 
      await page.screenshot({ path: path.join(eduscaleDir, `dashboard_${theme}.png`), fullPage: false });
      
      await page.goto('https://eduscale.vercel.app/career-roadmap');
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(eduscaleDir, `roadmap_${theme}.png`), fullPage: false });

      await page.goto('https://eduscale.vercel.app/coding-challenges');
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(eduscaleDir, `challenges_${theme}.png`), fullPage: false });

      await page.goto('https://eduscale.vercel.app/battle-zone');
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(eduscaleDir, `battle_${theme}.png`), fullPage: false });
      
    } catch(e) {
      console.log('Error in EduScale:', e);
    }
    await context.close();
  }
  await browser.close();
  console.log("EduScale done.");
}

async function captureKhataGo() {
  console.log("Starting KhataGO capture...");
  const browser = await chromium.launch({ headless: true });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light'
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://khatago.vercel.app/login');
    await page.waitForTimeout(3000);

    const phoneInput = await page.$('input[type="tel"]') || await page.$('input[name="phone"]');
    if (phoneInput) {
       await phoneInput.fill('9313026530');
       await page.locator('button[type="submit"], button:has-text("Get OTP"), button:has-text("Login")').first().click();
       await page.waitForTimeout(3000);
       const otpInput = await page.$('input[type="text"]') || await page.$('input[name="otp"]');
       if (otpInput) {
          await otpInput.fill('123456');
          await page.locator('button[type="submit"], button:has-text("Verify"), button:has-text("Submit")').first().click();
          await page.waitForURL('**/dashboard', { timeout: 15000 });
       }
    }
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(khatagoDir, `dashboard.png`), fullPage: false });

    await page.goto('https://khatago.vercel.app/transactions');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(khatagoDir, `transactions.png`), fullPage: false });

    await page.goto('https://khatago.vercel.app/reports/monthly');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(khatagoDir, `reports.png`), fullPage: false });

  } catch(e) {
    console.log('Error in KhataGo:', e);
  }

  await context.close();
  await browser.close();
  console.log("KhataGO done.");
}

// Top level execution
await captureEduScale();
await captureKhataGo();
