<template>
  <div class="product-carousel" v-if="products.length > 0">
    <div class="carousel-container">
      <div class="carousel-header">
        <h2><i class="bi bi-fire"></i> Beliebteste Produkte</h2>
        <p>Entdecke unsere Bestseller</p>
      </div>
      
      <div class="carousel-wrapper">
        <button 
          @click="prevSlide" 
          class="carousel-btn prev-btn" 
          :disabled="currentSlide === 0"
          aria-label="Vorheriges Produkt"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        
        <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div 
            v-for="(product, index) in products" 
            :key="product.id" 
            class="carousel-slide"
            :class="{ 'active': index === currentSlide }"
          >
            <div class="slide-content">
              <router-link :to="`/product/${product.id}`" class="product-link">
                <img 
                  :src="getImageUrl(product.imageUrl)" 
                  :alt="product.title" 
                  class="product-image"
                  @error="handleImageError"
                />
                <div class="product-info">
                  <h3>{{ product.title }}</h3>
                  <p class="description">{{ truncateText(product.description, 60) }}</p>
                  <div class="price-category">
                    <span class="price">{{ formatCurrency(product.price) }}</span>
                    <span class="category">{{ getCategoryName(product.category) }}</span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
        
        <button 
          @click="nextSlide" 
          class="carousel-btn next-btn" 
          :disabled="currentSlide === products.length - 1"
          aria-label="Nächstes Produkt"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
      
      <div class="carousel-dots">
        <button 
          v-for="(product, index) in products" 
          :key="`dot-${product.id}`"
          @click="goToSlide(index)"
          class="dot"
          :class="{ 'active': index === currentSlide }"
          :aria-label="`Gehe zu Produkt ${index + 1}`"
        >
          <span class="sr-only">Produkt {{ index + 1 }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const products = ref([])
const loading = ref(true)
const currentSlide = ref(0)
const autoSlideInterval = ref(null)

// Hilfsfunktionen
const getImageUrl = (imageName) => {
  if (!imageName) return '/placeholder.jpg'
  if (imageName.startsWith('http')) return imageName
  return `/frontend-puppyracer/product_pics/${imageName}`
}

const handleImageError = (event) => {
  event.target.src = '/placeholder.jpg'
}

const formatCurrency = (amount) => {
  return `${parseFloat(amount || 0).toFixed(2)}€`
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const getCategoryName = (category) => {
  const names = {
    'LEINEN': 'Leinen',
    'HALSBAENDER': 'Halsbänder',
    'BEKLEIDUNG': 'Bekleidung',
    'SNACKS': 'Snacks'
  }
  return names[category] || category
}

// Carousel Navigation
const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const nextSlide = () => {
  if (currentSlide.value < products.value.length - 1) {
    currentSlide.value++
  }
}

const goToSlide = (index) => {
  currentSlide.value = index
}

const startAutoSlide = () => {
  if (products.value.length > 1) {
    autoSlideInterval.value = setInterval(() => {
      if (currentSlide.value === products.value.length - 1) {
        currentSlide.value = 0
      } else {
        currentSlide.value++
      }
    }, 5000)
  }
}

const stopAutoSlide = () => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value)
    autoSlideInterval.value = null
  }
}

// Produkte laden - KORRIGIERTER ENDPOINT
const loadProducts = async () => {
  loading.value = true
  try {
    // WICHTIG: Korrekter Endpoint ist /api/product (Singular)
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product`)
    
    if (response.ok) {
      const data = await response.json()
      // Nimm die ersten 5 Produkte oder alle falls weniger
      products.value = data.slice(0, 5)
      
      // Starte Auto-Slide nur wenn genug Produkte vorhanden
      if (products.value.length > 1) {
        startAutoSlide()
      }
    } else {
      console.error('Fehler beim Laden der Produkte:', response.status)
    }
  } catch (err) {
    console.error('Fehler beim Laden:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<style scoped>
.product-carousel {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d1b2d 100%);
  padding: 3rem 1rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.carousel-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.carousel-header {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.carousel-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.carousel-header p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
}

.carousel-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.carousel-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(226, 97, 145, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;
  z-index: 10;
}

.carousel-btn:hover:not(:disabled) {
  background: rgba(226, 97, 145, 1);
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%;
}

.carousel-slide {
  flex: 0 0 100%;
  padding: 0 1rem;
  transition: opacity 0.3s;
}

.carousel-slide.active {
  opacity: 1;
}

.slide-content {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
  height: 100%;
}

.slide-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.product-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.product-info {
  padding: 1.5rem;
  color: white;
}

.product-info h3 {
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  color: white;
  min-height: 3.5rem;
}

.description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  min-height: 4.5rem;
}

.price-category {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e26191;
}

.category {
  background: rgba(226, 97, 145, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #e26191;
  border: 1px solid rgba(226, 97, 145, 0.3);
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.5);
}

.dot.active {
  background: #e26191;
  transform: scale(1.2);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 768px) {
  .product-carousel {
    padding: 2rem 0.5rem;
  }
  
  .carousel-header h2 {
    font-size: 1.7rem;
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .product-image {
    height: 200px;
  }
  
  .product-info h3 {
    font-size: 1.2rem;
  }
  
  .description {
    font-size: 0.9rem;
  }
  
  .price {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .carousel-wrapper {
    gap: 0.5rem;
  }
  
  .carousel-slide {
    padding: 0 0.5rem;
  }
  
  .product-info {
    padding: 1rem;
  }
}
</style>