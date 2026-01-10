<template>
  <div class="create-product-page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <router-link to="/admin/products" class="breadcrumb-link">Produktverwaltung</router-link>
      <span class="separator">/</span>
      <span class="current">Neues Produkt</span>
    </nav>

    <!-- Header -->
    <div class="header">
      <h1><i class="bi bi-plus-circle" aria-hidden="true"></i> Neues Produkt erstellen</h1>
      <p class="subtitle">Fügen Sie ein neues Produkt zum Shop hinzu</p>
    </div>

    <!-- Form -->
    <div class="form-container">
      <!-- Success Message -->
      <div v-if="successMessage" class="success-message" role="alert" aria-live="polite">
        <i class="bi bi-check-circle" aria-hidden="true"></i>
        <p>{{ successMessage }}</p>
        <button @click="successMessage = ''" class="btn-close-msg" aria-label="Meldung schließen">
          <i class="bi bi-x" aria-hidden="true"></i>
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message" role="alert" aria-live="assertive">
        <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
        <p>{{ errorMessage }}</p>
      </div>

      <!-- Product Form -->
      <form @submit.prevent="submitProduct" class="product-form" aria-label="Produktformular">
        <!-- Basic Information -->
        <section class="form-section" aria-labelledby="basic-title">
          <h2 id="basic-title"><i class="bi bi-info-circle" aria-hidden="true"></i> Grundinformationen</h2>
          
          <div class="form-group">
            <div class="input-wrapper">
              <label for="title">Produkttitel *</label>
              <input 
                id="title"
                v-model="product.title" 
                type="text" 
                placeholder="z.B. Premium Hundeleine"
                required
                aria-required="true"
                :disabled="loading"
                maxlength="100"
              >
              <span class="char-count">{{ product.title.length }}/100</span>
            </div>
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
                  max="9999.99"
                  placeholder="29.99"
                  required
                  aria-required="true"
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
                aria-required="true"
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

        <!-- Description -->
        <section class="form-section" aria-labelledby="desc-title">
          <h2 id="desc-title"><i class="bi bi-card-text" aria-hidden="true"></i> Beschreibung</h2>
          
          <div class="form-group">
            <label for="description">Produktbeschreibung *</label>
            <textarea 
              id="description"
              v-model="product.description" 
              placeholder="Detaillierte Produktbeschreibung..."
              rows="6"
              required
              aria-required="true"
              :disabled="loading"
              maxlength="1000"
            ></textarea>
            <span class="char-count">{{ product.description.length }}/1000</span>
          </div>
        </section>

        <!-- Image -->
        <section class="form-section" aria-labelledby="image-title">
          <h2 id="image-title"><i class="bi bi-image" aria-hidden="true"></i> Produktbild</h2>
          
          <div class="form-group">
            <label for="imageUrl">Bild-URL *</label>
            <input 
              id="imageUrl"
              v-model="product.imageUrl" 
              type="text" 
              placeholder="z.B. /src/assets/product_pics/hundeleine.png"
              required
              aria-required="true"
              :disabled="loading"
            >
            <small class="hint">Verwenden Sie den Pfad zu Ihrer Bilddatei im assets-Ordner</small>
          </div>

          <div class="image-preview" v-if="product.imageUrl">
            <div class="preview-label">Vorschau:</div>
            <img :src="product.imageUrl" :alt="`Vorschau für ${product.title}`" class="preview-img">
          </div>
        </section>

        <!-- Inventory -->
        <section class="form-section" aria-labelledby="inventory-title">
          <h2 id="inventory-title"><i class="bi bi-box-seam" aria-hidden="true"></i> Lagerbestand</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label for="stock">Verfügbarer Bestand *</label>
              <input 
                id="stock"
                v-model.number="product.stock" 
                type="number" 
                min="0"
                max="9999"
                placeholder="100"
                required
                aria-required="true"
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

        <!-- Form Actions -->
        <div class="form-actions">
          <button 
            type="button" 
            @click="resetForm" 
            class="btn-secondary"
            :disabled="loading"
            aria-label="Formular zurücksetzen"
          >
            <i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i> Zurücksetzen
          </button>
          <button 
            type="submit" 
            class="btn-primary"
            :disabled="loading || !isFormValid"
            aria-label="Produkt erstellen"
          >
            <span v-if="loading">
              <i class="bi bi-arrow-clockwise spin" aria-hidden="true"></i> Wird erstellt...
            </span>
            <span v-else>
              <i class="bi bi-check-lg" aria-hidden="true"></i> Produkt erstellen
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

