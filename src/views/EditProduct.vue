<template>
  <form v-if="product" @submit.prevent="updateProduct">
    <input v-model="product.title" placeholder="Title" required />
    <input v-model.number="product.price" type="number" placeholder="Price" required />
    <textarea v-model="product.description" placeholder="Description" required></textarea>
    <button type="submit">Update</button>
    <button type="button" @click="deleteProduct">Delete</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const product = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/product/${route.params.id}`)
    if (!res.ok) throw new Error('Produkt nicht gefunden')
    product.value = await res.json()
  } catch (err) {
    console.error(err)
    alert('Fehler beim Laden des Produkts')
  }
})

async function updateProduct() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/product/${product.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product.value)
    })
    if (!res.ok) throw new Error('Update fehlgeschlagen')
    alert('Produkt aktualisiert!')
    router.push('/')
  } catch (err) {
    console.error(err)
    alert('Fehler beim Aktualisieren')
  }
}

async function deleteProduct() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/product/${product.value.id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Löschen fehlgeschlagen')
    alert('Produkt gelöscht!')
    router.push('/')
  } catch (err) {
    console.error(err)
    alert('Fehler beim Löschen')
  }
}
</script>