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

// Auth0 KONFIGURIEREN WIE IM PDF!
app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      // WICHTIG: Genau wie im PDF Seite 21!
      redirect_uri: window.location.origin + window.location.pathname
    }
  })
)

app.mount('#app')