// Computed Properties
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

// Methods
const validateForm = () => {
  const errors = []
  
  if (product.title.trim().length < 3) {
    errors.push('Titel muss mindestens 3 Zeichen lang sein')
  }
  
  if (product.price <= 0) {
    errors.push('Preis muss größer als 0 sein')
  }
  
  if (product.description.trim().length < 10) {
    errors.push('Beschreibung muss mindestens 10 Zeichen lang sein')
  }
  
  if (!product.category) {
    errors.push('Bitte wählen Sie eine Kategorie')
  }
  
  if (!product.imageUrl.trim()) {
    errors.push('Bild-URL ist erforderlich')
  }
  
  if (product.stock < 0) {
    errors.push('Bestand darf nicht negativ sein')
  }
  
  return errors
}

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
  const validationErrors = validateForm()
  if (validationErrors.length > 0) {
    errorMessage.value = validationErrors.join(', ')
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
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
    
    const response = await fetch('http://localhost:8081/api/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(productData)
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Fehler beim Erstellen (${response.status})`)
    }
    
    const createdProduct = await response.json()
    
    successMessage.value = `Produkt "${createdProduct.title}" erfolgreich erstellt!`
    
    // Formular zurücksetzen
    resetForm()
    
    // Nach 3 Sekunden weiterleiten
    setTimeout(() => {
      router.push('/admin/products')
    }, 3000)
    
  } catch (error) {
    console.error('Error creating product:', error)
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

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.breadcrumb-link {
  color: var(--color-accent-pink);
  text-decoration: none;
  transition: opacity 0.2s;
}

.breadcrumb-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.separator {
  opacity: 0.5;
}

.current {
  font-weight: 600;
  opacity: 0.8;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 2.5rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.header h1 {
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

/* Form Container */
.form-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Messages */
.success-message, .error-message {
  padding: 1rem 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: fadeIn 0.3s ease;
}

.success-message {
  background: rgba(46, 213, 115, 0.15);
  border: 1px solid rgba(46, 213, 115, 0.3);
  color: var(--color-background-light);
}

.error-message {
  background: rgba(255, 71, 87, 0.15);
  border: 1px solid rgba(255, 71, 87, 0.3);
  color: #ff6b6b;
}

.success-message i, .error-message i {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.success-message i {
  color: #2ed573;
}

.error-message i {
  color: #ff4757;
}

.btn-close-msg {
  margin-left: auto;
  background: none;
  border: none;
  color: inherit;
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

/* Product Form */
.product-form {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Form Sections */
.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section h2 {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
}

/* Form Groups */
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
  color: rgba(255, 255, 255, 0.9);
}

input, select, textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: var(--color-background-light);
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--color-accent-pink);
  box-shadow: 0 0 0 3px rgba(226, 97, 145, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

input:disabled, select:disabled, textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

textarea {
  resize: vertical;
  min-height: 120px;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

/* Price Input */
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

/* Character Count */
.char-count {
  display: block;
  text-align: right;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.25rem;
}

/* Hint Text */
.hint {
  display: block;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.25rem;
}

/* Image Preview */
.image-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.preview-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.preview-img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .create-product-page {
    padding: 100px 1rem 2rem;
  }
  
  .header h1 {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
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

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.8rem;
  }
  
  .form-section h2 {
    font-size: 1.2rem;
  }
}
</style>