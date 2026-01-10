<template>
  <div class="account-page">
    <!-- Header -->
    <div class="account-header">
      <h1><i class="bi bi-person-circle" aria-hidden="true"></i> Mein Profil</h1>
      <p class="subtitle">Verwalten Sie Ihre persönlichen Daten</p>
    </div>

    <!-- Content -->
    <div class="account-content">
      <!-- Loading -->
      <div v-if="loading" class="loading-state" aria-live="polite" aria-busy="true">
        <div class="spinner"></div>
        <p>Lade Profildaten...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state" role="alert" aria-live="assertive">
        <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
        <h3>Fehler beim Laden</h3>
        <p>{{ error }}</p>
        <button @click="loadUserData" class="btn-primary">
          <i class="bi bi-arrow-clockwise" aria-hidden="true"></i> Erneut versuchen
        </button>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-message" role="alert" aria-live="polite">
        <i class="bi bi-check-circle" aria-hidden="true"></i>
        <p>{{ successMessage }}</p>
        <button @click="successMessage = ''" class="btn-close-msg" aria-label="Meldung schließen">
          <i class="bi bi-x" aria-hidden="true"></i>
        </button>
      </div>

      <!-- Form -->
      <div v-else class="profile-form">
        <!-- Profile Card -->
        <div class="form-card">
          <div class="card-header">
            <h2><i class="bi bi-person-badge" aria-hidden="true"></i> Persönliche Daten</h2>
          </div>

          <form @submit.prevent="updateUser" aria-label="Profilformular">
            <div class="form-group">
              <label for="name">Name</label>
              <input 
                id="name"
                type="text" 
                v-model="currentUser.name" 
                placeholder="Max Mustermann" 
                required
                aria-required="true"
                :disabled="saving"
              >
            </div>

            <div class="form-group">
              <label for="email">E-Mail</label>
              <input 
                id="email"
                type="email" 
                v-model="currentUser.email" 
                placeholder="max@mustermann.de" 
                required
                aria-required="true"
                :disabled="saving"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              >
            </div>

            <div class="form-group">
              <label for="phone">Telefon (optional)</label>
              <input 
                id="phone"
                type="tel" 
                v-model="currentUser.phone" 
                placeholder="+49 123 456789"
                :disabled="saving"
                pattern="[0-9+\s\-()]+"
              >
            </div>

            <div class="form-group">
              <label for="address">Adresse (optional)</label>
              <textarea 
                id="address"
                v-model="currentUser.address" 
                placeholder="Musterstraße 123, 12345 Musterstadt" 
                rows="3"
                :disabled="saving"
              ></textarea>
            </div>

            <div class="form-actions">
              <button 
                type="button" 
                @click="resetForm" 
                class="btn-secondary"
                :disabled="saving"
                aria-label="Formular zurücksetzen"
              >
                <i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i> Zurücksetzen
              </button>
              <button 
                type="submit" 
                class="btn-primary" 
                :disabled="saving || !hasChanges"
                aria-label="Änderungen speichern"
              >
                <span v-if="saving">
                  <i class="bi bi-arrow-clockwise spin" aria-hidden="true"></i> Speichern...
                </span>
                <span v-else>
                  <i class="bi bi-check-lg" aria-hidden="true"></i> Speichern
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Quick Links -->
        <div class="quick-links">
          <h3><i class="bi bi-lightning" aria-hidden="true"></i> Schnellzugriff</h3>
          <div class="link-grid">
            <router-link to="/my-orders" class="link-card" aria-label="Meine Bestellungen">
              <i class="bi bi-receipt" aria-hidden="true"></i>
              <span>Bestellungen</span>
            </router-link>
            <router-link to="/warenkorb" class="link-card" aria-label="Zum Warenkorb">
              <i class="bi bi-cart" aria-hidden="true"></i>
              <span>Warenkorb</span>
            </router-link>
            <router-link to="/" class="link-card" aria-label="Zur Startseite">
              <i class="bi bi-house" aria-hidden="true"></i>
              <span>Startseite</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

const { getAccessTokenSilently } = useAuth0()

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const successMessage = ref('')
const currentUser = ref({ 
  name: '', 
  email: '', 
  phone: '', 
  address: '' 
})
const originalUser = ref({})

// Computed Properties
const hasChanges = computed(() => {
  return JSON.stringify(currentUser.value) !== JSON.stringify(originalUser.value)
})

