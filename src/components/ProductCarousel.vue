<template>
  <div class="product-carousel" v-if="products.length > 0">
    <div class="carousel-header">
      <h2>Beliebte Produkte</h2>
    </div>
    
    <div class="products-scroll">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="product-item"
      >
        <router-link :to="`/product/${product.id}`" class="product-link">
          <img 
            :src="getImageUrl(product.imageUrl)" 
            :alt="product.title" 
            class="product-image"
            @error="handleImageError"
          />
          <div class="product-info">
            <h3>{{ product.title }}</h3>
            <div class="price">{{ formatCurrency(product.price) }}</div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const products = ref([])

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

// Produkte laden
const loadProducts = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product`)
    
    if (response.ok) {
      const data = await response.json()
      products.value = data.slice(0, 8) // Erste 8 Produkte
    }
  } catch (err) {
    console.error('Fehler beim Laden:', err)
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.product-carousel {
  background: rgba(30, 30, 30, 0.8);
  padding: 1rem 0;
  margin-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.carousel-header {
  text-align: center;
  margin-bottom: 1rem;
  color: white;
}

.carousel-header h2 {
  font-size: 1.3rem;
  margin: 0;
}

.products-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0 1rem 1rem;
  scrollbar-width: thin;
  scrollbar-color: #e26191 rgba(255, 255, 255, 0.1);
}

.products-scroll::-webkit-scrollbar {
  height: 6px;
}

.products-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.products-scroll::-webkit-scrollbar-thumb {
  background: #e26191;
  border-radius: 3px;
}

.product-item {
  flex: 0 0 auto;
  width: 180px;
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: block;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.product-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.product-info {
  padding: 0.75rem;
  color: white;
}

.product-info h3 {
  font-size: 0.95rem;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
  height: 2.2rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #e26191;
}

/* Responsive */
@media (max-width: 768px) {
  .product-item {
    width: 160px;
  }
  
  .product-image {
    height: 120px;
  }
  
  .product-info h3 {
    font-size: 0.9rem;
  }
  
  .price {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .product-item {
    width: 140px;
  }
  
  .product-image {
    height: 110px;
  }
  
  .product-info {
    padding: 0.5rem;
  }
}
</style>