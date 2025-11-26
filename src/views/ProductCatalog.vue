<template>
  <section>
    <h1>Produkte</h1>
    <div class="grid">
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
        @details="showDetails"
      />
    </div>
  </section>
</template>

<script setup>
import { products as localProducts } from '@/data/products'
import ProductCard from '@/components/ProductCard.vue'
import { ref } from 'vue'

const products = ref(localProducts)

function showDetails(product) {
  alert(`${product.title}\n\n${product.description}\nPreis: €${product.price.toFixed(2)}`)
}
</script>

<style>
.grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap:1rem; }
</style>