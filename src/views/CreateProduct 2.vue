<template>
  <div class="create-product-page">
    <nav class="breadcrumb">
      <router-link to="/admin/products">Produktverwaltung</router-link>
      <span class="separator">/</span>
      <span>Neues Produkt</span>
    </nav>

    <div class="header">
      <h1><i class="bi bi-plus-circle"></i> Neues Produkt erstellen</h1>
      <p>Fügen Sie ein neues Produkt zum Shop hinzu</p>
    </div>

    <div class="form-container">
      <div v-if="successMessage" class="success-message">
        <i class="bi bi-check-circle"></i>
        <p>{{ successMessage }}</p>
        <button @click="successMessage = ''" class="btn-close-msg">
          <i class="bi bi-x"></i>
        </button>
      </div>

      <div v-if="errorMessage" class="error-message">
        <i class="bi bi-exclamation-triangle"></i>
        <p>{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="submitProduct" class="product-form">
        <!-- Grundinformationen -->
        <section class="form-section">
          <h2><i class="bi bi-info-circle"></i> Grundinformationen</h2>
          
          <div class="form-group">
            <label for="title">Produkttitel *</label>
            <input 
              id="title"
              v-model="product.title" 
              type="text" 
              placeholder="z.B. Premium Hundeleine"
              required
              :disabled="loading"
              maxlength="100"
            >
            <span class="char-count">{{ product.title.length }}/100</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="price">Preis (€) *</label>
              <div class="price-input">
                <input 
                  id="price"
                  v-model.number="product.price" 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  required
                  :disabled="loading"
                >
                <span class="currency">€</span>
              </div>
            </div>

            <div class="form-group">
              <label for="category">Kategorie *</label>
              <select 
                id="category"
                v-model="product.category" 
                required
                :disabled="loading"
              >
                <option value="" disabled>Kategorie wählen</option>
                <option value="leinen">Leinen</option>
                <option value="halsbaender">Halsbänder</option>
                <option value="bekleidung">Bekleidung</option>
                <option value="snacks">Snacks & Futter</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="sku">SKU (optional)</label>
            <input 
              id="sku"
              v-model="product.sku" 
              type="text" 
              placeholder="z.B. PROD-001"
              :disabled="loading"
              maxlength="50"
            >
          </div>
        </section>

        <!-- Beschreibung -->
        <section class="form-section">
          <h2><i class="bi bi-card-text"></i> Beschreibung</h2>
          <div class="form-group">
            <label for="description">Produktbeschreibung *</label>
            <textarea 
              id="description"
              v-model="product.description" 
              placeholder="Detaillierte Produktbeschreibung..."
              rows="4"
              required
              :disabled="loading"
              maxlength="1000"
            ></textarea>
            <span class="char-count">{{ product.description.length }}/1000</span>
          </div>
        </section>

        <!-- Produktbild -->
        <section class="form-section">
          <h2><i class="bi bi-image"></i> Produktbild</h2>
          <div class="form-group">
            <label for="imageUrl">Bild-URL *</label>
            <input 
              id="imageUrl"
              v-model="product.imageUrl" 
              type="text" 
              placeholder="z.B. /src/assets/product_pics/hundeleine.png"
              required
              :disabled="loading"
            >
          </div>

          <div class="image-preview" v-if="product.imageUrl">
            <div>Vorschau:</div>
            <img :src="product.imageUrl" :alt="`Vorschau für ${product.title}`">
          </div>
        </section>

        <!-- Lagerbestand -->
        <section class="form-section">
          <h2><i class="bi bi-box-seam"></i> Lagerbestand</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="stock">Verfügbarer Bestand *</label>
              <input 
                id="stock"
                v-model.number="product.stock" 
                type="number" 
                min="0"
                required
                :disabled="loading"
              >
            </div>

            <div class="form-group">
              <label for="status">Status</label>
              <select 
                id="status"
                v-model="product.status" 
                :disabled="loading"
              >
                <option value="active">Aktiv</option>
                <option value="inactive">Inaktiv</option>
                <option value="out_of_stock">Ausverkauft</option>
              </select>
            </div>
          </div>
        </section>

        <div class="form-actions">
          <button 
            type="button" 
            @click="resetForm" 
            class="btn-secondary"
            :disabled="loading"
          >
            <i class="bi bi-arrow-counterclockwise"></i> Zurücksetzen
          </button>
          <button 
            type="submit" 
            class="btn-primary"
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading">
              <i class="bi bi-arrow-clockwise spin"></i> Wird erstellt...
            </span>
            <span v-else>
              <i class="bi bi-check-lg"></i> Produkt erstellen
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const router = useRouter()
const { getAccessTokenSilently } = useAuth0()

const product = reactive({
  title: '',
  price: 0,
  description: '',
  category: '',
  sku: '',
  imageUrl: '',
  stock: 0,
  status: 'active'
})

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const isFormValid = computed(() => {
  return (
    product.title.trim().length >= 3 &&
    product.price > 0 &&
    product.description.trim().length >= 10 &&
    product.category &&
    product.imageUrl.trim() &&
    product.stock >= 0
  )
})

const resetForm = () => {
  Object.assign(product, {
    title: '',
    price: 0,
    description: '',
    category: '',
    sku: '',
    imageUrl: '',
    stock: 0,
    status: 'active'
  })
  successMessage.value = ''
  errorMessage.value = ''
}

const submitProduct = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Bitte alle Pflichtfelder korrekt ausfüllen'
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    const token = await getAccessTokenSilently()
    
    const productData = {
      title: product.title.trim(),
      price: parseFloat(product.price),
      description: product.description.trim(),
      category: product.category,
      sku: product.sku.trim() || null,
      imageUrl: product.imageUrl.trim(),
      stock: parseInt(product.stock),
      status: product.status,
      createdAt: new Date().toISOString()
    }
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })
    
    if (!response.ok) {
      throw new Error(`Fehler beim Erstellen (${response.status})`)
    }
    
    const createdProduct = await response.json()
    successMessage.value = `Produkt "${createdProduct.title}" erfolgreich erstellt!`
    resetForm()
    
    setTimeout(() => {
      router.push('/admin/products')
    }, 3000)
    
  } catch (error) {
    errorMessage.value = `Fehler: ${error.message}. Bitte versuchen Sie es erneut.`
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-product-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, #2d3748 100%);
  padding: 120px 20px 40px;
  color: var(--color-background-light);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  max-width: 1200px;
  margin: 0 auto 1.5rem;
}

.breadcrumb a {
  color: var(--color-accent-pink);
  text-decoration: none;
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
  max-width: 1200px;
  margin: 0 auto 2.5rem;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.form-container {
  max-width: 900px;
  margin: 0 auto;
}

.success-message, .error-message {
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.success-message {
  background: rgba(46, 213, 115, 0.15);
  border: 1px solid rgba(46, 213, 115, 0.3);
}

.error-message {
  background: rgba(255, 71, 87, 0.15);
  border: 1px solid rgba(255, 71, 87, 0.3);
  color: #ff6b6b;
}

.btn-close-msg {
  margin-left: auto;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
}

.product-form {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section h2 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

input, select, textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: var(--color-background-light);
  font-family: inherit;
  font-size: 1rem;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--color-accent-pink);
  background: rgba(255, 255, 255, 0.15);
}

.price-input {
  position: relative;
}

.price-input .currency {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
}

.char-count {
  display: block;
  text-align: right;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.25rem;
}

.image-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--color-accent-pink);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #d05583;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .create-product-page {
    padding: 100px 1rem 2rem;
  }
  
  .header h1 {
    font-size: 1.8rem;
  }
  
  .product-form {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>