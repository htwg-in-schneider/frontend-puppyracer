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
              <img :src="getImageUrl(formData.image)" :alt="formData.title" />
            </div>
            <div v-else class="image-placeholder">
              <i class="bi bi-image"></i>
              <p>Kein Bild ausgewählt</p>
            </div>
          </div>

          <div class="form-group">
            <label>Verfügbare Menge</label>
            <input v-model.number="formData.stock" type="number" min="0" :disabled="isSubmitting" />
          </div>

          <div class="form-group">
            <label>Aktiv</label>
            <div class="checkbox-group">
              <input type="checkbox" v-model="formData.active" id="active" :disabled="isSubmitting" />
              <label for="active">Produkt ist aktiv und sichtbar</label>
            </div>
          </div>
        </div>

        <div class="actions">
          <button type="button" @click="confirmDelete" class="btn-delete" :disabled="isSubmitting">
            <i class="bi bi-trash"></i> Löschen
          </button>
          
          <div class="save-buttons">
            <button type="button" @click="cancelEdit" class="btn-cancel" :disabled="isSubmitting">
              <i class="bi bi-x-lg"></i> Abbrechen
            </button>
            <button type="submit" class="btn-save" :disabled="isSubmitting || !hasChanges">
              <i v-if="isSubmitting" class="bi bi-arrow-clockwise spin"></i>
              <i v-else class="bi bi-check-lg"></i>
              {{ isSubmitting ? 'Speichern...' : 'Speichern' }}
            </button>
          </div>
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

// Formular-Daten mit allen Feldern
const formData = reactive({
  title: '',
  price: 0,
  description: '',
  category: '',
  image: '',
  stock: 0,
  active: true
})

const originalData = reactive({})

const hasChanges = computed(() => {
  return JSON.stringify(formData) !== JSON.stringify(originalData)
})

const getImageUrl = (imageName) => {
  if (!imageName) return ''
  if (imageName.startsWith('http')) return imageName
  return `/frontend-puppyracer/product_pics/${imageName}`
}

// Produkt laden
const loadProduct = async () => {
  try {
    const token = await getAccessTokenSilently()
    const productId = route.params.id
    
    console.log(`Lade Produkt ${productId}...`)
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Produkt nicht gefunden')
      } else if (response.status === 403) {
        throw new Error('Keine Berechtigung')
      } else {
        throw new Error(`Fehler ${response.status}`)
      }
    }
    
    const data = await response.json()
    console.log('Produkt geladen:', data)
    
    product.value = data
    
    // Formular mit Daten füllen
    formData.title = product.value.title || product.value.name || ''
    formData.price = parseFloat(product.value.price) || 0
    formData.description = product.value.description || ''
    formData.category = product.value.category || ''
    formData.image = product.value.image || product.value.imageUrl || ''
    formData.stock = parseInt(product.value.stock) || 0
    formData.active = product.value.active !== false
    
    // Originaldaten für Änderungsprüfung speichern
    Object.assign(originalData, { ...formData })
    
  } catch (err) {
    console.error('Fehler beim Laden:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProduct()
})

// Produkt speichern
const updateProduct = async () => {
  if (!hasChanges.value) {
    submitError.value = 'Keine Änderungen vorgenommen'
    return
  }
  
  isSubmitting.value = true
  submitError.value = ''
  successMessage.value = ''
  
  try {
    const token = await getAccessTokenSilently()
    
    // Vorbereiten der Daten fürs Backend
    const updateData = {
      name: formData.title.trim(),
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      description: formData.description.trim(),
      category: formData.category,
      image: formData.image.trim(),
      imageUrl: formData.image.trim(),
      stock: parseInt(formData.stock) || 0,
      active: formData.active
    }
    
    console.log('Sende Update:', updateData)
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${product.value.id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })
    
    console.log('Update Response Status:', response.status)
    
    if (!response.ok) {
      let errorMsg = `Update fehlgeschlagen (${response.status})`
      try {
        const errorData = await response.json()
        errorMsg = errorData.message || errorMsg
      } catch {
        const text = await response.text()
        if (text) errorMsg = text
      }
      throw new Error(errorMsg)
    }
    
    const updatedProduct = await response.json()
    console.log('Produkt aktualisiert:', updatedProduct)
    
    // Lokale Daten aktualisieren
    product.value = updatedProduct
    Object.assign(originalData, { ...formData })
    
    successMessage.value = 'Produkt erfolgreich gespeichert!'
    
    // Nach 2 Sekunden zurück zur Übersicht
    setTimeout(() => {
      router.push('/admin/products')
    }, 2000)
    
  } catch (err) {
    console.error('Update error:', err)
    submitError.value = `Fehler beim Speichern: ${err.message}`
  } finally {
    isSubmitting.value = false
  }
}

// Löschen bestätigen
const confirmDelete = async () => {
  if (!confirm(`Produkt "${formData.title}" wirklich löschen?`)) return
  
  try {
    const token = await getAccessTokenSilently()
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${product.value.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (response.ok) {
      alert('Produkt wurde gelöscht!')
      router.push('/admin/products')
    } else {
      throw new Error('Löschen fehlgeschlagen')
    }
  } catch (err) {
    alert(`Löschen fehlgeschlagen: ${err.message}`)
  }
}

// Bearbeitung abbrechen
const cancelEdit = () => {
  if (hasChanges.value) {
    if (!confirm('Änderungen verwerfen?')) return
  }
  router.push('/admin/products')
}
</script>

<style scoped>
.edit-product {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
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
  font-weight: 500;
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

@keyframes spin { 
  to { transform: rotate(360deg); } 
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
  color: rgba(255,255,255,0.9);
}

input, select, textarea {
  width: 100%;
  padding: 0.875rem;
  background: rgba(255,255,255,0.08);
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #e26191;
  background: rgba(255,255,255,0.12);
  box-shadow: 0 0 0 3px rgba(226, 97, 145, 0.2);
}

input:disabled, select:disabled, textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.image-preview, .image-placeholder {
  margin-top: 1rem;
  text-align: center;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 2px solid rgba(255,255,255,0.1);
  object-fit: cover;
}

.image-placeholder {
  background: rgba(255,255,255,0.05);
  border: 2px dashed rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 2rem;
}

.image-placeholder i {
  font-size: 3rem;
  color: rgba(255,255,255,0.3);
  margin-bottom: 0.5rem;
}

.image-placeholder p {
  color: rgba(255,255,255,0.5);
  margin: 0;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.success, .error-message {
  padding: 1rem 1.25rem;
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
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.save-buttons {
  display: flex;
  gap: 1rem;
}

.btn-delete, .btn-cancel, .btn-save {
  padding: 0.875rem 1.75rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-delete {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.btn-delete:hover:not(:disabled) {
  background: rgba(220, 53, 69, 0.3);
  transform: translateY(-2px);
}

.btn-cancel {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
}

.btn-cancel:hover:not(:disabled) {
  background: rgba(255,255,255,0.15);
  transform: translateY(-2px);
}

.btn-save {
  background: #e26191;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #d05583;
  transform: translateY(-2px);
}

.btn-save:disabled, .btn-delete:disabled, .btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.spin {
  animation: spin 1s linear infinite;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .save-buttons {
    flex-direction: column;
  }
  
  .btn-delete, .btn-cancel, .btn-save {
    width: 100%;
    justify-content: center;
  }
}
</style>