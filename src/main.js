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

// Auth0 KONFIGURATION
app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      redirect_uri: window.location.origin + window.location.pathname,
    },
    useRefreshTokens: false,
    cacheLocation: 'localstorage',
  })
)

// Debug: Prüfe ob Auth0 korrekt initialisiert
console.log('=== AUTH0 INIT CHECK ===')
console.log('Redirect URI:', window.location.origin + window.location.pathname)
console.log('Domain:', import.meta.env.VITE_AUTH0_DOMAIN)
console.log('Client ID:', import.meta.env.VITE_AUTH0_CLIENT_ID ? '✓ Loaded' : '✗ Missing')

app.mount('#app')