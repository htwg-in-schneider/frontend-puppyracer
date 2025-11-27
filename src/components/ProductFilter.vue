<template>
  <div>
    <input v-model="search" @input="$emit('update:search', search)" placeholder="Suche..." />
    <select v-model="category" @change="$emit('update:category', category)">
      <option value="">Alle</option>
      <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const search = ref('')
const category = ref('')
const categories = ref([])

onMounted(async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/category`)
  categories.value = await res.json()
})
</script>