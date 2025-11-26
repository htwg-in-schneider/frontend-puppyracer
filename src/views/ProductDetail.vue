<template>
  <section v-if="product">
    <h1>{{ product.title }}</h1>
    <img :src="product.image" alt="">
    <p>{{ product.description }}</p>
    <p>Preis: €{{ product.price.toFixed(2) }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { products } from '@/data/products'
import { onMounted } from 'vue'
const props = defineProps({ id: String })
const product = ref(null)

onMounted(() => {
  product.value = products.find(p => String(p.id) === String(props.id))
})
</script>