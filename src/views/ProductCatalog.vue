<template>
  <div class="catalog">
    <!-- HUSKY HINTERGRUND -->
    <div class="background-overlay">
      <div class="background-image"></div>
    </div>
    
    <!-- Header -->
    <div class="header">
      <h1>
        <template v-if="searchTerm">
          <i class="bi bi-search"></i> Suchergebnisse für "{{ searchTerm }}"
        </template>
        <template v-else>{{ categoryName || 'Alle Produkte' }}</template>
      </h1>
      <p class="subtitle">
        {{ filteredProducts.length }} Produkt{{ filteredProducts.length !== 1 ? 'e' : '' }} gefunden
      </p>
      
      <!-- SUCHLEISTE NUR FÜR ADMINS IM BEARBEITUNGSMODUS -->
      <div v-if="isAdmin && editMode" class="search-bar-container">
        <div class="search-bar">
          <i class="bi bi-search"></i>
          <input
            v-model="localSearchQuery"
            type="text"
            placeholder="Produkte suchen..."
            @keyup.enter="performSearch"
            @input="handleSearchInput"
          />
          <button v-if="localSearchQuery" @click="clearSearch" class="clear-btn" title="Suche löschen">
            <i class="bi bi-x"></i>
          </button>
          <button @click="performSearch" class="search-btn" title="Suchen">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
      
      <!-- Admin-Bereich -->
      <div v-if="isAdmin" class="admin-area">
        <div class="admin-buttons">
          <button @click="toggleEditMode" class="btn-admin" :class="{ active: editMode }">
            <i class="bi" :class="editMode ? 'bi-check-lg' : 'bi-pencil'"></i>
            {{ editMode ? 'Bearbeiten beenden' : 'Produkte bearbeiten' }}
          </button>
        </div>
        
        <!-- Admin-Info nur wenn Edit-Modus aktiv -->
        <div v-if="editMode" class="admin-info">
          <div class="edit-mode-info">
            <i class="bi bi-exclamation-triangle"></i>
            <span>Klicken Sie auf die Buttons um Produkte zu bearbeiten oder zu löschen</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="layout">
      <!-- Filter-Sidebar -->
      <aside class="filter-sidebar">
        <ProductFilter @filterChange="updateSort" />
        
        <!-- Such-Info -->
        <div v-if="searchTerm" class="search-info">
          <div class="search-term">
            <i class="bi bi-search"></i>
            <strong>Aktuelle Suche:</strong>
            <span>"{{ searchTerm }}"</span>
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
          <div 
            v-for="product in sortedProducts" 
            :key="product.id" 
            class="product-wrapper"
          >
            <ProductCard
              :product="product"
              @click="goToProduct(product.id)"
            />
            
            <!-- Admin-Aktionen -->
            <div v-if="isAdmin && editMode" class="admin-actions">
              <router-link 
                :to="`/admin/products/edit/${product.id}`" 
                class="btn-action btn-edit"
                @click.stop
                title="Produkt bearbeiten"
              >
                <i class="bi bi-pencil-square"></i>
              </router-link>
              <button 
                @click.stop="openDeleteModal(product)"
                class="btn-action btn-delete"
                title="Produkt löschen"
              >
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="empty">
          <template v-if="searchTerm">
            <i class="bi bi-search"></i>
            <h3>Keine Ergebnisse für "{{ searchTerm }}"</h3>
            <p>Versuche einen anderen Suchbegriff.</p>
            <button @click="clearSearch" class="btn-clear">
              <i class="bi bi-arrow-left"></i>
              Zurück zur Übersicht
            </button>
          </template>
          <template v-else>
            <i class="bi bi-box"></i>
            <h3>Keine Produkte verfügbar</h3>
          </template>
        </div>
      </main>
    </div>
    
    <!-- Lösch-Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="bi bi-exclamation-triangle"></i> Produkt löschen</h3>
          <button @click="closeDeleteModal" class="modal-close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Sind Sie sicher, dass Sie das Produkt <strong>"{{ productToDelete?.title }}"</strong> löschen möchten?</p>
          <div class="modal-actions">
            <button @click="closeDeleteModal" class="btn-cancel">
              Abbrechen
            </button>
            <button @click="confirmDelete" class="btn-confirm-delete">
              <i class="bi bi-x-circle"></i> Löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import ProductCard from '@/components/ProductCard.vue'
