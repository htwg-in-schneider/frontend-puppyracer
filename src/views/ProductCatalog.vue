<template>
  <div class="container my-5">
    <ProductFilter @productUpdate="updateProducts" />

    <div v-if="loading" class="text-center py-5">
      Produkte werden geladen…
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="products.length" class="row g-4">
      <div v-for="product in products" :key="product.id" class="col-md-4">
        <ProductCard :product="product" />
      </div>
    </div>

    <div v-else-if="!loading" class="alert alert-light text-center">
      Keine Produkte gefunden.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import ProductFilter from '@/components/ProductFilter.vue';

const products = ref([]);
const loading = ref(true);
const error = ref(null);

// Stelle sicher, dass diese Base-URL auf dein Backend zeigt
const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/product';

// Funktion, die Produkte lädt
async function fetchProducts(filters = {}) {
  loading.value = true;
  error.value = null;
  try {
    let url = API_URL;
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.category) params.append('category', filters.category);
    if ([...params].length) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Fehler beim Laden der Produkte');
    products.value = await res.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// Wird vom Filter aufgerufen
function updateProducts(filters) {
  fetchProducts(filters);
}

// Beim Laden der Komponente die Produkte abrufen
onMounted(() => fetchProducts());
</script>

<style scoped>
.row.g-4 {
  margin-top: 1rem;
}
</style>