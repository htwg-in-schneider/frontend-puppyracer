<template>
  <div class="catalog">
    <div class="background-overlay">
      <div class="background-image"></div>
    </div>
    
    <div class="header">
      <h1>
        <template v-if="searchTerm">
          <i class="bi bi-search"></i> Suchergebnisse für "{{ searchTerm }}"
        </template>
        <template v-else>{{ categoryName || 'Alle Produkte' }}</template>
      </h1>
      <p>{{ filteredProducts.length }} Produkte gefunden</p>
      
      <div v-if="isAdmin" class="admin-area">
        <button @click="toggleEditMode" class="btn-admin" :class="{ active: editMode }">
          <i :class="editMode ? 'bi bi-check-lg' : 'bi bi-pencil'"></i>
          {{ editMode ? 'Bearbeiten beenden' : 'Bearbeiten' }}
        </button>
      </div>
    </div>
    
    <div class="layout">
      <aside class="filter-sidebar">
        <ProductFilter @filterChange="updateSort" />
        
        <div v-if="searchTerm" class="search-info">
          <div class="search-term">
            <i class="bi bi-search"></i>
            <span>"{{ searchTerm }}"</span>
          </div>
          <button @click="clearSearch" class="clear-search">
            <i class="bi bi-x-circle"></i> Suche löschen
          </button>
        </div>
      </aside>
      
      <main class="products-area">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Produkte werden geladen...</p>
        </div>
        
        <div v-else-if="filteredProducts.length" class="products-grid" :class="{ 'edit-mode': editMode }"> <!-- HIER DIE ÄNDERUNG -->
          <div 
            v-for="product in sortedProducts" 
            :key="product.id" 
            class="product-wrapper"
          >
            <ProductCard
              :product="product"
              @click="goToProduct(product.id)"
            />
            
            <div v-if="isAdmin && editMode" class="admin-actions">
              <router-link 
                :to="`/admin/products/edit/${product.id}`" 
                class="btn-action btn-edit"
                @click.stop
              >
                <i class="bi bi-pencil-square"></i>
              </router-link>
              <button 
                @click.stop="openDeleteModal(product)"
                class="btn-action btn-delete"
              >
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="empty">
          <template v-if="searchTerm">
            <i class="bi bi-search"></i>
            <h3>Keine Ergebnisse für "{{ searchTerm }}"</h3>
            <button @click="clearSearch" class="btn-clear">
              <i class="bi bi-arrow-left"></i> Zurück
            </button>
          </template>
          <template v-else>
            <i class="bi bi-box"></i>
            <h3>Keine Produkte verfügbar</h3>
          </template>
        </div>
      </main>
    </div>
    
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
            <button @click="closeDeleteModal" class="btn-cancel">Abbrechen</button>
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

const allProducts = ref([])
const loading = ref(true)
const sortBy = ref('default')
const editMode = ref(false)
const showDeleteModal = ref(false)
const productToDelete = ref(null)
const userRole = ref('')

const categoryNames = {
  leinen: 'Leinen & Geschirre',
  halsband: 'Halsbänder',
  bekleidung: 'Bekleidung',
  snacks: 'Snacks'
}

const categoryName = computed(() => {
  return props.category ? categoryNames[props.category] || props.category : ''
})

const searchTerm = computed(() => route.query.q || '')

const filteredProducts = computed(() => {
  let filtered = allProducts.value
  
  if (props.category) {
    filtered = filtered.filter(product => {
      if (!product.category) return false
      return product.category.toLowerCase().includes(props.category.toLowerCase())
    })
  }
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(product => {
      return (
        product.title?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
      )
    })
  }
  
  return filtered
})

const sortedProducts = computed(() => {
  const sorted = [...filteredProducts.value]
  
  switch(sortBy.value) {
    case 'newest': return sorted.sort((a, b) => b.id - a.id)
    case 'price-low': return sorted.sort((a, b) => a.price - b.price)
    case 'price-high': return sorted.sort((a, b) => b.price - a.price)
    default: return sorted
  }
})

const isAdmin = computed(() => userRole.value === 'ADMIN')

async function fetchUserRole() {
  if (!isAuthenticated.value) return
  
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
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

async function loadProducts() {
  loading.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product`)
    if (res.ok) allProducts.value = await res.json()
  } catch (err) {
    console.error('Fehler beim Laden:', err)
  } finally {
    loading.value = false
  }
}

async function deleteProduct(productId) {
  try {
    const token = await getAccessTokenSilently()
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product/${productId}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    allProducts.value = allProducts.value.filter(p => p.id !== productId)
  } catch (err) {
    console.error('Fehler beim Löschen:', err)
  }
}

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

function goToProduct(productId) {
  router.push(`/product/${productId}`)
}

function toggleEditMode() {
  editMode.value = !editMode.value
}

function clearSearch() {
  const { q, ...otherParams } = route.query
  router.push({ path: route.path, query: otherParams })
}

function updateSort(filters) {
  sortBy.value = filters.sort || 'default'
}

onMounted(async () => {
  await fetchUserRole()
  loadProducts()
})

watch(() => props.category, loadProducts)
</script>

<style scoped>
.catalog {
  position: relative;
  min-height: 100vh;
  padding-top: 80px;
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
  padding: 2rem 0;
  color: white;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.admin-area {
  margin-top: 1rem;
}

.btn-admin {
  padding: 0.5rem 1rem;
  background: rgba(40, 40, 40, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.btn-admin.active {
  background: rgba(226, 97, 145, 0.4);
  border-color: rgba(226, 97, 145, 0.6);
}

.layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.filter-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.products-area {
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  min-height: 500px;
}

.search-info {
  background: rgba(226, 97, 145, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  border: 1px solid rgba(226, 97, 145, 0.3);
}

.search-term {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  margin-bottom: 0.5rem;
}

.clear-search {
  width: 100%;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
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
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.empty {
  text-align: center;
  padding: 3rem 2rem;
  color: rgba(255, 255, 255, 0.9);
}

.empty i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.3);
}

.empty h3 {
  color: white;
  margin-bottom: 1rem;
}

.btn-clear {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(226, 97, 145, 0.8);
  color: white;
  border: none;
  cursor: pointer;
}

/* WICHTIG: Diese CSS-Regeln müssen bleiben für die Admin-Buttons! */
.admin-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  z-index: 100;
}

/* Diese Regel macht die Buttons sichtbar! */
.edit-mode .admin-actions {
  opacity: 1 !important;
  pointer-events: auto !important;
}

.btn-action {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  color: white !important;
}

.btn-edit {
  background-color: rgba(40, 167, 69, 0.8);
}

.btn-delete {
  background-color: rgba(220, 53, 69, 0.8);
}

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
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  background: linear-gradient(90deg, #e26191, #d05583);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-cancel, .btn-confirm-delete {
  padding: 0.5rem 1rem;
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
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .filter-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .catalog {
    padding-top: 70px;
  }
  
  .layout {
    padding: 0 1rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>