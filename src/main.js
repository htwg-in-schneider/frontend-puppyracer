import './assets/style.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'

const app = createApp(App)

// Pinia (State Management) zuerst
const pinia = createPinia()
app.use(pinia)

// Dann Router
app.use(router)

// Auth0 KONFIGURIEREN FÜR HASH MODE
app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    
      redirect_uri: window.location.origin + window.location.pathname,
      
    },
    // Wichtig für korrektes Verhalten
    useRefreshTokens: false,
    cacheLocation: 'localstorage',
    
  })
)

app.mount('#app')

// Debug: Logge die Auth0 Konfiguration (nur in Entwicklung)
if (import.meta.env.DEV) {
  console.log('Auth0 Config:', {
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    redirectUri: window.location.origin + window.location.pathname,
    fullUrl: window.location.href
  })
}