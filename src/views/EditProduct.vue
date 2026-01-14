<template>
  <div class="edit-product">
    <div class="container">
      <div class="header">
        <router-link to="/admin/products" class="back-btn">
          <i class="bi bi-arrow-left"></i> Zurück
        </router-link>
        <h1><i class="bi bi-pencil-square"></i> Produkt bearbeiten</h1>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Produkt wird geladen...</p>
      </div>

      <div v-else-if="error" class="error">
        <i class="bi bi-exclamation-triangle"></i>
        <h3>Fehler</h3>
        <p>{{ error }}</p>
      </div>

      <form v-else @submit.prevent="updateProduct" class="form">
        <div v-if="successMessage" class="success">
          <i class="bi bi-check-circle"></i>
          <p>{{ successMessage }}</p>
        </div>

        <div v-if="submitError" class="error-message">
          <i class="bi bi-exclamation-triangle"></i>
          <p>{{ submitError }}</p>
        </div>

        <div class="form-section">
          <h2><i class="bi bi-info-circle"></i> Produktinformationen</h2>
          
          <div class="form-group">
            <label>Titel *</label>
            <input v-model="formData.title" required :disabled="isSubmitting" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Preis (€) *</label>
              <input v-model.number="formData.price" type="number" step="0.01" min="0" required :disabled="isSubmitting" />
            </div>

            <div class="form-group">
              <label>Kategorie *</label>
              <select v-model="formData.category" required :disabled="isSubmitting">
                <option value="" disabled>Wählen...</option>
                <option value="leinen">Leinen & Geschirre</option>
                <option value="halsband">Halsbänder</option>
                <option value="bekleidung">Bekleidung</option>
                <option value="snacks">Snacks</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Beschreibung *</label>
            <textarea v-model="formData.description" rows="3" required :disabled="isSubmitting"></textarea>
          </div>

          <div class="form-group">
            <label>Bild-URL</label>
            <input v-model="formData.image" :disabled="isSubmitting" />
            <div v-if="formData.image" class="image-preview">
              <img :src="formData.image" :alt="formData.title" />
            </div>
          </div>
        </div>

        <div class="actions">
          <button type="button" @click="confirmDelete" class="btn-delete" :disabled="isSubmitting">
            <i class="bi bi-trash"></i> Löschen
          </button>
          
          <button type="submit" class="btn-save" :disabled="isSubmitting || !hasChanges">
            <i v-if="isSubmitting" class="bi bi-arrow-clockwise spin"></i>
            <i v-else class="bi bi-check-lg"></i>
            {{ isSubmitting ? 'Speichern...' : 'Speichern' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const route = useRoute()
const router = useRouter()
const { getAccessTokenSilently } = useAuth0()

const product = ref(null)
const loading = ref(true)
const error = ref('')
const isSubmitting = ref(false)
const successMessage = ref('')
const submitError = ref('')

const formData = reactive({
  title: '',
  price: 0,
  description: '',
  category: '',
  image: ''
})

const originalData = reactive({})

const hasChanges = computed(() => {
  return JSON.stringify(formData) !== JSON.stringify(originalData)
})

onMounted(async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product/${route.params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!response.ok) throw new Error('Produkt nicht gefunden')
    
    product.value = await response.json()
    
    formData.title = product.value.title || ''
    formData.price = product.value.price || 0
    formData.description = product.value.description || ''
    formData.category = product.value.category || ''
    formData.image = product.value.image || ''
    
    Object.assign(originalData, { ...formData })
    
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const updateProduct = async () => {
  isSubmitting.value = true
  submitError.value = ''
  
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product/${product.value.id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.message || 'Update fehlgeschlagen')
    }
    
    successMessage.value = 'Produkt gespeichert!'
    Object.assign(originalData, { ...formData })
    
    setTimeout(() => router.push('/admin/products'), 1500)
    
  } catch (err) {
    submitError.value = err.message
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = async () => {
  if (!confirm('Produkt wirklich löschen?')) return
  
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product/${product.value.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (response.ok) {
      alert('Produkt gelöscht!')
      router.push('/admin/products')
    } else {
      throw new Error('Löschen fehlgeschlagen')
    }
  } catch (err) {
    alert('Löschen fehlgeschlagen: ' + err.message)
  }
}
</script>

<style scoped>
.edit-product {
  min-height: 100vh;
  background: #1a1a1a;
  padding: 80px 20px 40px;
  color: #fff;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #e26191;
  text-decoration: none;
  margin-bottom: 1rem;
}

.back-btn:hover {
  color: #ff8fab;
}

.header h1 {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 0;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255,255,255,0.2);
  border-top: 3px solid #e26191;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.error i {
  font-size: 2.5rem;
  color: #ff4757;
  margin-bottom: 1rem;
}

.error h3 {
  color: #ff6b6b;
  margin: 0 0 0.5rem 0;
}

.form {
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h2 {
  font-size: 1.3rem;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

input, select, textarea {
  width: 100%;
  padding: 0.875rem;
  background: rgba(255,255,255,0.08);
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #e26191;
  background: rgba(255,255,255,0.12);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.image-preview {
  margin-top: 1rem;
  text-align: center;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 2px solid rgba(255,255,255,0.1);
}

.success, .error-message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.success {
  background: rgba(46, 213, 115, 0.15);
  border: 1px solid rgba(46, 213, 115, 0.3);
  color: #2ed573;
}

.error-message {
  background: rgba(255, 71, 87, 0.15);
  border: 1px solid rgba(255, 71, 87, 0.3);
  color: #ff4757;
}

.actions {
  display: flex;
  justify-content: space-between;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.btn-delete, .btn-save {
  padding: 0.875rem 1.75rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-delete {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.btn-delete:hover:not(:disabled) {
  background: rgba(220, 53, 69, 0.3);
}

.btn-save {
  background: #e26191;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #d05583;
}

.btn-save:disabled, .btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>