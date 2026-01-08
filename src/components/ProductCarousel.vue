<!-- DogCarousel.vue - Optimierte Version -->
<template>
<section class="dog-carousel">
  <div class="dog-profiles">
    <div class="dog-card" v-for="dog in dogs" :key="dog.id">
      <img 
        :src="dog.image" 
        :alt="dog.name"
        loading="lazy"
        :style="{ height: imageHeight }"
      >
      <h6 class="dog-name">{{ dog.name }}</h6>
    </div>
  </div>
</section>
</template>

<script setup>
import { computed } from 'vue'

const dogs = [
  { id: 1, name: 'Leder Leine', image: '/src/assets/product_pics/Hundeleine-dunklesLeder.png' },
  { id: 2, name: 'Stoff Leine', image: '/src/assets/product_pics/Hundeleine-Stoff.png' },
  { id: 3, name: 'Premium Activa', image: '/src/assets/product_pics/Activa-Gold-Futter.png' },
  { id: 4, name: 'Pedigree', image: '/src/assets/product_pics/Pedigree-Futter.png' },
  { id: 5, name: 'Nutrima Futter', image: '/src/assets/product_pics/Nutrima-Futter.png' },
  { id: 6, name: 'Regendichte Jacke für Hunde', image: '/src/assets/product_pics/Hundejacke-Schwarz.png' },
  { id: 7, name: 'Warme Hundekleidung', image: '/src/assets/product_pics/HundePulli.png' },
  { id: 8, name: 'Hundehalsband in Rot', image: '/src/assets/product_pics/Hundehalsband-Rot.png' },
  { id: 9, name: 'Hundehalsband in Türkis', image: '/src/assets/product_pics/Hundehalsband-Türkis.png' },
]

// Responsive Bildhöhe
const imageHeight = computed(() => {
  const width = window.innerWidth
  if (width < 768) return '200px'
  if (width < 992) return '250px'
  return '300px'
})
</script>

<style scoped>
.dog-carousel {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 1.5rem 0;
    padding-top: 5rem;
    background: var(--color-primary-dark);
}

.dog-profiles {
    display: flex;
    gap: 1.5rem;
    padding: 0 1.5rem 1rem;
    scroll-snap-type: x mandatory;
    scrollbar-width: thin;
    scrollbar-color: var(--color-accent-pink) var(--color-primary-dark);
}

.dog-profiles::-webkit-scrollbar {
    height: 8px;
}

.dog-profiles::-webkit-scrollbar-track {
    background: var(--color-primary-dark);
}

.dog-profiles::-webkit-scrollbar-thumb {
    background: var(--color-accent-pink);
    border-radius: 4px;
}

.dog-card {
    min-width: min(400px, 80vw); /* Responsive */
    background: var(--color-primary-dark);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    text-align: center;
    scroll-snap-align: start;
    transition: transform 0.3s ease;
}

.dog-card:hover {
    transform: translateY(-4px);
}

.dog-card img {
    width: 100%;
    object-fit: cover;
}

.dog-name {
    margin: 0.75rem 0 1rem;
    font-weight: 300;
    font-size: 1rem;
    color: var(--color-background-light);
}

@media (max-width: 768px) {
    .dog-carousel {
        padding-top: 3rem;
    }
    
    .dog-card {
        min-width: min(300px, 85vw);
    }
}
</style>