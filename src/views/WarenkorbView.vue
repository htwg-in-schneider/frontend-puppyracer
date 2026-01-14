<template>
  <div class="cart">
    <div class="header">
      <h1><i class="bi bi-cart"></i> Mein Warenkorb</h1>
      <p class="subtitle">{{ itemCount }} Artikel • {{ subtotal.toFixed(2) }}€</p>
    </div>

    <div class="cart-content">
      <div v-if="cartItems.length === 0" class="empty">
        <i class="bi bi-cart-x"></i>
        <h2>Warenkorb ist leer</h2>
        <p>Fügen Sie Produkte für Ihren Hund hinzu!</p>
        <div class="empty-actions">
          <router-link to="/produkte" class="btn-primary">
            <i class="bi bi-search"></i> Produkte ansehen
          </router-link>
        </div>
      </div>

      <div v-else class="cart-grid">
        <div class="products-section">
          <div class="section-header">
            <h2><i class="bi bi-list"></i> Artikel</h2>
            <button @click="clearCart" class="btn-clear">
              <i class="bi bi-trash"></i> Alles entfernen
            </button>
          </div>

          <div class="products">
            <div v-for="item in cartItems" :key="item.id" class="product">
              <img :src="getImageUrl(item.image)" :alt="item.name" class="product-img">
              
              <div class="product-details">
                <h3 @click="viewProduct(item.id)">{{ item.name }}</h3>
                <p class="category">{{ item.category }}</p>
                
                <div class="product-controls">
                  <div class="quantity">
                    <button @click="decreaseQuantity(item.id)" :disabled="item.quantity <= 1">
                      <i class="bi bi-dash"></i>
                    </button>
                    <span>{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item.id)">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  
                  <div class="price">
                    <span class="single">{{ formatPrice(item.price) }}</span>
                    <span class="total">{{ formatPrice(item.price * item.quantity) }}</span>
                  </div>
                  
                  <button @click="removeItem(item.id)" class="btn-remove" title="Entfernen">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="summary-section">
          <div class="summary">
            <h2><i class="bi bi-receipt"></i> Zusammenfassung</h2>
            
            <div class="summary-row">
              <span>Zwischensumme</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span>Versand</span>
              <span>4.99€</span>
            </div>
            <div class="summary-row total">
              <span>Gesamt</span>
              <span>{{ formatPrice(total) }}</span>
            </div>

            <button @click="proceedToCheckout" class="btn-checkout">
              <i class="bi bi-lock"></i>
              Zur Kasse ({{ formatPrice(total) }})
            </button>

            <router-link to="/" class="btn-continue">
              <i class="bi bi-arrow-left"></i>
              Weiter einkaufen
            </router-link>

            <div class="info">
              <p><i class="bi bi-truck"></i> Lieferung in 2-3 Tagen</p>
              <p><i class="bi bi-shield-check"></i> Sichere Bezahlung</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/Warenkorb.js'

const router = useRouter()
const cartStore = useCartStore()

// Computed
const cartItems = computed(() => cartStore.cartItems)
const itemCount = computed(() => cartStore.itemCount)
const subtotal = computed(() => cartStore.subtotal)
const total = computed(() => cartStore.total)

// Helper
const formatPrice = (price) => `${price.toFixed(2)}€`

// Methoden
const increaseQuantity = (productId) => cartStore.increaseQuantity(productId)
const decreaseQuantity = (productId) => cartStore.decreaseQuantity(productId)
const removeItem = (productId) => cartStore.removeFromCart(productId)

const clearCart = () => {
  if (confirm('Warenkorb wirklich leeren?')) {
    cartStore.clearCart()
  }
}

const viewProduct = (productId) => {
  router.push(`/product/${productId}`)
}

const proceedToCheckout = () => {
  router.push('/checkout')
}
const getImageUrl = (imageName) => {
  if (!imageName) return ''
  
  if (import.meta.env.DEV) {
    return `/src/assets/product_pics/${imageName}`
  }
  
  return `/frontend-puppyracer/product_pics/${imageName}`
}
</script>

<style scoped>
/* Grundlayout */
.cart {
  min-height: 100vh;
  background: linear-gradient(135deg, #8b7355 0%, #a8916d 100%);
  padding: 100px 20px 40px;
  color: white;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  opacity: 0.9;
  font-size: 1.1rem;
}

/* Content */
.cart-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* Leerer Warenkorb */
.empty {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.empty i {
  font-size: 5rem;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 1.5rem;
}

.empty h2 {
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.empty p {
  opacity: 0.8;
  margin-bottom: 2rem;
}

.empty-actions {
  display: flex;
  justify-content: center;
}

.btn-primary {
  padding: 1rem 2rem;
  background: rgba(226, 97, 145, 0.3);
  border: 1px solid rgba(226, 97, 145, 0.5);
  border-radius: 10px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: rgba(226, 97, 145, 0.5);
  transform: translateY(-2px);
}

/* Grid */
.cart-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

/* Produkte */
.products-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.section-header h2 {
  font-size: 1.4rem;
  margin: 0;
}

.btn-clear {
  padding: 0.5rem 1rem;
  background: rgba(226, 97, 145, 0.2);
  border: 1px solid rgba(226, 97, 145, 0.3);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-clear:hover {
  background: rgba(226, 97, 145, 0.4);
}

/* Produkt */
.products {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.product:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.product-img {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  cursor: pointer;
  transition: color 0.3s;
}

.product-details h3:hover {
  color: #e26191;
}

.category {
  margin: 0 0 1rem 0;
  opacity: 0.8;
  font-size: 0.9rem;
}

.product-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.quantity button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity span {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
}

.price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.price .single {
  font-size: 0.9rem;
  opacity: 0.8;
}

.price .total {
  font-weight: 600;
  font-size: 1.1rem;
}

.btn-remove {
  background: rgba(226, 97, 145, 0.1);
  border: 1px solid rgba(226, 97, 145, 0.2);
  border-radius: 6px;
  color: white;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-remove:hover {
  background: rgba(226, 97, 145, 0.3);
}

/* Zusammenfassung */
.summary-section {
  position: sticky;
  top: 120px;
  height: fit-content;
}

.summary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.summary h2 {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-row.total {
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  border-bottom: none;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 0.5rem;
}

.btn-checkout {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #e26191, #ff8fab);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  margin: 1.5rem 0 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-checkout:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(226, 97, 145, 0.4);
}

.btn-continue {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s;
  margin-bottom: 1.5rem;
}

.btn-continue:hover {
  background: rgba(255, 255, 255, 0.2);
}

.info {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
}

.info p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.info i {
  color: #e26191;
}

/* Responsive */
@media (max-width: 768px) {
  .cart-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-section {
    position: static;
  }
  
  .product {
    flex-direction: column;
  }
  
  .product-img {
    width: 100%;
    height: 150px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .cart {
    padding: 80px 15px 30px;
  }
  
  .product-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .price {
    flex-direction: row;
    gap: 1rem;
  }
}
</style>