const loadUserData = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    const token = await getAccessTokenSilently()
    
    const response = await fetch('http://localhost:8081/api/profile', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    if (response.status === 404) {
      error.value = 'Profil nicht gefunden. Bitte kontaktieren Sie den Support.'
      return
    }
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Server-Fehler: ${response.status} - ${errorText}`)
    }
    
    const userData = await response.json()
    
    currentUser.value = {
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || ''
    }
    originalUser.value = { ...currentUser.value }
    
  } catch (err) {
    console.error('Fehler beim Laden:', err)
    error.value = err.message || 'Konnte Profildaten nicht laden. Bitte versuchen Sie es später erneut.'
    
    // Fallback für Entwicklung
    if (import.meta.env.DEV) {
      currentUser.value = {
        name: 'Test Benutzer',
        email: 'test@example.com',
        phone: '+49 123 456789',
        address: 'Musterstraße 42, 12345 Berlin'
      }
      originalUser.value = { ...currentUser.value }
    }
  } finally {
    loading.value = false
  }
}

const updateUser = async () => {
  if (!hasChanges.value) return
  
  saving.value = true
  error.value = ''
  
  try {
    const token = await getAccessTokenSilently()
    
    const response = await fetch('http://localhost:8081/api/profile', {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(currentUser.value)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Update fehlgeschlagen: ${response.status} - ${errorText}`)
    }
    
    const updatedData = await response.json()
    
    currentUser.value = {
      name: updatedData.name || '',
      email: updatedData.email || '',
      phone: updatedData.phone || '',
      address: updatedData.address || ''
    }
    originalUser.value = { ...currentUser.value }
    
    successMessage.value = 'Ihre Daten wurden erfolgreich gespeichert!'
    
  } catch (err) {
    console.error('Fehler beim Update:', err)
    error.value = `Speichern fehlgeschlagen: ${err.message}`
    
    // Test-Erfolg für Entwicklung
    if (import.meta.env.DEV) {
      console.log('DEV MODE: Simuliere erfolgreiches Update')
      originalUser.value = { ...currentUser.value }
      successMessage.value = 'DEV: Daten gespeichert (simuliert)'
    }
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  currentUser.value = { ...originalUser.value }
  error.value = ''
  successMessage.value = ''
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.account-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, #2d3748 100%);
  padding: 120px 20px 40px;
  color: var(--color-background-light);
}

.account-header {
  text-align: center;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.account-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.subtitle {
  opacity: 0.8;
  font-size: 1.1rem;
  font-weight: 300;
}

.account-content {
  max-width: 800px;
  margin: 0 auto;
}

/* Loading & Error States */
.loading-state, .error-state {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid var(--color-accent-pink);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state i {
  font-size: 3rem;
  color: var(--color-accent-pink);
  margin-bottom: 1rem;
}

.error-state h3 {
  margin-bottom: 0.5rem;
  color: #ff6b6b;
}

.error-state p {
  margin-bottom: 1.5rem;
  opacity: 0.9;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* Success Message */
.success-message {
  background: rgba(46, 213, 115, 0.15);
  border: 1px solid rgba(46, 213, 115, 0.3);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-background-light);
  position: relative;
  animation: fadeIn 0.3s ease;
}

.success-message i {
  color: #2ed573;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.btn-close-msg {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--color-background-light);
  cursor: pointer;
  opacity: 0.7;
  padding: 0.25rem;
  border-radius: 4px;
}

.btn-close-msg:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Form Card */
.form-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  color: var(--color-primary-dark);
  transition: all 0.3s;
  font-family: var(--font-roboto);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-accent-pink);
  box-shadow: 0 0 0 3px rgba(226, 97, 145, 0.2);
  background: white;
}

.form-group input:disabled,
.form-group textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.8);
}

.form-group input.error,
.form-group textarea.error {
  border-color: var(--color-danger);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

/* Buttons */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-roboto);
}

.btn-primary {
  background: var(--color-accent-pink);
  color: white;
  border: 2px solid var(--color-accent-pink);
}

.btn-primary:hover:not(:disabled) {
  background: #d05583;
  border-color: #d05583;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(226, 97, 145, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.spin {
  animation: spin 1s linear infinite;
}

/* Quick Links */
.quick-links {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.quick-links h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.link-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-decoration: none;
  color: var(--color-background-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s;
}

.link-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  border-color: var(--color-accent-pink);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.link-card i {
  font-size: 1.8rem;
  color: var(--color-accent-pink);
}

.link-card span {
  font-weight: 500;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 768px) {
  .account-page {
    padding: 100px 1rem 2rem;
  }
  
  .account-header h1 {
    font-size: 2rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .link-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-card,
  .quick-links {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .link-grid {
    grid-template-columns: 1fr;
  }
  
  .account-header h1 {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>