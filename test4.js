const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Set headless: true for a headless browser
  const page = await browser.newPage();

  await page.goto('http://localhost:8080/realms/fetchusers/account', { waitUntil: 'networkidle2' });

  await page.type('#username', '123'); 
  // Enter password
  await page.type('#password', '123');

  await page.click('#kc-login');

  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // Optional
  const finalUrl = page.url();
  console.log('Final URL:', finalUrl);

  // You can extract the authorization code from the URL if needed
  const urlParams = new URLSearchParams(finalUrl.split('?')[1]);
  const authorizationCode = urlParams.get('code');
  console.log('urlparams', urlParams);

  // Close the browser
  await browser.close();
})();
