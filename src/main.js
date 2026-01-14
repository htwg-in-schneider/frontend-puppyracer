// DEBUG: Auth0 Konfiguration prüfen
console.log('=== AUTH0 SETUP START ===');
const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    redirect_uri: window.location.origin + window.location.pathname,
  },
  useRefreshTokens: false,
  cacheLocation: 'localstorage',
};

console.log('Auth0 Config:', auth0Config);
console.log('Env variables:', {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  apiBase: import.meta.env.VITE_API_BASE_URL
});

try {
  const auth0 = createAuth0(auth0Config);
  console.log('Auth0 created successfully:', !!auth0);
  
  // Test: Sind die Methoden da?
  console.log('Auth0 methods check:', {
    loginWithRedirect: typeof auth0.loginWithRedirect,
    logout: typeof auth0.logout,
    isAuthenticated: typeof auth0.isAuthenticated,
    getUser: typeof auth0.getUser,
    getAccessTokenSilently: typeof auth0.getAccessTokenSilently
  });
  
  app.use(auth0);
  console.log('=== AUTH0 SETUP COMPLETE ===');
} catch (error) {
  console.error('=== AUTH0 SETUP FAILED ===', error);
}