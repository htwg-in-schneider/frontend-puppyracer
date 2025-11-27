<template>
  <div v-if="product">
    <h2>{{ product.title }}</h2>
    <p>{{ product.description }}</p>
    <p>{{ product.price }} €</p>

    <ProductReviews :productId="product.id" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductReviews from '../components/ProductReviews.vue'

const route = useRoute()
const product = ref(null)

onMounted(async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/product/${route.params.id}`)
  product.value = await res.json()
})
</script>