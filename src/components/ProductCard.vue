<template>
  <div class="card mb-4 shadow-sm product-card">
    <router-link :to="`/product/view/${product.id}`">
      <img :src="productImage" class="card-img-top" alt="Produktbild">
    </router-link>
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ product.title }}</h5>
      <p class="card-text text-muted">{{ product.description }}</p>
      <p class="text-accent fw-bold">{{ product.price }} €</p>
      <NavButton variant="accent" class="mt-auto" :to="`/product/view/${product.id}`">
        Details
      </NavButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { defineProps } from 'vue';

const props = defineProps({
  product: { type: Object, required: true }
});

const productImage = computed(() => {
  switch (props.product.title) {
    case 'Spielzeughund':
      return new URL('../assets/product_pics/Cute_stuffed_Dog.jpg', import.meta.url).href;
    case 'Hundespielzeug Ball':
      return new URL('../assets/product_pics/Dog_Ball.jpg', import.meta.url).href;
    case 'Premium Hundefutter':
      return new URL('../assets/product_pics/Dog_Food.jpg', import.meta.url).href;
    default:
      return new URL('../assets/product_pics/default.jpg', import.meta.url).href;
  }
});
</script>



<style scoped>
.product-card {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  background-color: rgba(50, 50, 50, 0.8); /* leicht transparent, dunkle Karte */
  border-radius: 10px;
  overflow: hidden;
  color: #f5f1e7; /* helles Creme/Beige für Text */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-in-out;
}

.product-card:hover {
  transform: translateY(-5px);
}

.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 1rem;
}

.card-title {
  font-size: 1.2rem;  /* größer für bessere Lesbarkeit */
  font-weight: 700;
  color: #f5f1e7;     /* helles Creme */
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.95rem; /* etwas kleiner für Beschreibung */
  color: #f5f1e7;     /* helles Creme */
  margin-bottom: 0.5rem;
}

.text-accent {
  color: #e0c097;     /* hellbrauner Akzent für Preis */
  font-weight: 600;
  font-size: 1rem;
}

.NavButton {
  margin-top: 0.5rem;
}
</style>