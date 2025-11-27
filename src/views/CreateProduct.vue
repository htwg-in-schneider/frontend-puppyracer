<template>
  <form @submit.prevent="createProduct">
    <input v-model="title" placeholder="Title" required />
    <input v-model.number="price" type="number" placeholder="Price" required />
    <textarea v-model="description" placeholder="Description" required></textarea>
    <button type="submit">Create</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const title = ref('')
const price = ref(0)
const description = ref('')
const router = useRouter()

async function createProduct() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.value, price: price.value, description: description.value })
    })
    if (!res.ok) throw new Error('Fehler beim Erstellen')
    alert('Produkt erstellt!')
    router.push('/')
  } catch (err) {
    console.error(err)
    alert('Fehler beim Erstellen')
  }
}
</script>