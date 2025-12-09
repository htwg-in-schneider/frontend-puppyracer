<template>
  <div class="container my-5">
    <div v-if="!product" class="text-center">Lade Produkt …</div>
    <div v-else class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm product-detail-card">
          <img :src="productImage" class="card-img-top" alt="Produktbild">
          <div class="card-body">
            <h2 class="card-title">{{ product.title }}</h2>
            <p class="card-text">{{ product.description }}</p>
            <p class="text-accent fw-bold">{{ product.price }} €</p>
            <ProductReviews :productId="product.id" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import ProductReviews from '@/components/ProductReviews.vue';

const route = useRoute();
const product = ref(null);

// URL deines Backends (Spring Boot)
const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/product';

async function fetchProduct() {
  try {
    const res = await fetch(`${API_URL}/${route.params.id}`);
    if (!res.ok) throw new Error('Produkt nicht gefunden');
    product.value = await res.json();
  } catch (err) {
    console.error(err);
  }
}

onMounted(fetchProduct);

// Produktbild aus Assets auswählen (Frontend)
const productImage = computed(() => {
  if (!product.value) return '';
  switch (product.value.title) {
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
.product-detail-card {
  background-color: rgba(50, 50, 50, 0.85);
  color: #f5f1e7;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.card-img-top {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.card-text {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.text-accent {
  color: #e0c097;
  font-weight: 600;
  font-size: 1.2rem;
}
</style>