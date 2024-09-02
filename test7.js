// calling introspect end point

const axios = require('axios');

const keycloakConfig = {
  introspectEndpoint: 'http://localhost:8080/realms/fetchusers/protocol/openid-connect/token/introspect',
  clientId: 'ch',
  clientSecret: '2ReEtaEbePJtzhAtN96jkBx6c6Xx5gD4',
  token: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlc3h5dENMR1dtU005M1pzTFVMTUlIcUVFQW52X1ZGYTJnaGFGRzN3VUV3In0.eyJleHAiOjE3MjUyNTgzNjYsImlhdCI6MTcyNTI1ODA2NiwiYXV0aF90aW1lIjoxNzI1MjU4MDY2LCJqdGkiOiIwMzA4NGVkOC1mODc4LTQ5MTEtYmEzYy03MGU1MGU5M2QwNzYiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvcmVhbG1zL2ZldGNodXNlcnMiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMGE0ODZkODYtZDA5Zi00Y2U3LWEzMDMtM2RlMDdlMTIxYzBjIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWNjb3VudC1jb25zb2xlIiwic2lkIjoiODE1N2MyOTctMWE0Yi00N2U0LWFjYjktOWQ4ZmQyZjE5ZGVjIiwiYWNyIjoiMSIsInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiZjEyMyBsMjMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiIxMjMiLCJnaXZlbl9uYW1lIjoiZjEyMyIsImZhbWlseV9uYW1lIjoibDIzIiwiZW1haWwiOiIxMjNAdGVzdC5jb20ifQ.GS6YI9hz1Ow3CrVGw5EGDvqKOv-TFzxLNgo1LcVwpLR33VuB5oGGlS4S95i3q-2qXJhFHtaBxnF_Et5EgK32i5L_DmkjCIm7YPJDjh1medh137m8LKxg5dkkVPrMQ2ZzBCQTxEVeYErP53gUW8vgo7TOnFEOC1YrjLpOAXRJ87UvYcIVjN6K_4W1T5_D0N1ah2gX8KnXEjAxZUzLrfRoupViKlzTkY9gTNH9g05S8lO7wFFRF4YyV4Qx4-W40Ag5Lu7XUCzWKsrD1BykXRAmFHmdCDeLPauPvySy8sWUccS5B30OW3hW-1Fd2Udm3WSSQh7r_nwIQr_MjULcfSgNSA'};

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

introspectToken();
