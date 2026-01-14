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
      products.value = data.slice(0, 12)
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
  padding: 1.5rem 0;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.carousel-header {
  text-align: center;
  margin-bottom: 1.5rem;
  color: white;
  padding: 0 1rem;
}

.carousel-header h2 {
  font-size: 1.8rem;
  margin: 0;
}

.products-scroll {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 0 1rem 1.5rem;
  scrollbar-width: thin;
  scrollbar-color: #e26191 rgba(255, 255, 255, 0.1);
}

.products-scroll::-webkit-scrollbar {
  height: 8px;
}

.products-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.products-scroll::-webkit-scrollbar-thumb {
  background: #e26191;
  border-radius: 4px;
}

.product-item {
  flex: 0 0 calc(25% - 0.75rem); /* 4 Produkte pro Ansicht bei voller Breite */
  min-width: 280px;
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: block;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
}

.product-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.product-info {
  padding: 1.2rem;
  color: white;
}

.product-info h3 {
  font-size: 1.2rem;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
  height: 3rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #e26191;
}

/* Responsive Anpassungen */
@media (max-width: 1200px) {
  .product-item {
    flex: 0 0 calc(33.333% - 0.67rem); /* 3 Produkte */
    min-width: 260px;
  }
  
  .product-image {
    height: 200px;
  }
}

@media (max-width: 900px) {
  .product-item {
    flex: 0 0 calc(50% - 0.5rem); /* 2 Produkte */
    min-width: 220px;
  }
  
  .product-image {
    height: 180px;
  }
  
  .product-info h3 {
    font-size: 1.1rem;
    height: 2.6rem;
  }
  
  .price {
    font-size: 1.3rem;
  }
}

@media (max-width: 600px) {
  .product-carousel {
    padding: 1rem 0;
  }
  
  .carousel-header h2 {
    font-size: 1.5rem;
  }
  
  .product-item {
    flex: 0 0 calc(100% - 0.5rem); /* 1 Produkt */
    min-width: 280px;
  }
  
  .product-image {
    height: 160px;
  }
  
  .product-info {
    padding: 1rem;
  }
  
  .product-info h3 {
    font-size: 1rem;
    height: 2.4rem;
  }
  
  .price {
    font-size: 1.2rem;
  }
}

/* Für sehr große Bildschirme */
@media (min-width: 1600px) {
  .product-item {
    flex: 0 0 calc(20% - 0.8rem); /* 5 Produkte auf sehr großen Bildschirmen */
  }
  
  .product-image {
    height: 240px;
  }
}
</style>