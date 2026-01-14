<template>
  <div class="account-page">
    <div class="account-header">
      <h1><i class="bi bi-person-circle"></i> Mein Profil</h1>
      <p>Verwalten Sie Ihre persönlichen Daten</p>
    </div>

    <div class="account-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Lade Profildaten...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <i class="bi bi-exclamation-triangle"></i>
        <h3>Fehler beim Laden</h3>
        <p>{{ error }}</p>
        <button @click="loadUserData" class="btn-primary">
          <i class="bi bi-arrow-clockwise"></i> Erneut versuchen
        </button>
      </div>

      <div v-if="successMessage" class="success-message">
        <i class="bi bi-check-circle"></i>
        <p>{{ successMessage }}</p>
        <button @click="successMessage = ''" class="btn-close-msg">
          <i class="bi bi-x"></i>
        </button>
      </div>

      <div v-else class="profile-form">
        <div class="form-card">
          <div class="card-header">
            <h2><i class="bi bi-person-badge"></i> Persönliche Daten</h2>
          </div>

          <form @submit.prevent="updateUser">
            <div class="form-group">
              <label>Name</label>
              <input type="text" v-model="currentUser.name" :disabled="saving" required>
            </div>

            <div class="form-group">
              <label>E-Mail</label>
              <input type="email" v-model="currentUser.email" :disabled="saving" required>
            </div>

            <div class="form-group">
              <label>Telefon (optional)</label>
              <input type="tel" v-model="currentUser.phone" :disabled="saving">
            </div>

            <div class="form-group">
              <label>Adresse (optional)</label>
              <textarea v-model="currentUser.address" :disabled="saving" rows="2"></textarea>
            </div>

            <div class="form-actions">
              <button type="button" @click="resetForm" class="btn-secondary" :disabled="saving">
                <i class="bi bi-arrow-counterclockwise"></i> Zurücksetzen
              </button>
              <button type="submit" class="btn-primary" :disabled="saving || !hasChanges">
                <span v-if="saving">
                  <i class="bi bi-arrow-clockwise spin"></i> Speichern...
                </span>
                <span v-else>
                  <i class="bi bi-check-lg"></i> Speichern
                </span>
              </button>
            </div>
          </form>
        </div>

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

const hasChanges = computed(() => {
  return JSON.stringify(currentUser.value) !== JSON.stringify(originalUser.value)
})

const loadUserData = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    const token = await getAccessTokenSilently()
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    if (response.status === 404) {
      error.value = 'Profil nicht gefunden'
      return
    }
    
    if (!response.ok) {
      throw new Error(`Fehler: ${response.status}`)
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
    error.value = err.message || 'Profil konnte nicht geladen werden'
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
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(currentUser.value)
    })
    
    if (!response.ok) {
      throw new Error('Update fehlgeschlagen')
    }
    
    const updatedData = await response.json()
    
    currentUser.value = {
      name: updatedData.name || '',
      email: updatedData.email || '',
      phone: updatedData.phone || '',
      address: updatedData.address || ''
    }
    originalUser.value = { ...currentUser.value }
    
    successMessage.value = 'Daten gespeichert!'
    
  } catch (err) {
    error.value = `Speichern fehlgeschlagen: ${err.message}`
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
  padding: 80px 20px 40px;
  color: #fff;
}

.account-header {
  text-align: center;
  margin-bottom: 2rem;
}

.account-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.account-content {
  max-width: 800px;
  margin: 0 auto;
}

.loading-state, .error-state {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #e26191;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state i {
  font-size: 2.5rem;
  color: #e26191;
  margin-bottom: 1rem;
}

.error-state h3 {
  margin-bottom: 0.5rem;
  color: #ff6b6b;
}

.error-state p {
  margin-bottom: 1.5rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #e26191;
  color: white;
  border: none;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.success-message {
  background: rgba(46, 213, 115, 0.15);
  border: 1px solid rgba(46, 213, 115, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-close-msg {
  margin-left: auto;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
}

.form-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
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
  font-size: 1.3rem;
}

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
  padding: 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  color: #333;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.btn-primary:disabled, .btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spin {
  animation: spin 1s linear infinite;
}

.quick-links {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
}

.quick-links h3 {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
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
  padding: 1rem;
  text-decoration: none;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.link-card i {
  font-size: 1.5rem;
  color: #e26191;
}

@media (max-width: 768px) {
  .account-page {
    padding: 60px 1rem 2rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .link-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>