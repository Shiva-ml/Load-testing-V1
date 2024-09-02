// ui automating login


const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    page.on('response', async response => {
        const url = response.url();

        if (response.status() === 200 && response.headers()['content-type'].includes('application/json')) {
            try {
                const responseBody = await response.text();
                if (responseBody.includes('access_token') || responseBody.includes('refresh_token')) {
                    console.log('Response Body:', responseBody);
                    const data = JSON.parse(responseBody);
                    accessToken = data.access_token;
                    console.log('Access Token:', accessToken);
                }
            } catch (e) {
                console.error('Failed to get response body:', e);
            }
        }
    });

    await page.goto('http://localhost:8080/realms/fetchusers/account', { waitUntil: 'networkidle2' });

    // Perform login
    await page.type('#username', '123'); 
    await page.type('#password', '123'); 
    await page.click('#kc-login');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const finalUrl = page.url();
    console.log('Final URL:', finalUrl);

    await browser.close();
})();
