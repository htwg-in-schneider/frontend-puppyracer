<template>
  <article class="card product-card" @click="goToProduct">
    <div class="image-container">
      <img 
        :src="imageUrl" 
        class="card-img" 
        :alt="`Produktbild: ${product.title}`"
        loading="lazy"
        @error="handleImageError"
      >
    </div>
    
    <div class="card-body">
      <h3 class="card-title">{{ product.title }}</h3>
      <p class="card-description">{{ truncatedDescription }}</p>
      <p class="card-price">{{ formattedPrice }}</p>
      
      <div class="card-actions">
        <router-link 
          :to="productRoute" 
          class="btn-details"
          @click.stop
          :aria-label="`Details zu ${product.title}`"
        >
          Details anzeigen
        </router-link>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { productImages } from '@/utils/images' // WICHTIG: Import hinzufügen

const props = defineProps({
  product: { type: Object, required: true }
})

const router = useRouter()
const imageError = ref(false)

// Computed Properties - NEU und KORREKT
const imageUrl = computed(() => {
  if (imageError.value) return productImages['default']
  
  // Direkter Zugriff über die Bildermap
  return productImages[props.product.id] || productImages['default']
})

const productRoute = computed(() => `/product/${props.product.id}`)
const formattedPrice = computed(() => `${props.product.price.toFixed(2)} €`)
const truncatedDescription = computed(() => {
  const desc = props.product.description || ''
  return desc.length > 100 ? desc.substring(0, 100) + '...' : desc
})

// Methods
const handleImageError = () => {
  imageError.value = true
}

const goToProduct = () => {
  router.push(productRoute.value)
}
</script>

<style scoped>
/* Dein bestehender CSS-Code bleibt UNVERÄNDERT */
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
  background: #f0f0f0;
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
  color: var(--color-primary-dark);
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

.btn-details:active {
  transform: scale(0.98);
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