import ProductFilter from '@/components/ProductFilter.vue'

const route = useRoute()
const router = useRouter()
const { getAccessTokenSilently, isAuthenticated } = useAuth0()

const props = defineProps({
  category: { type: String, default: '' }
})

// Refs
const localSearchQuery = ref('')
const allProducts = ref([])
const loading = ref(true)
const sortBy = ref('default')
const editMode = ref(false)
const showDeleteModal = ref(false)
const productToDelete = ref(null)
const userRole = ref('')

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

// Suchfunktion
function performSearch() {
  const query = localSearchQuery.value.trim()
  const queryParams = { ...route.query }
  
  if (query) {
    queryParams.q = query
  } else {
    delete queryParams.q
  }
  
  router.push({ path: route.path, query: queryParams })
}

// Suche bei Eingabe aktualisieren
let searchTimeout = null
function handleSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(performSearch, 500)
}

// Suche löschen
function clearSearch() {
  localSearchQuery.value = ''
  const { q, ...otherParams } = route.query
  router.push({ path: route.path, query: otherParams })
}

// Admin-Status prüfen
const fetchUserRole = async () => {
  if (!isAuthenticated.value) return
  
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`${API_BASE}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    if (response.ok) {
      const data = await response.json()
      userRole.value = data.role
    }
  } catch (err) {
    console.error('Fehler beim Laden der Rolle:', err)
  }
}

const isAdmin = computed(() => userRole.value === 'ADMIN')

// Kategorienamen
const categoryNames = {
  leinen: 'Leinen & Geschirre',
  halsband: 'Halsbänder',
  bekleidung: 'Bekleidung',
  snacks: 'Snacks'
}

const categoryName = computed(() => {
  return props.category ? categoryNames[props.category] || props.category : ''
})

// Suchbegriff aus URL
const searchTerm = computed(() => route.query.q || '')

// Gefilterte Produkte
const filteredProducts = computed(() => {
  let filtered = allProducts.value
  
  // Kategorie-Filter
  if (props.category) {
    filtered = filtered.filter(product => {
      if (!product.category) return false
      const productCategory = product.category.toLowerCase()
      const propCategory = props.category.toLowerCase()
      return productCategory.includes(propCategory)
    })
  }
  
  // Suchfilter
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(product => {
      return (
        product.title?.toLowerCase().includes(term) ||
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
    case 'newest': return sorted.sort((a, b) => b.id - a.id)
    case 'price-low': return sorted.sort((a, b) => a.price - b.price)
    case 'price-high': return sorted.sort((a, b) => b.price - a.price)
    default: return sorted
  }
})

// Produkte laden
async function loadProducts() {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/api/product`)
    if (res.ok) allProducts.value = await res.json()
  } catch (err) {
    console.error('Fehler beim Laden:', err)
  } finally {
    loading.value = false
  }
}

