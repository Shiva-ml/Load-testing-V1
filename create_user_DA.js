import http from 'k6/http';
import { sleep, check } from 'k6';
import urlencode from 'https://jslib.k6.io/form-urlencoded/3.0.0/index.js';

export let options = {
  vus: 1,
  iterations: 1,
};

// Admin credentials for Keycloak or similar system
const adminUrl = 'http://localhost:8080/auth/admin/realms/htc/users';
const adminToken = 'YOUR_ADMIN_ACCESS_TOKEN'; // Replace with a valid admin access token

// User details to create
const userPayload = JSON.stringify({
  username: 'newuser',
  email: 'newuser@example.com',
  enabled: true,
  credentials: [
    {
      type: 'password',
      value: 'newpassword',
      temporary: false
    }
  ],
  firstName: 'New',
  lastName: 'User'
});

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
  };

  // Create the user
  const res = http.post(adminUrl, userPayload, params);

  check(res, {
    'is status 201': (r) => r.status === 201,
    'has user ID in response': (r) => r.json().id,
  });

  sleep(1);
}
