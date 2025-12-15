<template>
  <div class="detail-page">
    <div class="container">
      <div v-if="loading" class="loading">Lädt...</div>
      
      <div v-else-if="product" class="product-detail">
        <!-- Bild -->
        <div class="image-section">
          <img :src="product.image" :alt="product.name" class="main-img" />
        </div>
        
        <!-- Info -->
        <div class="info-section">
          <router-link to="/" class="back-link">← Zurück</router-link>
          
          <h1>{{ product.name }}</h1>
          <div class="price">{{ product.price.toFixed(2) }} €</div>
          <p class="description">{{ product.description }}</p>
          
          <!-- MENGEN-AUSWAHL -->
          <div class="quantity-box">
            <div class="quantity-label">Menge:</div>
            <div class="quantity-controls">
              <button class="qty-btn minus" @click="decreaseQty">−</button>
              <span class="quantity-value">{{ quantity }}</span>
              <button class="qty-btn plus" @click="increaseQty">+</button>
            </div>
            <div class="total-price">
              Gesamt: {{ (product.price * quantity).toFixed(2) }} €
            </div>
          </div>
          
          <!-- IN WARENKORB BUTTON -->
          <button class="add-cart-btn" @click="addToCart">
            In den Warenkorb ({{ quantity }})
          </button>
        </div>
      </div>
      
      <div v-else class="not-found">Produkt nicht gefunden</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/Warenkorb.js'

const route = useRoute()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(true)
const quantity = ref(1) // WICHTIG: Startmenge 1

// Produkt laden
async function loadProduct() {
  loading.value = true
  const productId = route.params.id
  
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product/${productId}`)
    if (res.ok) {
      product.value = await res.json()
    }
  } catch (err) {
    console.error(err)
  }
  loading.value = false
}

// Menge erhöhen
function increaseQty() {
  quantity.value++
}

// Menge verringern (min. 1)
function decreaseQty() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// IN DEN WARENKORB - DIE WICHTIGSTE FUNKTION!
function addToCart() {
  if (!product.value) return
  
  console.log('🚀 ADDTOCART: Produkt zum Warenkorb hinzufügen')
  console.log('Produkt ID:', product.value.id)
  console.log('Produkt Name:', product.value.name)
  console.log('Ausgewählte Menge:', quantity.value)
  
  // WICHTIG: Die Menge wird übergeben!
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.image,
    description: product.value.description,
    category: product.value.category,
    quantity: quantity.value // DAS IST DIE MENGE DIE DER USER AUSGEWÄHLT HAT!
  })
  
  console.log('✅ Erfolg: Produkt zum Store gesendet')
}

onMounted(loadProduct)
</script>

<style scoped>
.detail-page {
  padding-top: 100px;
  min-height: 100vh;
  background: linear-gradient(135deg, #8b7355 0%, #a8916d 30%, #cbbf9b 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading, .not-found {
  text-align: center;
  padding: 3rem;
  color: white;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
}

.image-section {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.main-img {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
}

.info-section {
  color: white;
}

.back-link {
  color: white;
  text-decoration: none;
  opacity: 0.8;
  margin-bottom: 1rem;
  display: inline-block;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.price {
  color: #e26191;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.description {
  line-height: 1.6;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
}

/* MENGEN-BOX */
.quantity-box {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.quantity-label {
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.qty-btn {
  width: 45px;
  height: 45px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity-value {
  font-size: 1.8rem;
  font-weight: 700;
  min-width: 50px;
  text-align: center;
}

.total-price {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  text-align: center;
}

/* WARENKORB BUTTON */
.add-cart-btn {
  width: 100%;
  padding: 1.2rem;
  background: #e26191;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-cart-btn:hover {
  background: #d05583;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .quantity-controls {
    justify-content: center;
  }
}
</style>