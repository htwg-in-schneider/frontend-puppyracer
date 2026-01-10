<template>
  <div class="detail-page">
    <div class="container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state" aria-live="polite" aria-busy="true">
        <div class="spinner"></div>
        <span>Produkt wird geladen...</span>
      </div>
      
      <!-- Product Found -->
      <div v-else-if="product" class="product-detail">
        <!-- Breadcrumb Navigation -->
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <button @click="goToCatalog" class="breadcrumb-link">
            Produkte
          </button>
          <span class="separator">/</span>
          <span v-if="product.category" class="breadcrumb-link" @click="goToCategory">
            {{ getCategoryName(product.category) }}
          </span>
          <span class="separator" v-if="product.category">/</span>
          <span class="current">{{ product.title }}</span>
        </nav>
        
        <!-- Product Content -->
        <div class="product-content">
          <!-- Image Section -->
          <div class="image-section">
            <img 
              :src="imageUrl" 
              :alt="`Produktbild: ${product.title}`" 
              class="main-img"
              @error="handleImageError"
            />
          </div>
          
          <!-- Info Section -->
          <div class="info-section">
            <h1 id="product-title">{{ product.title }}</h1>
            
            <!-- Price -->
            <div class="price" aria-label="Preis">
              {{ formattedPrice }}
            </div>
            
            <!-- Description -->
            <div class="description-section">
              <h2 class="section-title">Beschreibung</h2>
              <p class="description">{{ product.description }}</p>
            </div>
            
            <!-- Category -->
            <div v-if="product.category" class="category-tag">
              <i class="bi bi-tag"></i>
              <span>{{ getCategoryName(product.category) }}</span>
            </div>
            
            <!-- Quantity Selection -->
            <div class="quantity-section">
              <h3 class="section-title">Menge wählen</h3>
              <div class="quantity-controls">
                <button 
                  class="qty-btn minus" 
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                  aria-label="Menge reduzieren"
                >
                  −
                </button>
                <span class="quantity-value" aria-live="polite">{{ quantity }}</span>
                <button 
                  class="qty-btn plus" 
                  @click="increaseQuantity"
                  aria-label="Menge erhöhen"
                >
                  +
                </button>
              </div>
              <div class="total-price">
                Gesamt: <strong>{{ totalPrice }}</strong>
              </div>
            </div>
            
            <!-- Add to Cart Button -->
            <button 
              class="add-cart-btn" 
              @click="addToCart"
              :disabled="addingToCart"
              aria-label="In den Warenkorb legen"
            >
              <span v-if="addingToCart">
                <i class="bi bi-arrow-repeat spin"></i> Wird hinzugefügt...
              </span>
              <span v-else>
                <i class="bi bi-cart-plus"></i> In den Warenkorb ({{ quantity }})
              </span>
            </button>
            
            <!-- Success Message -->
            <div v-if="addToCartSuccess" class="success-message" role="alert" aria-live="polite">
              <i class="bi bi-check-circle"></i>
              <span>Produkt wurde zum Warenkorb hinzugefügt!</span>
            </div>
          </div>
        </div>
        
        <!-- Reviews Section -->
        <ProductReviews :product-id="product.id" />
      </div>
      
      <!-- Product Not Found -->
      <div v-else class="not-found" aria-live="polite">
        <div class="error-icon">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h2>Produkt nicht gefunden</h2>
        <p>Das angefragte Produkt existiert nicht oder konnte nicht geladen werden.</p>
        <div class="action-buttons">
          <button @click="loadProduct" class="retry-btn">
            <i class="bi bi-arrow-clockwise"></i> Erneut versuchen
          </button>
          <button @click="goToCatalog" class="catalog-btn">
            <i class="bi bi-shop"></i> Zum Produktkatalog
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/Warenkorb.js'
import ProductReviews from '@/components/ProductReviews.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(true)
const quantity = ref(1)
const addingToCart = ref(false)
const addToCartSuccess = ref(false)
const imageError = ref(false)

// Category mapping
const categoryNames = {
  'leinen': 'Leinen',
  'halsbaender': 'Halsbänder',
  'bekleidung': 'Bekleidung',
  'snacks': 'Snacks & Futter'
}

// Computed Properties
const imageUrl = computed(() => {
  if (imageError.value) return '/src/assets/product_pics/default.jpg'
  
  if (!product.value) return '/src/assets/product_pics/default.jpg'
  
  const imageMap = {
    1: '/src/assets/product_pics/Hundeleine-dunklesLeder.png',
    2: '/src/assets/product_pics/Hundeleine-rot.png',
    3: '/src/assets/product_pics/Hundeleine-Stoff.png',
    4: '/src/assets/product_pics/Hundehalsband-Türkis.png',
    5: '/src/assets/product_pics/Hundehalsband-Leder.png',
    6: '/src/assets/product_pics/Hundehalsband-premium.png',
    7: '/src/assets/product_pics/Hundejacke-Blau.png',
    8: '/src/assets/product_pics/HundePulli.png',
    9: '/src/assets/product_pics/Hundejacke-Schwarz.png',
    10: '/src/assets/product_pics/Pedigree-Futter.png',
    11: '/src/assets/product_pics/Activa-Gold-Futter.png',
    12: '/src/assets/product_pics/Nutrima-Futter.png'
  }
  
  return imageMap[product.value.id] || '/src/assets/product_pics/default.jpg'
})

