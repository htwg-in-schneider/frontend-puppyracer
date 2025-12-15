<template>
  <div class="catalog">
    <!-- Header mit Such-Info -->
    <div class="header">
      <h1>
        <template v-if="searchQuery">
          <i class="bi bi-search"></i> Suchergebnisse für "{{ searchQuery }}"
        </template>
        <template v-else>{{ categoryName || 'Alle Produkte' }}</template>
      </h1>
      <p class="subtitle">
        {{ filteredProducts.length }} Produkt{{ filteredProducts.length !== 1 ? 'e' : '' }} gefunden
      </p>
    </div>
    
    <div class="layout">
      <!-- Filter-Sidebar -->
      <aside class="filter-sidebar">
        <ProductFilter @filterChange="updateSort" />
        
        <!-- Such-Info -->
        <div v-if="searchQuery" class="search-info">
          <div class="search-term">
            <i class="bi bi-search"></i>
            <strong>Aktuelle Suche:</strong>
            <span>"{{ searchQuery }}"</span>
          </div>
          <button class="clear-search" @click="clearSearch">
            <i class="bi bi-x-circle"></i>
            Suche löschen
          </button>
        </div>
      </aside>
      
      <!-- Produktliste -->
      <main class="products-area">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Produkte werden geladen...</p>
        </div>
        
        <div v-else-if="filteredProducts.length" class="products-grid">
          <ProductCard
            v-for="product in sortedProducts"
            :key="product.id"
            :product="product"
            @click="goToProduct(product.id)"
          />
        </div>
        
        <div v-else class="empty">
          <template v-if="searchQuery">
            <i class="bi bi-search"></i>
            <h3>Keine Ergebnisse für "{{ searchQuery }}"</h3>
            <p>Versuche einen anderen Suchbegriff oder stelle sicher, dass alle Wörter richtig geschrieben sind.</p>
            <div class="empty-actions">
              <button @click="clearSearch" class="btn-clear">
                <i class="bi bi-arrow-left"></i>
                Zurück zur Übersicht
              </button>
              <button @click="searchExamples" class="btn-examples">
                <i class="bi bi-lightbulb"></i>
                Suchvorschläge anzeigen
              </button>
            </div>
          </template>
          <template v-else>
            <i class="bi bi-box"></i>
            <h3>Keine Produkte verfügbar</h3>
            <p>In dieser Kategorie sind aktuell keine Produkte vorhanden.</p>
          </template>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import ProductFilter from '@/components/ProductFilter.vue'

const route = useRoute()
const router = useRouter()

// Props für Kategorie und Suchbegriff
const props = defineProps({
  category: {
    type: String,
    default: ''
  },
  searchQuery: {
    type: String,
    default: ''
  },
  initialSearch: {
    type: String,
    default: ''
  }
})

const allProducts = ref([])
const loading = ref(true)
const sortBy = ref('default')

const categoryNames = {
  leinen: 'Leinen & Geschirre',
  halsbaender: 'Halsbänder',
  bekleidung: 'Bekleidung',
  snacks: 'Snacks'
}

const categoryName = computed(() => {
  return props.category ? categoryNames[props.category] || props.category : ''
})

// GEFILTERTE PRODUKTE MIT SUCHFUNKTION
const filteredProducts = computed(() => {
  let filtered = [...allProducts.value]
  
  // 1. Kategorie-Filter (wenn keine Suche aktiv)
  if (props.category && !props.searchQuery && !props.initialSearch) {
    filtered = filtered.filter(product => {
      const productCategory = product.category?.toLowerCase()
      const propCategory = props.category.toLowerCase()
      return productCategory === propCategory
    })
  }
  
  // 2. SUCHFILTER (Priorität hat die explizite searchQuery Prop)
  const searchTerm = props.searchQuery || props.initialSearch
  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filtered = filtered.filter(product => {
      // Suche in Name, Beschreibung und Kategorie
      return (
        product.name?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
      )
    })
  }
  
  return filtered
})

// Sortierte Produkte
const sortedProducts = computed(() => {
  const sorted = [...filteredProducts.value]
  
  switch(sortBy.value) {
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id)
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price)
    default:
      return sorted
  }
})

// Alle Produkte laden
async function loadProducts() {
  loading.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product`)
    if (res.ok) {
      allProducts.value = await res.json()
      console.log('📦 Produkte geladen:', allProducts.value.length)
      
      const searchTerm = props.searchQuery || props.initialSearch
      if (searchTerm) {
        console.log('🔍 Suche nach:', searchTerm)
        console.log('✅ Gefunden:', filteredProducts.value.length, 'Produkte')
      }
    }
  } catch (err) {
    console.error('Fehler beim Laden:', err)
  } finally {
    loading.value = false
  }
}

function updateSort(filters) {
  sortBy.value = filters.sort || 'default'
}

function goToProduct(productId) {
  router.push(`/product/${productId}`)
}

function clearSearch() {
  // Zurück zur Kategorie oder Home
  if (props.category) {
    router.push(`/${props.category}`)
  } else {
    router.push('/')
  }
}

function searchExamples() {
  const examples = ['Leine', 'Halsband', 'Snack', 'Bekleidung', 'Spielzeug']
  const randomExample = examples[Math.floor(Math.random() * examples.length)]
  searchQuery.value = randomExample
  handleSearch()
}

onMounted(() => {
  loadProducts()
})

// Bei Änderungen neu laden
watch(() => props.category, loadProducts)
watch(() => props.searchQuery, loadProducts)
watch(() => props.initialSearch, loadProducts)
</script>

<style scoped>
.catalog {
  padding-top: 100px;
  min-height: 100vh;
  background: linear-gradient(135deg, #8b7355 0%, #a8916d 30%, #cbbf9b 100%);
}

.header {
  text-align: center;
  padding: 2rem 0 3rem;
  color: white;
}

.header h1 {
  font-size: 2.2rem;
  margin-bottom: 0.75rem;
  text-shadow: 2px 2px 6px rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.header h1 i {
  color: #e26191;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
}

.layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2.5rem;
}

.filter-sidebar {
  position: sticky;
  top: 140px;
  height: fit-content;
}

.products-area {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  min-height: 500px;
}

/* Such-Info in Sidebar */
.search-info {
  background: rgba(226, 97, 145, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  border: 1px solid rgba(226, 97, 145, 0.2);
}

.search-term {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  margin-bottom: 1rem;
}

.search-term i {
  color: #e26191;
  font-size: 1.2rem;
}

.clear-search {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.clear-search:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Loading */
.loading {
  text-align: center;
  padding: 4rem;
  color: white;
}

.loading .spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #e26191;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.75rem;
}

/* Empty State */
.empty {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.8);
}

.empty i {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.3);
}

.empty h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.empty p {
  max-width: 500px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.empty-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-clear, .btn-examples {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-clear {
  background: rgba(226, 97, 145, 0.8);
  color: white;
  border: none;
}

.btn-clear:hover {
  background: #e26191;
  transform: translateY(-2px);
}

.btn-examples {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-examples:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .filter-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .catalog {
    padding-top: 90px;
  }
  
  .header h1 {
    font-size: 1.8rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.25rem;
  }
  
  .empty-actions {
    flex-direction: column;
  }
  
  .btn-clear, .btn-examples {
    width: 100%;
    justify-content: center;
  }
}
</style>