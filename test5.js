const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Log each request and its response
  page.on('response', response => {
    if (response.request().redirectChain().length) {
      console.log(`Redirected from: ${response.request().redirectChain()[0].url()} to: ${response.url()}`);
    } else {
      console.log(`Navigated to: ${response.url()}`);
    }
  });

  // Navigate to the initial URL
  await page.goto('http://localhost:8080/realms/fetchusers/account', { waitUntil: 'networkidle2' });

  // Perform login
  await page.type('#username', '123'); // Replace with your username
  await page.type('#password', '123'); // Replace with your password
  await page.click('#kc-login');

  // Wait for navigation and log the final URL
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  console.log('Final URL:', page.url());

  // Close the browser
  await browser.close();
})();
