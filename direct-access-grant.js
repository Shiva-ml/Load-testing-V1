import http from 'k6/http';
import { sleep, check } from 'k6';
import urlencode from 'https://jslib.k6.io/form-urlencoded/3.0.0/index.js';

export let options = {
  vus: 1,
  iterations: 1,
};

export default function () {
  // Hardcoded values
  const url = 'http://localhost:8080/realms/htc/protocol/openid-connect/token';
  const payload = urlencode({
    username: 'john',
    password: '1234',
    client_id: 'ch',
    client_secret: 'gTLAFtg6irXu13BiZSgo8BX9godnTkRF',
    grant_type: 'password'
  });

  const params = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'is status 200': (r) => r.status === 200,
    'has JWT access token': (r) => r.json().access_token,
    'has JWT refresh token': (r) => r.json().refresh_token,
  });

  sleep(1);
}
