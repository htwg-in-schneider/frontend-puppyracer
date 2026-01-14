<template>
<section class="product-carousel" aria-label="Produktvorschau">
  <div class="product-profiles" role="list" aria-label="Produktliste">
    <div 
      v-for="product in displayedProducts" 
      :key="product.id" 
      class="product-card"
      role="listitem"
      @click="goToProduct(product.id)"
      tabindex="0"
      @keyup.enter="goToProduct(product.id)"
      :aria-label="`${product.name} ansehen`"
    >
      <img 
        :src="getImageUrl(product.imageUrl)" 
        :alt="`Bild von ${product.name}`"
        loading="lazy"
        :style="{ height: imageHeight }"
        @error="handleImageError"
      >
      <h6 class="product-name">{{ product.name }}</h6>
      <div class="product-overlay">
        <span class="overlay-text">Produkt ansehen →</span>
      </div>
    </div>
  </div>
</section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const products = ref([])
const loading = ref(true)
const imageError = ref(false)

// Bild-URLs korrekt erstellen
const getImageUrl = (imageName) => {
  if (!imageName) return ''
  
  // Für Entwicklung: localhost
  if (import.meta.env.DEV) {
    return `/src/assets/product_pics/${imageName}`
  }
  
  // Für Produktion: GitHub Pages
  return `/frontend-puppyracer/product_pics/${imageName}`
}

// Produkte vom Backend laden
onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
    if (response.ok) {
      const data = await response.json()
      // Nur 4 Produkte für Carousel nehmen
      products.value = data.slice(0, 4).map(p => ({
        id: p.id,
        name: p.title,
        imageUrl: p.imageUrl
      }))
    }
  } catch (error) {
    console.error('Fehler beim Laden der Produkte:', error)
    // Fallback: Hardcoded Daten
    products.value = [
      { id: 1, name: 'Premium Lederleine', imageUrl: 'Hundeleine-dunklesLeder.png' },
      { id: 2, name: 'Leine in Rot', imageUrl: 'Hundeleine-rot.png' },
      { id: 3, name: 'Stoffleine mit Griff', imageUrl: 'Hundeleine-Stoff.png' },
      { id: 4, name: 'Türkises Halsband', imageUrl: 'Hundehalsband-Türkis.png' }
    ]
  } finally {
    loading.value = false
  }
})

const displayedProducts = computed(() => {
  return loading.value ? [] : products.value
})

// Responsive Bildhöhe
const imageHeight = computed(() => {
  const width = window.innerWidth
  if (width < 768) return '200px'
  if (width < 992) return '250px'
  return '300px'
})

const handleImageError = (event) => {
  console.warn(`Bild konnte nicht geladen werden: ${event.target.alt}`)
  event.target.style.opacity = '0.7'
}

const goToProduct = (productId) => {
  if (productId) {
    router.push(`/product/${productId}`)
  }
}
</script>

<style scoped>
/* Dein CSS bleibt gleich */
.product-carousel {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 1.5rem 0;
    padding-top: 5rem;
    background: var(--color-primary-dark);
    scrollbar-width: thin;
    scrollbar-color: var(--color-accent-pink) var(--color-primary-dark);
}

.product-carousel::-webkit-scrollbar {
    height: 8px;
}

.product-carousel::-webkit-scrollbar-track {
    background: var(--color-primary-dark);
}

.product-carousel::-webkit-scrollbar-thumb {
    background: var(--color-accent-pink);
    border-radius: 4px;
}

.product-profiles {
    display: flex;
    gap: 1.5rem;
    padding: 0 1.5rem 1rem;
    scroll-snap-type: x mandatory;
}

.product-card {
    min-width: min(400px, 80vw);
    background: var(--color-primary-dark);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    text-align: center;
    scroll-snap-align: start;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    position: relative;
    border-radius: 8px;
    outline: none;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.product-card:focus {
    outline: 3px solid var(--color-accent-pink);
    outline-offset: 3px;
}

.product-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #2D2121; /* DUNKELBRAUNER HINTERGRUND statt weiß */
    transition: transform 0.3s ease;
}

.product-card:hover img {
    transform: scale(1.05);
}

.product-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
    opacity: 1;
}

.overlay-text {
    color: white;
    font-weight: 600;
    font-size: 1.1rem;
    padding: 1rem 1.5rem;
    background: rgba(226, 97, 145, 0.9);
    border-radius: 6px;
}

.product-name {
    margin: 0.75rem 0 1rem;
    font-weight: 400;
    font-size: 1.1rem;
    color: var(--color-background-light);
    padding: 0 1rem;
    min-height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (max-width: 768px) {
    .product-carousel {
        padding-top: 3rem;
    }
    
    .product-card {
        min-width: min(300px, 85vw);
    }
    
    .product-overlay {
        opacity: 0.8;
    }
    
    .overlay-text {
        font-size: 1rem;
        padding: 0.75rem 1rem;
    }
    
    .product-name {
        font-size: 1rem;
        min-height: 2rem;
    }
}

@media (max-width: 480px) {
    .product-carousel {
        padding: 2rem 0 1rem;
    }
    
    .product-profiles {
        gap: 1rem;
        padding: 0 1rem 1rem;
    }
    
    .product-name {
        font-size: 0.95rem;
        padding: 0 0.5rem;
    }
}
</style>