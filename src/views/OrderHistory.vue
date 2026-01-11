<template>
  <div class="order-history">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <router-link to="/" class="back-btn">
          <i class="bi bi-arrow-left"></i> Zurück
        </router-link>
        <h1>
          <i class="bi" :class="isAdmin ? 'bi-shield-check' : 'bi-receipt'"></i>
          {{ isAdmin ? 'Bestellverwaltung' : 'Meine Bestellungen' }}
        </h1>
      </div>

      <!-- Admin Filter -->
      <div v-if="isAdmin" class="admin-filters">
        <div class="search">
          <i class="bi bi-search"></i>
          <input v-model="searchQuery" placeholder="Suche..." :disabled="loading" />
        </div>
        <select v-model="statusFilter" :disabled="loading">
          <option value="">Alle Status</option>
          <option value="PENDING">Ausstehend</option>
          <option value="PAID">Bezahlt</option>
          <option value="SHIPPED">Versendet</option>
          <option value="DELIVERED">Geliefert</option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>{{ isAdmin ? 'Lade Bestellungen...' : 'Lade Ihre Bestellungen...' }}</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error">
        <i class="bi bi-exclamation-triangle"></i>
        <h3>Fehler</h3>
        <p>{{ error }}</p>
        <button @click="loadOrders" class="btn-primary">
          <i class="bi bi-arrow-clockwise"></i> Erneut versuchen
        </button>
      </div>

      <!-- No Orders -->
      <div v-else-if="filteredOrders.length === 0" class="no-orders">
        <i class="bi bi-inbox"></i>
        <h3>{{ isAdmin ? 'Keine Bestellungen' : 'Noch keine Bestellungen' }}</h3>
        <router-link to="/" class="btn-primary">
          <i class="bi bi-shop"></i> Zum Shop
        </router-link>
      </div>

      <!-- Orders -->
      <div v-else class="orders">
        <!-- Admin Stats -->
        <div v-if="isAdmin" class="stats">
          <div class="stat">
            <span class="number">{{ orders.length }}</span>
            <span class="label">Gesamt</span>
          </div>
          <div class="stat">
            <span class="number">{{ totalRevenue }} €</span>
            <span class="label">Umsatz</span>
          </div>
          <div class="stat">
            <span class="number">{{ pendingOrders }}</span>
            <span class="label">Ausstehend</span>
          </div>
        </div>

        <!-- Orders List -->
        <div class="order-list">
          <div v-for="order in filteredOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <div>
                <div class="order-number">#{{ order.orderNumber }}</div>
                <div class="order-date">{{ formatDate(order.createdAt) }}</div>
              </div>
              <div class="order-right">
                <div class="status" :class="order.status.toLowerCase()">
                  {{ getStatusText(order.status) }}
                </div>
                <div class="total">{{ formatCurrency(order.totalAmount) }}</div>
              </div>
            </div>

            <!-- Customer (Admin) -->
            <div v-if="isAdmin && order.user" class="customer">
              <span>{{ order.user.name }}</span>
              <span class="email">{{ order.user.email }}</span>
            </div>

            <!-- Items -->
            <div class="items">
              <div v-for="item in order.items.slice(0, 3)" :key="item.id" class="item">
                <img :src="getImageUrl(item.productImage)" :alt="item.productName" />
                <div class="item-details">
                  <span>{{ item.productName }}</span>
                  <span>{{ item.quantity }} × {{ formatCurrency(item.price) }}</span>
                </div>
                <span class="item-total">{{ formatCurrency(item.price * item.quantity) }}</span>
              </div>
              <div v-if="order.items.length > 3" class="more-items">
                + {{ order.items.length - 3 }} weitere Artikel
              </div>
            </div>

            <!-- Order Info -->
            <div class="order-info">
              <div class="info-row">
                <span>Zwischensumme:</span>
                <span>{{ formatCurrency(order.subtotal) }}</span>
              </div>
              <div class="info-row">
                <span>Versand:</span>
                <span>{{ formatCurrency(order.shippingCost) }}</span>
              </div>
              <div class="info-row total">
                <span>Gesamt:</span>
                <span>{{ formatCurrency(order.totalAmount) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="actions">
              <button @click="viewOrder(order)" class="btn-view">
                <i class="bi bi-eye"></i> Details
              </button>
              <button 
                v-if="isAdmin && order.status === 'PAID'" 
                @click="updateOrderStatus(order, 'SHIPPED')"
                class="btn-ship"
                :disabled="updatingStatus === order.id"
              >
                <i class="bi bi-truck"></i> 
                {{ updatingStatus === order.id ? 'Aktualisiere...' : 'Als versendet markieren' }}
              </button>
              <button 
                v-if="isAdmin && order.status === 'SHIPPED'" 
                @click="updateOrderStatus(order, 'DELIVERED')"
                class="btn-deliver"
                :disabled="updatingStatus === order.id"
              >
                <i class="bi bi-check-circle"></i>
                {{ updatingStatus === order.id ? 'Aktualisiere...' : 'Als geliefert markieren' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const router = useRouter()
const { getAccessTokenSilently, isAuthenticated } = useAuth0()

// State
const orders = ref([])
const loading = ref(true)
const error = ref('')
const isAdmin = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const updatingStatus = ref(null)

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

// Helper: Bild-URL konstruieren
const getImageUrl = (imageName) => {
  if (!imageName) return '/src/assets/placeholder.jpg'
  return `/src/assets/product_pics/${imageName}`
}

// Filtered orders
const filteredOrders = computed(() => {
  let filtered = orders.value
  
  if (statusFilter.value) {
    filtered = filtered.filter(o => o.status === statusFilter.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(o => 
      o.orderNumber.toLowerCase().includes(query) ||
      (o.user && o.user.name.toLowerCase().includes(query)) ||
      (o.user && o.user.email.toLowerCase().includes(query))
    )
  }
  
  // Neueste zuerst sortieren
  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Stats
const totalRevenue = computed(() => {
  return orders.value
    .filter(o => o.status === 'PAID' || o.status === 'SHIPPED' || o.status === 'DELIVERED')
    .reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0)
    .toFixed(2)
})

const pendingOrders = computed(() => {
  return orders.value.filter(o => o.status === 'PENDING').length
})

// Format helpers
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const formatCurrency = (amount) => {
  return `${(parseFloat(amount) || 0).toFixed(2)}€`
}

const getStatusText = (status) => {
  const map = {
    'PENDING': 'Ausstehend',
    'PAID': 'Bezahlt',
    'SHIPPED': 'Versendet',
    'DELIVERED': 'Geliefert',
    'CANCELLED': 'Storniert'
  }
  return map[status] || status
}

// Load orders from backend - KORRIGIERT nach PDFs
const loadOrders = async () => {
  if (!isAuthenticated.value) {
    error.value = 'Bitte zuerst anmelden'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    const token = await getAccessTokenSilently()
    
    // 1. Zuerst Profil laden um Admin-Status zu prüfen (PDF Seite 41)
    const profileRes = await fetch(`${API_BASE}/api/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    if (!profileRes.ok) {
      throw new Error(`Profil konnte nicht geladen werden: ${profileRes.status}`)
    }
    
    const userData = await profileRes.json()
    isAdmin.value = userData.role === 'ADMIN'
    console.log('User role from backend:', userData.role, 'Is admin:', isAdmin.value)
    
    // 2. Bestellungen laden
    const endpoint = isAdmin.value ? '/api/orders/admin' : '/api/orders/my-orders'
    console.log('Loading from endpoint:', endpoint)
    
    const ordersRes = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    console.log('Orders response status:', ordersRes.status)
    
    if (!ordersRes.ok) {
      if (ordersRes.status === 403) {
        error.value = 'Zugriff verweigert. Nur Administratoren können alle Bestellungen sehen.'
        orders.value = []
      } else if (ordersRes.status === 404) {
        orders.value = [] // Keine Bestellungen gefunden
      } else {
        throw new Error(`Fehler ${ordersRes.status}: ${ordersRes.statusText}`)
      }
    } else {
      const ordersData = await ordersRes.json()
      console.log('Orders loaded:', ordersData.length)
      orders.value = ordersData
    }
    
  } catch (err) {
    console.error('Fehler beim Laden der Bestellungen:', err)
    error.value = `Fehler: ${err.message}`
    orders.value = []
  } finally {
    loading.value = false
  }
}

// View order details
const viewOrder = (order) => {
  router.push(`/order-confirmation/${order.orderNumber}`)
}

// Update order status (Admin only) - KORRIGIERT nach PDFs
const updateOrderStatus = async (order, newStatus) => {
  if (!confirm(`Bestellung #${order.orderNumber} wirklich auf "${getStatusText(newStatus)}" setzen?`)) return
  
  updatingStatus.value = order.id
  try {
    const token = await getAccessTokenSilently()
    
    const response = await fetch(`${API_BASE}/api/orders/${order.id}/status`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })
    
    if (!response.ok) {
      throw new Error(`Status konnte nicht aktualisiert werden: ${response.status}`)
    }
    
    // Status lokal aktualisieren
    order.status = newStatus
    
  } catch (err) {
    alert(`Fehler: ${err.message}`)
  } finally {
    updatingStatus.value = null
  }
}

// Watch filters
watch([searchQuery, statusFilter], () => {
  // Filter wird über computed properties angewendet
})

// Watch authentication status
watch(isAuthenticated, (newVal) => {
  if (newVal) {
    loadOrders()
  }
})

// Init
onMounted(() => {
  if (isAuthenticated.value) {
    loadOrders()
  } else {
    loading.value = false
    error.value = 'Bitte zuerst anmelden'
  }
})
</script>

<style scoped>
.order-history {
  min-height: 100vh;
  background: #1a1a1a;
  padding: 80px 20px 40px;
  color: #fff;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

/* Header */
.header {
  margin-bottom: 2rem;
  text-align: center;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #e26191;
  text-decoration: none;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.back-btn:hover {
  color: #ff8fab;
}

.header h1 {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 0;
}

/* Admin Filters */
.admin-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  background: rgba(255,255,255,0.08);
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
}

.search input:focus {
  outline: none;
  border-color: #e26191;
}

select {
  padding: 0.875rem 1rem;
  background: rgba(255,255,255,0.08);
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: #fff;
  min-width: 180px;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: #e26191;
}

/* Loading, Error, No Orders */
.loading, .error, .no-orders {
  text-align: center;
  padding: 3rem;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255,255,255,0.2);
  border-top: 3px solid #e26191;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error i, .no-orders i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.error i {
  color: #ff4757;
}

.no-orders i {
  color: #bb9580;
  opacity: 0.5;
}

.error h3, .no-orders h3 {
  margin: 0 0 0.5rem 0;
  color: #fff;
}

.error p {
  color: rgba(255,255,255,0.7);
  margin-bottom: 1.5rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #e26191;
  color: white;
  border: none;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
  text-decoration: none;
}

.btn-primary:hover {
  background: #d05583;
  transform: translateY(-2px);
}

/* Stats */
.stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat {
  flex: 1;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.1);
}

.stat .number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #e26191;
  margin-bottom: 0.5rem;
}

.stat .label {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Order List */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s;
}

.order-card:hover {
  border-color: #e26191;
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.order-number {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.25rem;
}

.order-date {
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
}

.order-right {
  text-align: right;
}

.status {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.status.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.status.paid {
  background: rgba(0, 123, 255, 0.2);
  color: #007bff;
}

.status.shipped {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

.status.delivered {
  background: rgba(111, 66, 193, 0.2);
  color: #6f42c1;
}

.status.cancelled {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

.total {
  font-size: 1.3rem;
  font-weight: 700;
  color: #e26191;
}

/* Customer */
.customer {
  background: rgba(255,255,255,0.03);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.customer .email {
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
}

/* Items */
.items {
  margin-bottom: 1rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.item img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(255,255,255,0.1);
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-details span:first-child {
  color: #fff;
  font-weight: 500;
}

.item-details span:last-child {
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
}

.item-total {
  font-weight: 600;
  color: #e26191;
  min-width: 80px;
  text-align: right;
}

.more-items {
  text-align: center;
  color: rgba(255,255,255,0.5);
  font-size: 0.85rem;
  padding: 0.5rem;
}

/* Order Info */
.order-info {
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  color: rgba(255,255,255,0.8);
}

.info-row.total {
  border-top: 1px solid rgba(255,255,255,0.1);
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  font-weight: 600;
  color: #fff;
}

/* Actions */
.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-view, .btn-ship, .btn-deliver {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-view {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
}

.btn-view:hover {
  background: rgba(255,255,255,0.2);
}

.btn-ship {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.btn-ship:hover:not(:disabled) {
  background: rgba(40, 167, 69, 0.3);
}

.btn-deliver {
  background: rgba(111, 66, 193, 0.2);
  color: #6f42c1;
  border: 1px solid rgba(111, 66, 193, 0.3);
}

.btn-deliver:hover:not(:disabled) {
  background: rgba(111, 66, 193, 0.3);
}

.btn-ship:disabled, .btn-deliver:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
  }
  
  .order-right {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .customer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .admin-filters {
    flex-direction: column;
  }
  
  .search {
    min-width: 100%;
  }
  
  select {
    min-width: 100%;
  }
  
  .stats {
    flex-direction: column;
  }
  
  .item {
    flex-wrap: wrap;
  }
  
  .item-total {
    text-align: left;
    margin-left: 70px;
  }
}
</style>