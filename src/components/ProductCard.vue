<template>
  <div class="card product-card" @click="goToProduct">
    <div class="image-container">
      <img 
        :src="imageUrl" 
        class="card-img" 
        :alt="product.title"
        loading="lazy"
      >
    </div>
    
    <div class="card-body">
      <h5 class="card-title">{{ product.title }}</h5>
      <p class="card-description">{{ product.description }}</p>
      <p class="card-price">{{ formattedPrice }}</p>
      
      <div class="card-actions">
        <router-link 
          :to="productRoute" 
          class="btn-details"
          @click.stop
        >
          Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  product: { type: Object, required: true }
})

const router = useRouter()
const imageError = ref(false)

// Computed Properties
const imageUrl = computed(() => {
  if (imageError.value) return getDefaultImage()
  
  const imageName = props.product.imageUrl || props.product.imageName
  if (imageName) {
    return `/src/assets/product_pics/${imageName}`
  }
  return getFallbackImage(props.product.id)
})

const productRoute = computed(() => `/product/${props.product.id}`)
const formattedPrice = computed(() => `${props.product.price.toFixed(2)} €`)

// Methods
const getFallbackImage = (productId) => {
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
  return imageMap[productId] || getDefaultImage()
}

const getDefaultImage = () => '/src/assets/product_pics/default.jpg'

const handleImageError = () => {
  imageError.value = true
}

const goToProduct = () => {
  router.push(productRoute.value)
}
</script>

<style scoped>
.product-card {
  --card-bg: rgba(50, 50, 50, 0.8);
  --card-text: #f5f1e7;
  --card-accent: #e0c097;
  --card-hover: #d4b080;
  
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  background: var(--card-bg);
  border-radius: 10px;
  overflow: hidden;
  color: var(--card-text);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .card-img {
  transform: scale(1.05);
}

.card-body {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--card-text);
  margin-bottom: 0.5rem;
  min-height: 2.8rem;
  line-height: 1.3;
}

.card-description {
  font-size: 0.95rem;
  color: var(--card-text);
  margin-bottom: 0.5rem;
  flex-grow: 1;
  opacity: 0.9;
  line-height: 1.4;
}

.card-price {
  color: var(--card-accent);
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.card-actions {
  margin-top: auto;
}

.btn-details {
  display: inline-block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--card-accent);
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
}

.btn-details:hover {
  background: var(--card-hover);
  transform: scale(1.02);
}

/* Responsive */
@media (max-width: 768px) {
  .product-card {
    max-width: 100%;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .card-description {
    font-size: 0.9rem;
  }
  
  .image-container {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .card-title {
    font-size: 1rem;
    min-height: auto;
  }
  
  .image-container {
    height: 160px;
  }
  
  .btn-details {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>