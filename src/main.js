import './assets/style.css'
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

// Auth0 als letztes (weil es Router nutzen könnte)
app.use(createAuth0({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    redirect_uri: window.location.origin
  }
}))

// DEBUG: Prüfe ob Umgebungsvariablen geladen wurden
console.log('=== Auth0 Konfiguration ===')
console.log('Domain:', import.meta.env.VITE_AUTH0_DOMAIN)
console.log('Client ID:', import.meta.env.VITE_AUTH0_CLIENT_ID)
console.log('Audience:', import.meta.env.VITE_AUTH0_AUDIENCE)
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)

app.mount('#app')