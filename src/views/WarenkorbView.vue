<template>
  <div class="warenkorb-container">
    <!-- Hintergrund-Elemente wie bei Account -->
    <div class="background-elements">
      <div class="bg-paw bg-paw-1"></div>
      <div class="bg-paw bg-paw-2"></div>
      <div class="bg-paw bg-paw-3"></div>
    </div>

    <div class="warenkorb-spacer"></div>
    
    <div class="warenkorb-wrapper">
      <!-- VERBESSERT: Einfache Überschrift ohne Icon -->
      <div class="simple-header">
        <h1 class="page-title">Mein Warenkorb</h1>
        <p class="page-subtitle">
          <span v-if="cartItems.length > 0">{{ itemCount }} Artikel im Warenkorb</span>
          <span v-else>Ihr Warenkorb ist bereit für neue Schätze</span>
        </p>
      </div>

      <!-- Hauptinhalt -->
      <div class="warenkorb-main">
        <!-- Warenkorb leer -->
        <div v-if="cartItems.length === 0" class="empty-cart">
          <div class="empty-cart-content">
            <i class="bi bi-cart-x empty-icon"></i>
            <h2>Ihr Warenkorb ist leer</h2>
            <p class="text-muted">Fügen Sie tolle Produkte für Ihren Hund hinzu!</p>
            <div class="empty-cart-actions">
              <router-link to="/leinen" class="btn-navbar-primary">
                <i class="bi bi-search me-2"></i>
                Produkte entdecken
              </router-link>
              <router-link to="/" class="btn-navbar-secondary">
                <i class="bi bi-house me-2"></i>
                Zur Startseite
              </router-link>
            </div>
          </div>
        </div>

        <!-- Warenkorb mit Inhalten -->
        <div v-else class="cart-with-items">
          <!-- Warenkorb Items -->
          <div class="cart-items-section">
            <div class="section-header">
              <h2><i class="bi bi-list-check me-2"></i> Ihre Auswahl</h2>
              <button class="btn-clear-cart" @click="clearCart">
                <i class="bi bi-trash me-1"></i>
                Warenkorb leeren
              </button>
            </div>

            <div class="cart-items-list">
              <div v-for="item in cartItems" :key="item.id" class="cart-item-card">
                <!-- Produktbild -->
                <div class="item-image" @click="viewProduct(item.id)">
                  <img :src="item.image" :alt="item.name" />
                  <div class="image-overlay">
                    <i class="bi bi-eye"></i>
                    Details ansehen
                  </div>
                </div>

                <!-- Produktinfo -->
                <div class="item-info">
                  <div class="item-header">
                    <h3 class="item-title" @click="viewProduct(item.id)">
                      {{ item.name }}
                    </h3>
                    <button class="btn-remove-item" @click="removeItem(item.id)">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                  
                  <p class="item-description">{{ item.description }}</p>
                  
                  <div class="item-category">
                    <span class="category-badge" :style="{ backgroundColor: getCategoryColor(item.category) }">
                      {{ item.category }}
                    </span>
                  </div>

                  <!-- Preis -->
                  <div class="item-price-display">
                    <span class="price-single">{{ formatPrice(item.price) }} / Stück</span>
                    <span class="price-total">{{ formatPrice(item.price * item.quantity) }}</span>
                  </div>

                  <!-- Menge -->
                  <div class="item-quantity-controls">
                    <div class="quantity-selector">
                      <button class="btn-quantity" @click="decreaseQuantity(item.id)" :disabled="item.quantity <= 1">
                        <span class="minus-sign">−</span>
                      </button>
                      <span class="quantity-display">{{ item.quantity }}</span>
                      <button class="btn-quantity" @click="increaseQuantity(item.id)">
                        <span class="plus-sign">+</span>
                      </button>
                    </div>
                    <button class="btn-remove" @click="removeItem(item.id)">
                      <i class="bi bi-trash me-1"></i>
                      Entfernen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bestellübersicht -->
          <div class="order-summary-section">
            <div class="summary-card">
              <div class="summary-header">
                <h2><i class="bi bi-receipt me-2"></i> Bestellübersicht</h2>
              </div>

              <div class="summary-details">
                <div class="summary-row">
                  <span>Zwischensumme ({{ itemCount }} Artikel)</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                
                <div class="summary-row">
                  <span>Versandkosten</span>
                  <span>{{ formatPrice(4.99) }}</span>
                </div>
                
                <div class="summary-row total">
                  <span><strong>Gesamtsumme</strong></span>
                  <span><strong>{{ formatPrice(total) }}</strong></span>
                </div>

                <div class="shipping-info">
                  <i class="bi bi-truck"></i>
                  <span>Lieferung in 2-3 Werktagen</span>
                </div>
              </div>

              <!-- Aktionsbuttons -->
              <div class="summary-actions">
                <button class="btn-checkout" @click="proceedToCheckout">
                  <i class="bi bi-lock-fill me-2"></i>
                  Zur Kasse gehen
                </button>
                
                <router-link to="/" class="btn-continue-shopping">
                  <i class="bi bi-arrow-left me-2"></i>
                  Weiter einkaufen
                </router-link>
              </div>

              <!-- Sicherheitshinweise -->
              <div class="security-info">
                <div class="security-item">
                  <i class="bi bi-shield-check"></i>
                  <span>Sicheres Bezahlen mit SSL-Verschlüsselung</span>
                </div>
                <div class="security-item">
                  <i class="bi bi-arrow-clockwise"></i>
                  <span>30 Tage Rückgaberecht</span>
                </div>
              </div>
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

