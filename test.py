import requests
import base64
import hashlib
import os
import urllib.parse

# Keycloak settings
client_id = 'ch'
client_secret = '2ReEtaEbePJtzhAtN96jkBx6c6Xx5gD4'
redirect_uri = '*'
authorization_endpoint = 'http://localhost:8080/realms/fetchusers/protocol/openid-connect/auth'
token_endpoint = 'http://localhost:8080/realms/fetchusers/protocol/openid-connect/token'

# Step 1: Generate code verifier and challenge
code_verifier = base64.urlsafe_b64encode(os.urandom(40)).decode('utf-8').rstrip('=')
code_challenge = base64.urlsafe_b64encode(hashlib.sha256(code_verifier.encode('utf-8')).digest()).decode('utf-8').rstrip('=')

# Step 2: Redirect user to Keycloak for authentication (programmatically perform the redirect)
params = {
    'client_id': client_id,
    'redirect_uri': redirect_uri,
    'response_type': 'code',
    'scope': 'openid',
    'code_challenge': code_challenge,
    'code_challenge_method': 'S256'
}

authorization_url = f"{authorization_endpoint}?{urllib.parse.urlencode(params)}"
print("Visit the following URL to authenticate:")
print(authorization_url)

# Simulate user visiting the authorization URL, logging in, and Keycloak redirecting back with an authorization code.
# You would need to handle this part based on your setup (e.g., via a web browser automation tool or manually).

# Step 3: Exchange the authorization code for tokens
# Replace 'authorization_code_received_after_login' with the actual authorization code received after login.
code = 'authorization_code_received_after_login'

token_data = {
    'grant_type': 'authorization_code',
    'client_id': client_id,
    'client_secret': client_secret,
    'code': code,
    'redirect_uri': redirect_uri,
    'code_verifier': code_verifier
}

response = requests.post(token_endpoint, data=token_data)
tokens = response.json()

print("Access Token:", tokens['access_token'])
print("Refresh Token:", tokens['refresh_token'])
print("ID Token:", tokens['id_token'])
