<template>
  <div class="edit-product">
    <div class="page-header">
      <div class="header-content">
        <h1>
          <i class="bi bi-pencil-square"></i>
          Produkt bearbeiten
        </h1>
        <p class="subtitle">Bearbeiten Sie die Produktdetails</p>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Produkt wird geladen...</p>
    </div>

    <div v-else-if="error" class="error">
      <i class="bi bi-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <router-link to="/admin/products" class="btn-primary">
        Zurück zur Produktübersicht
      </router-link>
    </div>

    <form v-else-if="product" @submit.prevent="updateProduct" class="edit-form">
      <div class="form-grid">
        <!-- Produktname -->
        <div class="form-group">
          <label for="title">
            <i class="bi bi-card-heading"></i>
            Produktname *
          </label>
          <input
            id="title"
            v-model="product.name"
            placeholder="z.B. Premium Lederleine"
            required
            class="form-input"
          />
          <div class="form-hint">Geben Sie einen klaren Produktnamen ein</div>
        </div>

        <!-- Preis -->
        <div class="form-group">
          <label for="price">
            <i class="bi bi-tag"></i>
            Preis (€) *
          </label>
          <input
            id="price"
            v-model.number="product.price"
            type="number"
            step="0.01"
            min="0"
            placeholder="29.99"
            required
            class="form-input"
          />
          <div class="form-hint">Geben Sie den Preis in Euro ein</div>
        </div>

        <!-- Kategorie -->
        <div class="form-group">
          <label for="category">
            <i class="bi bi-grid"></i>
            Kategorie *
          </label>
          <select
            id="category"
            v-model="product.category"
            required
            class="form-input"
          >
            <option value="">Kategorie wählen</option>
            <option value="leinen">Leinen & Geschirre</option>
            <option value="halsbaender">Halsbänder</option>
            <option value="bekleidung">Bekleidung</option>
            <option value="snacks">Snacks</option>
          </select>
          <div class="form-hint">Wählen Sie die passende Kategorie</div>
        </div>

        <!-- Lagerbestand -->
        <div class="form-group">
          <label for="stock">
            <i class="bi bi-box"></i>
            Lagerbestand
          </label>
          <input
            id="stock"
            v-model.number="product.stock"
            type="number"
            min="0"
            placeholder="50"
            class="form-input"
          />
          <div class="form-hint">Anzahl verfügbarer Einheiten</div>
        </div>

        <!-- Beschreibung -->
        <div class="form-group full-width">
          <label for="description">
            <i class="bi bi-text-paragraph"></i>
            Beschreibung *
          </label>
          <textarea
            id="description"
            v-model="product.description"
            placeholder="Detaillierte Produktbeschreibung..."
            required
            rows="5"
            class="form-textarea"
          ></textarea>
          <div class="form-hint">Beschreiben Sie das Produkt ausführlich</div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <router-link to="/admin/products" class="btn-secondary">
          <i class="bi bi-arrow-left"></i>
          Abbrechen
        </router-link>
        <button 
          type="button" 
          @click="deleteProduct" 
          class="btn-delete"
          :disabled="isDeleting"
        >
          <i class="bi bi-x-circle"></i>
          {{ isDeleting ? 'Löschen...' : 'Produkt löschen' }}
        </button>
        <button 
          type="submit" 
          class="btn-primary"
          :disabled="isSubmitting"
        >
          <i class="bi bi-check-lg"></i>
          {{ isSubmitting ? 'Wird gespeichert...' : 'Änderungen speichern' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const route = useRoute()
const router = useRouter()
const { getAccessTokenSilently } = useAuth0()

const product = ref(null)
const loading = ref(true)
const error = ref('')
const isSubmitting = ref(false)
const isDeleting = ref(false)

// API URL aus .env oder localhost
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

onMounted(async () => {
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API_URL}/api/product/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!res.ok) throw new Error('Produkt nicht gefunden')
    product.value = await res.json()
  } catch (err) {
    console.error(err)
    error.value = 'Fehler beim Laden des Produkts'
  } finally {
    loading.value = false
  }
})

async function updateProduct() {
  if (!product.value) return
  
  isSubmitting.value = true
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API_URL}/api/product/${product.value.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product.value)
    })
    
    if (!res.ok) throw new Error('Update fehlgeschlagen')
    
    alert('Produkt erfolgreich aktualisiert!')
    router.push('/admin/products')
    
  } catch (err) {
    console.error(err)
    alert('Fehler beim Aktualisieren des Produkts')
  } finally {
    isSubmitting.value = false
  }
}

async function deleteProduct() {
  if (!product.value || !confirm(`Sind Sie sicher, dass Sie das Produkt "${product.value.name}" löschen möchten?`)) {
    return
  }
  
  isDeleting.value = true
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API_URL}/api/product/${product.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!res.ok) throw new Error('Löschen fehlgeschlagen')
    
    alert('Produkt erfolgreich gelöscht!')
    router.push('/admin/products')
    
  } catch (err) {
    console.error(err)
    alert('Fehler beim Löschen des Produkts')
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.edit-product {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
  background: #EFE1D6;
}

/* Header */
.page-header {
  background: linear-gradient(135deg, #E26191, #B48665);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2.5rem;
  color: white;
  box-shadow: 0 8px 32px rgba(226, 97, 145, 0.15);
}

.header-content h1 {
  font-size: 2.4rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 400;
}

/* Loading & Error */
.loading, .error {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 20px;
  margin: 2rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.loading .spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #EFE1D6;
  border-top: 4px solid #E26191;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

.error i {
  font-size: 3.5rem;
  color: #E26191;
  margin-bottom: 1.5rem;
}

.error p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Form */
.edit-form {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.form-group label i {
  color: #B48665;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #E0E0E0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9f9f9;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #E26191;
  background: white;
  box-shadow: 0 0 0 3px rgba(226, 97, 145, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-hint {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
  font-style: italic;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 2px solid #EFE1D6;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary, .btn-delete {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: #E26191;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #d15280;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(226, 97, 145, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #B48665;
  color: white;
}

.btn-secondary:hover {
  background: #9e7354;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(180, 134, 101, 0.3);
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
}

.btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .edit-product {
    padding: 1rem;
  }
  
  .page-header {
    padding: 1.75rem;
  }
  
  .header-content h1 {
    font-size: 2rem;
  }
  
  .edit-form {
    padding: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary, .btn-delete {
    width: 100%;
    justify-content: center;
  }
}
</style>