// Verwende den Store
const cartItems = computed(() => cartStore.cartItems)
const itemCount = computed(() => cartStore.itemCount)
const subtotal = computed(() => cartStore.subtotal)
const total = computed(() => cartStore.total)

// Methoden
const increaseQuantity = (productId) => {
  cartStore.increaseQuantity(productId)
}

const decreaseQuantity = (productId) => {
  cartStore.decreaseQuantity(productId)
}

const removeItem = (productId) => {
  cartStore.removeFromCart(productId)
}

const clearCart = () => {
  if (confirm('Möchten Sie den Warenkorb wirklich leeren?')) {
    cartStore.clearCart()
  }
}

const viewProduct = (productId) => {
  router.push(`/product/${productId}`) // Korrigierte Route
}

const proceedToCheckout = () => {
  alert('Checkout-Funktion würde hier implementiert werden!')
}

const formatPrice = (price) => {
  return `${price.toFixed(2)} €`
}

const getCategoryColor = (category) => {
  const colors = {
    'Leinen': '#e26191',
    'Halsbänder': '#cbbf9b',
    'Bekleidung': '#8ec5fc',
    'Snacks': '#a8e6cf'
  }
  return colors[category] || '#6c757d'
}
</script>

<style scoped>
/* Grundlayout */
.warenkorb-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #8b7355 0%, #a8916d 30%, #cbbf9b 100%);
  padding-top: 140px; /* Weniger Padding */
  position: relative;
  overflow-x: hidden;
}

.warenkorb-spacer {
  height: 40px;
}

.background-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}

.bg-paw {
  position: absolute;
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.07);
  font-family: "Bootstrap Icons";
  opacity: 0.5;
}

.bg-paw-1 {
  top: 15%;
  left: 8%;
  content: "\f6b7";
  transform: rotate(20deg);
}

.bg-paw-2 {
  top: 50%;
  right: 12%;
  content: "\f6b7";
  transform: rotate(-30deg);
}

.bg-paw-3 {
  bottom: 20%;
  left: 15%;
  content: "\f6b7";
  transform: rotate(45deg);
}

.warenkorb-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* EINFACHE ÜBERSCHRIFT (wie bei ProductDetail) */
.simple-header {
  margin-bottom: 3rem;
  padding: 2rem 0;
  text-align: center;
}

.page-title {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: 2.8rem;
  color: white;
  margin-bottom: 0.75rem;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  max-width: 500px;
  margin: 0 auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  font-family: "Roboto", sans-serif;
}

/* Leerer Warenkorb */
.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-cart-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 25px;
  padding: 4rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.empty-icon {
  font-size: 8rem;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 2rem;
}

.empty-cart-content h2 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
}

.empty-cart-content .text-muted {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  margin-bottom: 3rem;
  font-family: "Roboto", sans-serif;
}

.empty-cart-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

/* Buttons im Navbar-Stil */
.btn-navbar-primary,
.btn-navbar-secondary {
  padding: 1rem 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  height: 48px;
  text-decoration: none !important;
  outline: none !important;
  font-family: "Roboto", sans-serif;
}