// Produkt löschen
async function deleteProduct(productId) {
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`${API_BASE}/api/product/${productId}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      allProducts.value = allProducts.value.filter(p => p.id !== productId)
    }
  } catch (err) {
    console.error('Fehler beim Löschen:', err)
  }
}

// Modal-Funktionen
function openDeleteModal(product) {
  productToDelete.value = product
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  productToDelete.value = null
}

async function confirmDelete() {
  if (productToDelete.value) {
    await deleteProduct(productToDelete.value.id)
    closeDeleteModal()
  }
}

// Navigation
function goToProduct(productId) {
  router.push(`/product/${productId}`)
}

function toggleEditMode() {
  editMode.value = !editMode.value
  if (!editMode.value) localSearchQuery.value = ''
}

function updateSort(filters) {
  sortBy.value = filters.sort || 'default'
}

// Lokale Suche mit URL synchronisieren
watch(() => route.query.q, (newQuery) => {
  localSearchQuery.value = newQuery || ''
})

onMounted(async () => {
  await fetchUserRole()
  loadProducts()
  if (route.query.q) localSearchQuery.value = route.query.q
})

watch(() => props.category, loadProducts)
</script>

<style scoped>
/* SUCHLEISTE */
.search-bar-container {
  max-width: 600px;
  margin: 1.5rem auto;
}

.search-bar {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.search-bar:focus-within {
  border-color: #e26191;
  box-shadow: 0 4px 25px rgba(226, 97, 145, 0.3);
}

.search-bar i.bi-search:first-child {
  color: #666;
  font-size: 1.2rem;
  margin-right: 0.75rem;
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.75rem 0;
  font-size: 1rem;
  background: transparent;
  color: #333;
}

.clear-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.clear-btn:hover {
  color: #e26191;
}

.search-btn {
  background: linear-gradient(90deg, #e26191, #d05583);
  border: none;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  cursor: pointer;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.search-btn:hover {
  background: linear-gradient(90deg, #d05583, #c04a77);
  transform: translateY(-2px);
}

/* Admin-Bereich */
.admin-area {
  max-width: 800px;
  margin: 1.5rem auto 0;
}

.admin-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-admin {
  padding: 0.75rem 1.5rem;
  background: rgba(40, 40, 40, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-admin:hover {
  background: rgba(60, 60, 60, 0.8);
  transform: translateY(-2px);
}

.btn-admin.active {
  background: rgba(226, 97, 145, 0.4);
  border-color: rgba(226, 97, 145, 0.6);
}

.admin-info {
  margin-top: 1.5rem;
}

.edit-mode-info {
  background: rgba(255, 193, 7, 0.15);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #ffc107;
}

/* Grundlayout */
.catalog {
  position: relative;
  min-height: 100vh;
  padding-top: 100px;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8));
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/src/assets/dog_pics/Girls-with-Husky.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  filter: blur(3px) brightness(0.6);
}

.header {
  text-align: center;
  padding: 2rem 0 3rem;
  color: white;
}

.header h1 {
  font-size: 2.2rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.95;
  margin-bottom: 1rem;
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
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  min-height: 500px;
}

.search-info {
  background: rgba(226, 97, 145, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  border: 1px solid rgba(226, 97, 145, 0.3);
}

.search-term {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  margin-bottom: 1rem;
}

.clear-search {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
}

.clear-search:hover {
  background: rgba(255, 255, 255, 0.2);
}

.loading {
  text-align: center;
  padding: 4rem;
  color: white;
}

.loading .spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #e26191;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.75rem;
}

.empty {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.9);
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
}

.btn-clear {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: rgba(226, 97, 145, 0.8);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-clear:hover {
  background: #e26191;
}

/* Product Wrapper */
.product-wrapper {
  position: relative;
  transition: transform 0.2s ease-in-out;
}

.product-wrapper:hover {
  transform: translateY(-5px);
}

/* Admin-Actions */
.admin-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  z-index: 100;
}

.btn-action {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.2rem;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  color: white !important;
}

.btn-edit {
  background-color: rgba(40, 167, 69, 0.8);
}

.btn-edit:hover {
  background-color: rgba(33, 136, 56, 0.9);
  transform: scale(1.1);
}

.btn-delete {
  background-color: rgba(220, 53, 69, 0.8);
}

.btn-delete:hover {
  background-color: rgba(200, 35, 51, 0.9);
  transform: scale(1.1);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  background: linear-gradient(90deg, #e26191, #d05583);
  color: white;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 2rem;
  color: rgba(255, 255, 255, 0.9);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-cancel, .btn-confirm-delete {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}

.btn-cancel {
  background: rgba(108, 117, 125, 0.8);
  color: white;
}

.btn-confirm-delete {
  background: linear-gradient(90deg, #dc3545, #c82333);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  
  .btn-action {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.5rem;
  }
  
  .layout {
    padding: 0 1rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>