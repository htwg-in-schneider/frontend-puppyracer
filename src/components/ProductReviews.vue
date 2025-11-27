<template>
  <div>
    <h3>Reviews</h3>
    <ul>
      <li v-for="r in reviews" :key="r.id">{{ r.text }} - {{ r.author }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
defineProps({ productId: Number })
const reviews = ref([])

onMounted(async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/product/${productId}/reviews`)
  reviews.value = await res.json()
})
</script>