.btn-navbar-primary {
  background: rgba(203, 191, 155, 0.25);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.btn-navbar-primary:hover {
  color: #e26191;
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.btn-navbar-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.btn-navbar-secondary:hover {
  color: #e26191;
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Warenkorb mit Items */
.cart-with-items {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

/* Warenkorb Items Liste */
.cart-items-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 25px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.section-header h2 {
  color: white;
  font-size: 1.8rem;
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
}

.btn-clear-cart {
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(226, 97, 145, 0.2);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: "Roboto", sans-serif;
}

.btn-clear-cart:hover {
  background: rgba(226, 97, 145, 0.4);
  transform: translateY(-2px);
}

/* Cart Item Card */
.cart-item-card {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.cart-item-card:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-5px);
}

.item-image {
  position: relative;
  flex-shrink: 0;
  width: 150px;
  height: 150px;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.item-image:hover .image-overlay {
  opacity: 1;
}

.item-info {
  flex: 1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.item-title {
  color: white;
  font-size: 1.4rem;
  margin: 0;
  cursor: pointer;
  transition: color 0.3s;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
}

.item-title:hover {
  color: #e26191;
}

.btn-remove-item {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.btn-remove-item:hover {
  color: #e26191;
}

.item-description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  font-family: "Roboto", sans-serif;
}

.item-category {
  margin-bottom: 1rem;
}

.category-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: "Roboto", sans-serif;
}

.item-price-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.price-single {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-family: "Roboto", sans-serif;
}

.price-total {
  color: white;
  font-size: 1.4rem;
  font-weight: 700;
  font-family: "Roboto", sans-serif;
}

/* Menge Controls mit verbesserten +/- */
.item-quantity-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-quantity {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.5rem;
  font-weight: bold;
}

.btn-quantity:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.btn-quantity:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.minus-sign, .plus-sign {
  line-height: 1;
}

.minus-sign {
  font-size: 1.8rem;
  margin-bottom: 2px;
}

.plus-sign {
  font-size: 1.6rem;
}

.quantity-display {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
  font-family: "Roboto", sans-serif;
}

.btn-remove {
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(226, 97, 145, 0.1);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: "Roboto", sans-serif;
}

.btn-remove:hover {
  background: rgba(226, 97, 145, 0.3);
}

/* Order Summary */
.order-summary-section {
  position: sticky;
  top: 160px;
  height: fit-content;
}

.summary-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 25px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.summary-header h2 {
  color: white;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  font-family: "Roboto", sans-serif;
  font-weight: 400;
}

.summary-details {
  margin-bottom: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: "Roboto", sans-serif;
}

.summary-row span:first-child {
  color: rgba(255, 255, 255, 0.9);
}

.summary-row span:last-child {
  color: white;
  font-weight: 600;
}

.summary-row.total {
  border-bottom: none;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  font-size: 1.2rem;
}

.shipping-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-top: 1.5rem;
  font-family: "Roboto", sans-serif;
}

.shipping-info i {
  color: #e26191;
}

/* Checkout Button */
.summary-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-checkout {
  padding: 1.5rem;
  border: none;
  border-radius: 15px;
  background: linear-gradient(135deg, #e26191, #ff8fab);
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 25px rgba(226, 97, 145, 0.3);
  font-family: "Roboto", sans-serif;
}

.btn-checkout:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(226, 97, 145, 0.4);
}

.btn-continue-shopping {
  padding: 1rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  font-family: "Roboto", sans-serif;
}

.btn-continue-shopping:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Security Info */
.security-info {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.security-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  font-family: "Roboto", sans-serif;
}

.security-item i {
  color: #e26191;
}

/* Responsive */
@media (max-width: 1024px) {
  .cart-with-items {
    grid-template-columns: 1fr;
  }
  
  .order-summary-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item-card {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .item-image {
    width: 100%;
    height: 200px;
  }
  
  .page-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 576px) {
  .warenkorb-container {
    padding-top: 120px;
  }
  
  .empty-cart-actions {
    flex-direction: column;
  }
  
  .btn-navbar-primary,
  .btn-navbar-secondary {
    width: 100%;
  }
  
  .item-quantity-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .page-title {
    font-size: 2rem;
  }
}
</style>