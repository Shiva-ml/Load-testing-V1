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

    const res = http.post(`${BASE_URL}/realms/${REALM_NAME}/protocol/openid-connect/token`, payload, params);

    check(res, {
        'token retrieved': (r) => r.status === 200,
    });

    const token = res.json('access_token');
    return { token };
}

// Default function to create users and set their passwords
export default function (data) {
    const token = data.token;

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

        // Create the user
        const createUserRes = http.post(`${BASE_URL}/admin/realms/${REALM_NAME}/users`, userPayload, params);

        check(createUserRes, {
            [`user ${i} created`]: (r) => r.status === 201,
        });

        // If the user is created successfully, retrieve their ID
        if (createUserRes.status === 201) {
            const locationHeader = createUserRes.headers.Location;
            const userId = locationHeader.split('/').pop(); // Extract the user ID from the location header

            // Set the user's password
            const passwordPayload = JSON.stringify({
                type: 'password',
                temporary: false,
                value: '123',
            });

            const setPasswordRes = http.put(
                `${BASE_URL}/admin/realms/${REALM_NAME}/users/${userId}/reset-password`,
                passwordPayload,
                params
            );

            check(setPasswordRes, {
                [`password for user ${i} set`]: (r) => r.status === 204,
            });
        }
    }
}
