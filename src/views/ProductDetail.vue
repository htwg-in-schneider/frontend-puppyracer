<template>
  <div v-if="product" class="product-detail-page">
    <button @click="$router.back()">← Zurück</button>
    <h1>{{ product.title }}</h1>
    <img :src="productImage" :alt="product.title" class="detail-image" />
    <p>{{ product.description }}</p>
    <p class="price">{{ product.price }} €</p>

    <ProductReviews :productId="product.id" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import ProductReviews from '../components/ProductReviews.vue';

const route = useRoute();
const product = ref(null);

const productImage = computed(() => {
  if (!product.value) return '';
  switch(product.value.imageUrl) {
    case 'Cute_stuffed_Dog.jpg':
      return new URL('../assets/product_pics/Cute_stuffed_Dog.jpg', import.meta.url).href;
    case 'Dog_Ball.jpg':
      return new URL('../assets/product_pics/Dog_Ball.jpg', import.meta.url).href;
    case 'Dog_Food.jpg':
      return new URL('../assets/product_pics/Dog_Food.jpg', import.meta.url).href;
    default:
      return new URL('../assets/product_pics/default.jpg', import.meta.url).href;
  }
});

onMounted(async () => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product/${route.params.id}`);
  if (res.ok) product.value = await res.json();
});
</script>

<style scoped>
.product-detail-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
.detail-image {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 1rem;
}
.price {
  font-weight: bold;
  font-size: 1.5rem;
  margin: 0.5rem 0;
}
</style>