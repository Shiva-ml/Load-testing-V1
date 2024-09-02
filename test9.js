// combined - doesnt work properly - needs development

const puppeteer = require('puppeteer');
const axios = require('axios');


(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    let accessToken = null;

    // Log each request and its response
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

    // Navigate to the Keycloak account management page
    await page.goto('http://localhost:8080/realms/fetchusers/account', { waitUntil: 'networkidle2' });

    // Perform login
    await page.type('#username', '123'); // Replace with your username
    await page.type('#password', '123'); // Replace with your password
    await page.click('#kc-login');

    // Wait for the page to fully load after login
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Optionally capture the final URL
    const finalUrl = page.url();
    console.log('Final URL:', finalUrl);

    // Close the browser
    await browser.close();

    // Call the function
    introspectToken();


})();



// Your Keycloak configuration
const keycloakConfig = {
  introspectEndpoint: 'http://localhost:8080/realms/fetchusers/protocol/openid-connect/token/introspect',
  clientId: 'ch',
  clientSecret: '2ReEtaEbePJtzhAtN96jkBx6c6Xx5gD4',
  token: accessToken
};

// Function to introspect token
async function introspectToken() {
  try {
    const response = await axios.post(
      keycloakConfig.introspectEndpoint,
      new URLSearchParams({
        token: keycloakConfig.token,
        client_id: keycloakConfig.clientId,
        client_secret: keycloakConfig.clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('Introspection Response:', response.data);
  } catch (error) {
    console.error('Error during introspection:', error.response ? error.response.data : error.message);
  }
}


