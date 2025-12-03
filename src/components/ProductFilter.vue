<script setup>
import { ref, onMounted } from 'vue';
import Button from '@/components/NavButton.vue';

const emit = defineEmits(['productUpdate']);

const searchName = ref('');
const selectedCategory = ref('');
const categories = ref([]);

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/category';

onMounted(async () => {
  try {
    const res = await fetch(API_URL);
    if (res.ok) categories.value = await res.json();
  } catch (err) {
    console.error(err);
  }
});

function onSearch() {
  // Event an Parent senden, um Produkte zu filtern
  emit('productUpdate', { name: searchName.value, category: selectedCategory.value });
}

function onReset() {
  // Felder zurücksetzen
  searchName.value = '';
  selectedCategory.value = '';
  emit('productUpdate', {}); // Alle Produkte anzeigen
}
</script>

<template>
  <div class="product-filter-container">
    <div class="filter-inner">
      <input
        v-model="searchName"
        type="text"
        class="search-input"
        placeholder="Produktname suchen..."
        @keyup.enter="onSearch"
      />
      <select v-model="selectedCategory" class="category-select" @change="onSearch">
        <option value="">Alle Kategorien</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <!-- Schöne Buttons -->
      <Button variant="accent" :onClick="onSearch" class="filter-button">Suchen</Button>
      <Button variant="secondary" :onClick="onReset" class="filter-button">Reset</Button>
    </div>
  </div>
</template>

<style scoped>
.product-filter-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.filter-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  max-width: 900px;
  width: 100%;
  background-color: #f8f8f8;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.search-input {
  flex: 2 1 250px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.category-select {
  flex: 1 1 200px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

/* Buttons anpassen */
.filter-button {
  flex: 0 1 120px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
}

.filter-button.btn-accent {
  background-color: #d8a04c; /* hellbraun / Akzentfarbe */
  color: #fff;
}

.filter-button.btn-accent:hover {
  background-color: #c3923f;
}

.filter-button.btn-secondary {
  background-color: #ccc;
  color: #333;
}

.filter-button.btn-secondary:hover {
  background-color: #bbb;
}
</style>