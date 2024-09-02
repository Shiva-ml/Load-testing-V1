import http from 'k6/http';
import { check } from 'k6';

// Configuration
const BASE_URL = 'http://localhost:8080';
const REALM_NAME = 'k6_v1';
const ADMIN_USERNAME = 'admin';  // Replace with your admin username
const ADMIN_PASSWORD = 'admin';  // Replace with your admin password
const CLIENT_ID = 'admin-cli';

// Setup function to obtain the admin access token
export function setup() {
    const params = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    const payload = {
        client_id: CLIENT_ID,
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
        grant_type: 'password',
    };

    const res = http.post(`${BASE_URL}/realms/k6_v1/protocol/openid-connect/token`, payload, params);

    check(res, {
        'token retrieved': (r) => r.status === 200,
    });

    const token = res.json('access_token');
    return { token };
}

// Default function to create users
export default function (data) {
    const token = data.token;

    // Loop to create 10 users
    for (let i = 1; i <= 10; i++) {
        const userPayload = JSON.stringify({
            username: `testuser${i}`,
            enabled: true,
            firstName: `Test`,
            lastName: `User${i}`,
            email: `testuser${i}@example.com`,
        });

        const params = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        const res = http.post(`${BASE_URL}/admin/realms/${REALM_NAME}/users`, userPayload, params);

        check(res, {
            [`user ${i} created`]: (r) => r.status === 201,
        });
    }
}
