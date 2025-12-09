<template>
  <div class="container my-5">
    <!-- Padding für die fixierte Navbar -->
    <div :style="{ paddingTop: isHomePage ? '20px' : '100px' }"></div>
    
    <!-- Filter nur auf Kategorie-Seiten oder wenn explizit gewünscht -->
    <ProductFilter 
      v-if="!isHomePage" 
      @productUpdate="updateProducts" 
    />
    
    <!-- Homepage-Titel -->
    <div v-if="isHomePage" class="text-center mb-5">
      <h1 class="display-5 fw-bold">Alle Produkte</h1>
      <p class="lead text-muted">Entdecke unser komplettes Sortiment</p>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-accent" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Produkte werden geladen…</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="products.length">
      <!-- Kategorie-Titel auf Kategorie-Seiten -->
      <div v-if="!isHomePage && currentCategoryName" class="row mb-4">
        <div class="col">
          <h2 class="category-title mb-3">{{ currentCategoryName }}</h2>
          <div class="d-flex justify-content-between align-items-center">
            <p class="text-muted mb-0">{{ products.length }} Produkte gefunden</p>
            <div class="sort-options">
              <select class="form-select form-select-sm w-auto">
                <option>Beliebteste</option>
                <option>Preis: Niedrig zu Hoch</option>
                <option>Preis: Hoch zu Niedrig</option>
                <option>Neuheiten</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Produkt-Grid -->
      <div class="row justify-content-start">
        <div
          v-for="product in products"
          :key="product.id"
          class="col-md-4 col-sm-6 col-12 product-col"
        >
          <ProductCard :product="product" />
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="alert alert-light text-center py-5">
      <h4>Keine Produkte gefunden</h4>
      <p>Versuche es mit einem anderen Suchbegriff oder einer anderen Kategorie.</p>
      <button v-if="!isHomePage" class="btn btn-accent mt-3" @click="resetFilters">
        Alle Filter zurücksetzen
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import ProductFilter from '@/components/ProductFilter.vue'

const products = ref([])
const loading = ref(true)
const error = ref(null)

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/product'

const route = useRoute()

// Props für Kategorie
const props = defineProps({
  category: {
    type: String,
    default: ''
  }
})

// Prüfe, ob wir auf der Homepage sind
const isHomePage = computed(() => {
  return route.path === '/'
})

// Kategorienamen für die Anzeige
const categoryNames = {
  leinen: 'Leinen & Geschirre',
  halsbaender: 'Halsbänder & Halsketten',
  bekleidung: 'Hundebekleidung',
  snacks: 'Leckerlis & Snacks'
}

const currentCategoryName = computed(() => {
  return props.category ? categoryNames[props.category] : ''
})

async function fetchProducts(filters = {}) {
  loading.value = true
  error.value = null
  try {
    let url = API_URL
    const params = new URLSearchParams()
    
    // Auf Homepage keine Kategorie filtern (alle Produkte)
    // Auf Kategorie-Seiten die Kategorie verwenden
    const category = isHomePage.value ? '' : (props.category || filters.category)
    
    if (filters.name) params.append('name', filters.name)
    if (category) params.append('category', category)
    if ([...params].length) url += `?${params.toString()}`

    console.log('Fetching products from:', url)
    
    const res = await fetch(url)
    if (!res.ok) throw new Error('Fehler beim Laden der Produkte')
    
    const data = await res.json()
    console.log('Received products:', data)
    
    products.value = data
  } catch (err) {
    console.error('Error fetching products:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function updateProducts(filters) {
  fetchProducts(filters)
}

function resetFilters() {
  fetchProducts()
}

onMounted(() => {
  fetchProducts()
})

// Beobachte Änderungen in den Props
watch(
  () => props.category,
  (newCategory) => {
    console.log('Category prop changed to:', newCategory)
    fetchProducts({ category: newCategory })
  },
  { immediate: true }
)

// Beobachte Routenänderungen (für Homepage vs Kategorie)
watch(
  () => route.path,
  (newPath) => {
    console.log('Route changed to:', newPath)
    // Wenn wir zur Homepage wechseln, alle Produkte laden
    if (newPath === '/') {
      fetchProducts()
    }
  }
)
</script>

<style scoped>
/* Deine bestehenden Styles bleiben */
.category-title {
  color: #333;
  border-bottom: 2px solid #e0c097;
  padding-bottom: 0.5rem;
}

.text-accent {
  color: #e26191;
}

.btn-accent {
  background-color: #e26191;
  color: white;
  border: none;
}

.btn-accent:hover {
  background-color: #d05583;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; 
  gap: 1rem;                       
  margin-top: 2rem;
  margin-bottom: 5rem;              
}

.product-col {
  flex: 1 1 calc(33.333% - 1rem); 
  max-width: calc(33.333% - 1rem);
  margin-bottom: 1rem;
}

@media (max-width: 992px) {
  .product-col {
    flex: 1 1 calc(50% - 1rem); 
    max-width: calc(50% - 1rem);
  }
}

@media (max-width: 576px) {
  .product-col {
    flex: 1 1 100%; 
    max-width: 100%;
  }
}
</style>