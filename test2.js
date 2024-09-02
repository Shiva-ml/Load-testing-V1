import http from 'k6/http';
import { check, sleep } from 'k6';

const keycloakConfig = {
  authorizationEndpoint: 'http://localhost:8080/realms/fetchusers/protocol/openid-connect/auth',
  tokenEndpoint: 'http://localhost:8080/realms/fetchusers/protocol/openid-connect/token',
  clientId: 'ch',
  clientSecret: '2ReEtaEbePJtzhAtN96jkBx6c6Xx5gD4', // Include client secret here
  redirectUri: '*',
  codeVerifier: 'lEnQhXMwpeibDA0TrLxKwxbwepl15jQO1qO3RAAGwLicnU1Rwy6Lw',
  scope: 'openid profile',
};

const authUrl = `${keycloakConfig.authorizationEndpoint}?response_type=code&client_id=${keycloakConfig.clientId}&redirect_uri=${encodeURIComponent(keycloakConfig.redirectUri)}&scope=${encodeURIComponent(keycloakConfig.scope)}&code_challenge=<your-code-challenge>&code_challenge_method=S256`;

export default function () {
  let response = http.get(authUrl);
  
  check(response, {
    'Authorization page is accessible': (r) => r.status === 200,
  });

  
  // Dummy authorization code 
  const authCode = '<your-authorization-code>';

  const tokenResponse = http.post(keycloakConfig.tokenEndpoint, `grant_type=authorization_code&client_id=${keycloakConfig.clientId}&client_secret=${keycloakConfig.clientSecret}&code=${authCode}&redirect_uri=${encodeURIComponent(keycloakConfig.redirectUri)}&code_verifier=${keycloakConfig.codeVerifier}`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  check(tokenResponse, {
    'Token exchange was successful': (r) => r.status === 200,
  });

  console.log(tokenResponse.json());

  sleep(1);
}
