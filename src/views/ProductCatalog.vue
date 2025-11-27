<template>
  <ProductFilter @update:search="onSearch" @update:category="onCategory" />
  <button @click="$router.push('/product/create')">Neues Produkt</button>

  <div class="product-grid">
    <ProductCard
      v-for="p in products"
      :key="p.id"
      :product="p"
      @edit="() => $router.push(`/product/edit/${p.id}`)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import ProductFilter from '../components/ProductFilter.vue'

const products = ref([])
const search = ref('')
const category = ref('')

async function fetchProducts() {
  const query = new URLSearchParams({ name: search.value, category: category.value })
  const res = await fetch(`${import.meta.env.VITE_API_URL}/product?${query}`)
  products.value = await res.json()
}

function onSearch(val) { search.value = val }
function onCategory(val) { category.value = val }

onMounted(fetchProducts)
watch([search, category], fetchProducts)
</script>