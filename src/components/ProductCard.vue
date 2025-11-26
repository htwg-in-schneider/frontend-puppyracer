<template>
  <article class="product-card">
    <img :src="product.image" :alt="product.title" />
    <h3>{{ product.title }}</h3>
    <p class="price">€{{ product.price.toFixed(2) }}</p>
    <button @click="$emit('details', product)">Details</button>
  </article>
</template>
<router-link :to="`/product/${product.id}`">Details</router-link>
<script setup>
defineProps({ product: Object })
</script>

<style scoped>
/* einfache Styles */
.product-card img { width:100%; height:200px; object-fit:cover; }
.price { font-weight:600; }
</style>