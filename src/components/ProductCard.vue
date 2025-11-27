<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.title" />
    <h3>{{ product.title }}</h3>
    <p>{{ product.price }} €</p>
    <button @click="$router.push(`/product/${product.id}`)">Details</button>
    <button @click="$emit('edit')">Bearbeiten</button>
  </div>
</template>

<script setup>
defineProps({ product: Object })
</script>

<style scoped>
.product-card { border: 1px solid #ccc; padding: 1rem; margin: 1rem; }
</style>