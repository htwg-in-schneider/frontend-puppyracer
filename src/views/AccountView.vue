<template>
  <div class="account-page">
    <!-- Header -->
    <div class="account-header">
      <h1><i class="bi bi-person-circle"></i> Mein Profil</h1>
      <p class="subtitle">Verwalten Sie Ihre persönlichen Daten</p>
    </div>

    <!-- Content -->
    <div class="account-content">
      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Lade Profildaten...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <i class="bi bi-exclamation-triangle"></i>
        <h3>Fehler beim Laden</h3>
        <p>{{ error }}</p>
        <button @click="loadUserData" class="btn-primary">Erneut versuchen</button>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-message">
        <i class="bi bi-check-circle"></i>
        <p>{{ successMessage }}</p>
        <button @click="successMessage = ''" class="btn-close-msg">
          <i class="bi bi-x"></i>
        </button>
      </div>

      <!-- Form -->
      <div v-else class="profile-form">
        <!-- Profile Card -->
        <div class="form-card">
          <div class="card-header">
            <h2><i class="bi bi-person-badge"></i> Persönliche Daten</h2>
          </div>

          <form @submit.prevent="updateUser">
            <div class="form-group">
              <label>Name</label>
              <input type="text" v-model="currentUser.name" placeholder="Max Mustermann" required>
            </div>

            <div class="form-group">
              <label>E-Mail</label>
              <input type="email" v-model="currentUser.email" placeholder="max@mustermann.de" required>
            </div>

            <div class="form-group">
              <label>Telefon</label>
              <input type="tel" v-model="currentUser.phone" placeholder="+49 123 456789">
            </div>

            <div class="form-group">
              <label>Adresse</label>
              <textarea v-model="currentUser.address" placeholder="Musterstraße 123, 12345 Musterstadt" rows="3"></textarea>
            </div>

            <div class="form-actions">
              <button type="button" @click="resetForm" class="btn-secondary">
                <i class="bi bi-arrow-counterclockwise"></i> Zurücksetzen
              </button>
              <button type="submit" class="btn-primary" :disabled="saving">
                <span v-if="saving"><i class="bi bi-arrow-clockwise spin"></i> Speichern...</span>
                <span v-else><i class="bi bi-check-lg"></i> Speichern</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Quick Links -->
        <div class="quick-links">
          <h3><i class="bi bi-lightning"></i> Schnellzugriff</h3>
          <div class="link-grid">
            <router-link to="/my-orders" class="link-card">
              <i class="bi bi-receipt"></i>
              <span>Bestellungen</span>
            </router-link>
            <router-link to="/warenkorb" class="link-card">
              <i class="bi bi-cart"></i>
              <span>Warenkorb</span>
            </router-link>
            <router-link to="/" class="link-card">
              <i class="bi bi-house"></i>
              <span>Startseite</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

const loadUserData = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    const token = await getAccessTokenSilently()
    console.log('Lade Profildaten mit Token...')
    
    const response = await fetch('http://localhost:8081/api/profile', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Response Status:', response.status)
    
    if (response.status === 404) {
      error.value = 'Profil nicht gefunden. Bitte kontaktieren Sie den Support.'
      return
    }
    
    if (!response.ok) {
      throw new Error(`Server-Fehler: ${response.status}`)
    }
    
    const userData = await response.json()
    console.log('Empfangene Daten:', userData)
    
    currentUser.value = {
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || ''
    }
    originalUser.value = { ...currentUser.value }
    
  } catch (err) {
    console.error('Fehler beim Laden:', err)
    error.value = err.message || 'Konnte Profildaten nicht laden'
    
    // Fallback für Entwicklung
    currentUser.value = {
      name: 'Test Benutzer',
      email: 'test@example.com',
      phone: '+49 123 456789',
      address: 'Musterstraße 42, 12345 Berlin'
    }
    originalUser.value = { ...currentUser.value }
  } finally {
    loading.value = false
  }
}

const updateUser = async () => {
  saving.value = true
  error.value = ''
  
  try {
    const token = await getAccessTokenSilently()
    console.log('Sende Update mit:', currentUser.value)
    
    const response = await fetch('http://localhost:8081/api/profile', {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(currentUser.value)
    })
    
    console.log('Update Response Status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Update fehlgeschlagen:', errorText)
      throw new Error(`Update fehlgeschlagen: ${response.status}`)
    }
    
    const updatedData = await response.json()
    console.log('Aktualisierte Daten:', updatedData)
    
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
  console.log('AccountView mounted')
  loadUserData()
})
</script>

<style scoped>
/* Erfolgsmeldung */
.success-message {
  background: rgba(40, 167, 69, 0.2);
  border: 1px solid rgba(40, 167, 69, 0.4);
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  position: relative;
}

.success-message i {
  color: #28a745;
  font-size: 1.5rem;
}

.btn-close-msg {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  opacity: 0.7;
}

.btn-close-msg:hover {
  opacity: 1;
}

/* Rest des Styles bleibt gleich wie vorher */
.account-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #8b7355 0%, #a8916d 100%);
  padding: 100px 20px 40px;
  color: white;
}

.account-header {
  text-align: center;
  margin-bottom: 2rem;
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
  opacity: 0.9;
  font-size: 1.1rem;
}

.account-content {
  max-width: 800px;
  margin: 0 auto;
}

/* Loading & Error */
.loading-state, .error-state {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #e26191;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

.error-state i {
  font-size: 3rem;
  color: #e26191;
  margin-bottom: 1rem;
}

.error-state h3 {
  margin-bottom: 0.5rem;
}

.error-state p {
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

/* Form Card */
.form-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.card-header h2 {
  margin: 0;
  font-size: 1.4rem;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  color: #333;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #e26191;
  background: white;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

/* Buttons */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: rgba(226, 97, 145, 0.3);
  color: white;
  border: 1px solid rgba(226, 97, 145, 0.5);
}

.btn-primary:hover:not(:disabled) {
  background: rgba(226, 97, 145, 0.5);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.spin {
  animation: spin 1s linear infinite;
}

/* Quick Links */
.quick-links {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.quick-links h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.4rem;
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
  border-radius: 15px;
  padding: 1.5rem 1rem;
  text-decoration: none;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s;
}

.link-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  border-color: #e26191;
}

.link-card i {
  font-size: 1.8rem;
}

/* Responsive */
@media (max-width: 768px) {
  .account-header h1 {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .link-grid {
    grid-template-columns: 1fr;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>