const formattedPrice = computed(() => {
  if (!product.value?.price) return '0,00 €'
  return `${product.value.price.toFixed(2)} €`
})

const totalPrice = computed(() => {
  if (!product.value?.price) return '0,00 €'
  return (product.value.price * quantity.value).toFixed(2) + ' €'
})

// Methods
const loadProduct = async () => {
  loading.value = true
  product.value = null
  imageError.value = false
  
  try {
    const response = await fetch(`http://localhost:8081/api/product/${route.params.id}`)
    
    if (response.ok) {
      product.value = await response.json()
      console.log('Produkt geladen:', product.value)
    } else {
      console.error('API Fehler:', response.status)
    }
  } catch (error) {
    console.error('Netzwerkfehler:', error)
  } finally {
    loading.value = false
  }
}

const getCategoryName = (category) => {
  return categoryNames[category.toLowerCase()] || category
}

const goToCatalog = () => {
  router.push('/produkte')
}

const goToCategory = () => {
  if (product.value?.category) {
    router.push(`/produkte/${product.value.category.toLowerCase()}`)
  }
}

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleImageError = () => {
  imageError.value = true
  console.warn('Produktbild konnte nicht geladen werden')
}

const addToCart = async () => {
  if (!product.value || addingToCart.value) return
  
  addingToCart.value = true
  
  try {
    cartStore.addToCart({
      id: product.value.id,
      name: product.value.title,
      price: product.value.price,
      image: imageUrl.value,
      description: product.value.description,
      category: product.value.category,
      quantity: quantity.value
    })
    
    // Erfolgsmeldung anzeigen
    addToCartSuccess.value = true
    
    // Nach 3 Sekunden ausblenden
    setTimeout(() => {
      addToCartSuccess.value = false
    }, 3000)
    
    console.log('Produkt zum Warenkorb hinzugefügt')
    
  } catch (error) {
    console.error('Fehler beim Hinzufügen zum Warenkorb:', error)
  } finally {
    addingToCart.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.detail-page {
  padding-top: 120px;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, #2d3748 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--color-background-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--color-accent-pink);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  color: var(--color-background-light);
  font-size: 0.9rem;
}

.breadcrumb-link {
  color: var(--color-accent-pink);
  text-decoration: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.breadcrumb-link:hover {
  background: rgba(226, 97, 145, 0.1);
}

.separator {
  opacity: 0.5;
}

.current {
  font-weight: 600;
  opacity: 0.8;
}

/* Product Content */
.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
}

/* Image Section */
.image-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  min-height: 500px;
}

.main-img {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.main-img:hover {
  transform: scale(1.02);
}

/* Info Section */
.info-section {
  color: var(--color-background-light);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.price {
  color: var(--color-accent-pink);
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

/* Description */
.description-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
}

.description {
  line-height: 1.7;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
}

/* Category Tag */
.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(226, 97, 145, 0.15);
  color: var(--color-accent-pink);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  font-weight: 500;
}

/* Quantity Section */
.quantity-section {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 1rem 0;
}

.qty-btn {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.qty-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity-value {
  font-size: 2rem;
  font-weight: 700;
  min-width: 60px;
  text-align: center;
  color: white;
}

.total-price {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 1rem;
}

.total-price strong {
  color: var(--color-accent-pink);
  font-size: 1.3rem;
}

/* Add to Cart Button */
.add-cart-btn {
  width: 100%;
  padding: 1.3rem;
  background: var(--color-accent-pink);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.add-cart-btn:hover:not(:disabled) {
  background: #d05583;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(226, 97, 145, 0.4);
}

.add-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.add-cart-btn:active:not(:disabled) {
  transform: translateY(0);
}

.spin {
  animation: spin 1s linear infinite;
}

/* Success Message */
.success-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(46, 213, 115, 0.15);
  color: #2ed573;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px solid rgba(46, 213, 115, 0.3);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.success-message i {
  font-size: 1.2rem;
}

/* Not Found */
.not-found {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 71, 87, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(255, 71, 87, 0.2);
  color: var(--color-background-light);
}

.error-icon {
  font-size: 3rem;
  color: #ff4757;
  margin-bottom: 1.5rem;
}

.not-found h2 {
  color: #ff6b6b;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.not-found p {
  margin-bottom: 2rem;
  opacity: 0.8;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.retry-btn, .catalog-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn {
  background: var(--color-accent-pink);
  color: white;
  border: none;
}

.retry-btn:hover {
  background: #d05583;
  transform: translateY(-2px);
}

.catalog-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.catalog-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 992px) {
  .product-content {
    gap: 2rem;
  }
  
  .image-section {
    min-height: 400px;
  }
  
  .main-img {
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .image-section {
    min-height: 350px;
    padding: 1.5rem;
  }
  
  .main-img {
    max-height: 350px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .price {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 1rem;
  }
  
  .product-content {
    padding: 1.5rem;
  }
  
  .image-section {
    min-height: 300px;
  }
  
  .quantity-controls {
    gap: 1rem;
  }
  
  .qty-btn {
    width: 45px;
    height: 45px;
    font-size: 1.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .retry-btn, .catalog-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style>