<template>
  <div class="card h-100 shadow-sm product-card">
    <router-link :to="`/product/view/${product.id}`">
      <img :src="productImage" class="card-img-top" :alt="product.title">
    </router-link>
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ product.title }}</h5>
      <p class="card-text text-muted">{{ product.description }}</p>
      <p class="text-accent fw-bold">{{ product.price.toFixed(2) }} €</p>
      <NavButton variant="accent" class="mt-auto" :to="`/product/view/${product.id}`">
        Details
      </NavButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  product: { type: Object, required: true }
});

// Bildermapping für alle Produkte aus deinem DataLoader
const productImage = computed(() => {
  const imageMap = {
    // ALTE Produkte (kannst du behalten oder entfernen)
    'Spielzeughund': 'Cute_stuffed_Dog.jpg',
    'Hundespielzeug Ball': 'Dog_Ball.jpg',
    'Premium Hundefutter': 'Dog_Food.jpg',
    
    // NEUE Produkte - LEINEN & GESCHIRRE
    'Premium Lederleine': 'leather-leash.jpg',
    'Flexi-Retractable Leine': 'flexi-leash.jpg',
    'Geschirr mit Brustpolster': 'dog-harness.jpg',
    
    // NEUE Produkte - HALSBÄNDER & HALSKETTEN
    'Reflektor Sicherheitshalsband': 'reflective-collar.jpg',
    'Lederhalsband mit Gravur': 'leather-collar.jpg',
    'Halskette mit Charme': 'dog-necklace.jpg',
    
    // NEUE Produkte - HUNDEBEKLEIDUNG
    'Regenjacke für Hunde': 'rain-jacket.jpg',
    'Winterpullover für Hunde': 'dog-sweater.jpg',
    'Kapuzenpullover mit Taschen': 'dog-hoodie.jpg',
    
    // NEUE Produkte - LECKERLIS & SNACKS
    'Rinderhaut-Kausnack': 'beef-snack.jpg',
    'Trainingsleckerlis Huhn': 'training-treats.jpg',
    'Zahnpflege-Kaustange': 'dental-stick.jpg'
  };
  
  const filename = imageMap[props.product.title] || 'default.jpg';
  return new URL(`../assets/product_pics/${filename}`, import.meta.url).href;
});
</script>

<style scoped>
.product-card {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  background-color: rgba(50, 50, 50, 0.8);
  border-radius: 10px;
  overflow: hidden;
  color: #f5f1e7;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .card-img-top {
  transform: scale(1.05);
}

.card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f5f1e7;
  margin-bottom: 0.5rem;
  min-height: 2.8rem; /* Für konsistente Höhe bei mehrzeiligen Titeln */
}

.card-text {
  font-size: 0.95rem;
  color: #f5f1e7;
  margin-bottom: 0.5rem;
  flex-grow: 1; /* Nimmt verfügbaren Platz ein */
  opacity: 0.9;
}

.text-accent {
  color: #e0c097;
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.NavButton {
  margin-top: auto; /* Button bleibt unten */
  padding: 0.5rem 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.NavButton:hover {
  transform: scale(1.05);
}

/* Responsive Anpassungen */
@media (max-width: 768px) {
  .product-card {
    max-width: 100%;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .card-text {
    font-size: 0.9rem;
  }
}
</style>