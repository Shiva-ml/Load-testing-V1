import http from 'k6/http';
import { check, sleep } from 'k6';
import crypto from 'k6/crypto';

const keycloakConfig = {
  authorizationEndpoint: 'http://localhost:8080/realms/fetchusers/protocol/openid-connect/auth',
  tokenEndpoint: 'http://localhost:8080/realms/fetchusers/protocol/openid-connect/token',
  clientId: 'ch',
  clientSecret: '2ReEtaEbePJtzhAtN96jkBx6c6Xx5gD4',
  redirectUri: '*', 
  codeVerifier: 'lEnQhXMwpeibDA0TrLxKwxbwepl15jQO1qO3RAAGwLicnU1Rwy6Lw',
  scope: 'openid profile',
};

// Generate the code challenge from the code verifier
function generateCodeChallenge(codeVerifier) {
  return crypto.sha256(codeVerifier, 'base64url');
}

// Generate the authorization URL
const codeChallenge = generateCodeChallenge(keycloakConfig.codeVerifier);
const authUrl = `${keycloakConfig.authorizationEndpoint}?response_type=code&client_id=${keycloakConfig.clientId}&redirect_uri=${encodeURIComponent(keycloakConfig.redirectUri)}&scope=${encodeURIComponent(keycloakConfig.scope)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;

export default function () {
  // Step 1: Request Authorization Code
  let response = http.get(authUrl);
  
  // Check if authorization page is accessible
  check(response, {
    'Authorization page is accessible': (r) => r.status === 200,
  });

  // Step 2: Extract Authorization Code from Redirect URI
  // Note: You'll need to handle this part manually or via another script, as k6 doesn't support browser automation. For testing, you might want to use a dummy authorization code here.

  // Dummy authorization code (replace with actual code obtained manually)
  const authCode = '<your-authorization-code>';

  // Step 3: Exchange Authorization Code for Access Token
  const tokenResponse = http.post(keycloakConfig.tokenEndpoint, `grant_type=authorization_code&client_id=${keycloakConfig.clientId}&client_secret=${keycloakConfig.clientSecret}&code=${authCode}&redirect_uri=${encodeURIComponent(keycloakConfig.redirectUri)}&code_verifier=${keycloakConfig.codeVerifier}`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  // Check if token exchange was successful
  check(tokenResponse, {
    'Token exchange was successful': (r) => r.status === 200,
  });

  // Optional: Log the response for debugging
  console.log('Token Response:', tokenResponse.json());

  // Sleep to simulate real user behavior
  sleep(1);
}
