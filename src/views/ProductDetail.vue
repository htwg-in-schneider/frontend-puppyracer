<template>
  <div class="detail-page">
    <div class="container">
      <div v-if="loading" class="loading">Lädt...</div>
      
      <div v-else-if="product" class="product-detail">
        <!-- BILD: GENAU WIE IN PRODUCTCARD -->
        <div class="image-section">
          <img :src="getImageUrl()" :alt="product.title" class="main-img" />
        </div>
        
        <!-- Info -->
        <div class="info-section">
          <!-- KORRIGIERT: Zurück zur Produktübersicht -->
          <button @click="goBack" class="back-link">
            ← Zurück zur Übersicht
          </button>
          
          <h1>{{ product.title }}</h1>
          <div class="price">{{ product.price?.toFixed(2) }} €</div>
          <p class="description">{{ product.description }}</p>
          
          <!-- Kategorie -->
          <div class="category" v-if="product.category">
            <strong>Kategorie:</strong> {{ product.category }}
          </div>
          
          <!-- Reviews -->
          <ProductReviews :product-id="product.id" />
          
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
      
      <div v-else class="not-found">
        <h2>Produkt nicht gefunden</h2>
        <button @click="loadProduct" class="retry-btn">Erneut versuchen</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/Warenkorb.js'
import ProductReviews from '@/components/ProductReviews.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(true)
const quantity = ref(1)

async function loadProduct() {
  loading.value = true
  
  try {
    const res = await fetch(`http://localhost:8081/api/product/${route.params.id}`)
    
    if (res.ok) {
      product.value = await res.json()
      console.log('Produkt geladen:', product.value)
    } else {
      console.error('Fehler:', res.status)
      product.value = null
    }
  } catch (err) {
    console.error('Fetch Fehler:', err)
    product.value = null
  }
  loading.value = false
}

const getImageUrl = () => {
  if (!product.value) {
    return '/src/assets/product_pics/default.jpg'
  }
  
  const imageMap = {
    1: '/src/assets/product_pics/Hundeleine-dunklesLeder.png',
    2: '/src/assets/product_pics/HundeLeine-rot.png',
    3: '/src/assets/product_pics/hundeleine-Stoff.png',
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
}

const goBack = () => {
  if (product.value?.category) {
    router.push(`/produkte/${product.value.category.toLowerCase()}`)
  } else {
    router.push('/produkte')
  }
}

function increaseQty() {
  quantity.value++
}

function decreaseQty() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

function addToCart() {
  if (!product.value) return
  
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.title,
    price: product.value.price,
    image: getImageUrl(),
    description: product.value.description,
    category: product.value.category,
    quantity: quantity.value
  })
  
  console.log('Produkt zum Warenkorb hinzugefügt')
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

.loading {
  text-align: center;
  padding: 3rem;
  color: white;
  font-size: 1.2rem;
}

.not-found {
  text-align: center;
  padding: 3rem;
  color: white;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 10px;
}

.not-found h2 {
  color: #ff6b6b;
  margin-bottom: 1rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #e26191;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  min-height: 500px;
}

.main-img {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Für größere Bildschirme */
@media (min-width: 769px) {
  .image-section {
    min-height: 550px;
  }
  
  .main-img {
    max-height: 550px;
  }
}

/* Für sehr kleine Bildschirme */
@media (max-width: 480px) {
  .image-section {
    min-height: 350px;
    padding: 1rem;
  }
  
  .main-img {
    max-height: 350px;
  }
}

.info-section {
  color: white;
}

.back-link {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  opacity: 0.9;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s;
}

.back-link:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(-3px);
  opacity: 1;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.price {
  color: #e26191;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.description {
  line-height: 1.6;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

.category {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  display: inline-block;
  margin-bottom: 2rem;
}

.quantity-box {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 1.5rem;
  margin: 2rem 0;
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
  
  .image-section {
    min-height: 400px;
  }
  
  .main-img {
    max-height: 400px;
  }
}
</style>