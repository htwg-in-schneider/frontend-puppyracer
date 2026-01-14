<template>
  <div class="order-history">
    <div class="container">
      <div class="header">
        <router-link to="/" class="back-btn">
          <i class="bi bi-arrow-left"></i> Zurück
        </router-link>
        <h1>
          <i :class="isAdmin ? 'bi bi-shield-check' : 'bi bi-receipt'"></i>
          {{ isAdmin ? 'Bestellverwaltung' : 'Meine Bestellungen' }}
        </h1>
      </div>

      <div v-if="isAdmin" class="admin-filters">
        <div class="search">
          <i class="bi bi-search"></i>
          <input v-model="searchQuery" placeholder="Suche..." />
        </div>
        <select v-model="statusFilter">
          <option value="">Alle Status</option>
          <option value="PENDING">Ausstehend</option>
          <option value="PAID">Bezahlt</option>
          <option value="SHIPPED">Versendet</option>
          <option value="DELIVERED">Geliefert</option>
        </select>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>{{ isAdmin ? 'Lade Bestellungen...' : 'Lade Ihre Bestellungen...' }}</p>
      </div>

      <div v-else-if="error" class="error">
        <i class="bi bi-exclamation-triangle"></i>
        <h3>Fehler</h3>
        <p>{{ error }}</p>
        <button @click="loadOrders" class="btn-primary">
          <i class="bi bi-arrow-clockwise"></i> Erneut versuchen
        </button>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="no-orders">
        <i class="bi bi-inbox"></i>
        <h3>{{ isAdmin ? 'Keine Bestellungen' : 'Noch keine Bestellungen' }}</h3>
        <router-link to="/" class="btn-primary">
          <i class="bi bi-shop"></i> Zum Shop
        </router-link>
      </div>

      <div v-else class="orders">
        <div v-if="isAdmin" class="stats">
          <div class="stat">
            <span class="number">{{ orders.length }}</span>
            <span class="label">Gesamt</span>
          </div>
          <div class="stat">
            <span class="number">{{ totalRevenue }} €</span>
            <span class="label">Umsatz</span>
          </div>
        </div>

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

            <div v-if="isAdmin && order.user" class="customer">
              <span>{{ order.user.name }}</span>
              <span class="email">{{ order.user.email }}</span>
            </div>

            <div class="items">
              <div v-for="item in order.items.slice(0, 2)" :key="item.id" class="item">
                <img :src="getImageUrl(item.productImage)" :alt="item.productName" />
                <div class="item-details">
                  <span>{{ item.productName }}</span>
                  <span>{{ item.quantity }} × {{ formatCurrency(item.price) }}</span>
                </div>
              </div>
              <div v-if="order.items.length > 2" class="more-items">
                + {{ order.items.length - 2 }} weitere
              </div>
            </div>

            <div class="actions">
              <button @click="viewOrder(order)" class="btn-view">
                <i class="bi bi-eye"></i> Details
              </button>
              <button 
                v-if="isAdmin && order.status === 'PAID'" 
                @click="updateOrderStatus(order, 'SHIPPED')"
                class="btn-ship"
              >
                <i class="bi bi-truck"></i> Versendet
              </button>
              <button 
                v-if="isAdmin && order.status === 'SHIPPED'" 
                @click="updateOrderStatus(order, 'DELIVERED')"
                class="btn-deliver"
              >
                <i class="bi bi-check-circle"></i> Geliefert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const router = useRouter()
const { getAccessTokenSilently, isAuthenticated } = useAuth0()

const orders = ref([])
const loading = ref(true)
const error = ref('')
const isAdmin = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')

const filteredOrders = computed(() => {
  let filtered = orders.value
  
  if (statusFilter.value) {
    filtered = filtered.filter(o => o.status === statusFilter.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(o => 
      o.orderNumber.toLowerCase().includes(query) ||
      (o.user && o.user.name.toLowerCase().includes(query))
    )
  }
  
  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const totalRevenue = computed(() => {
  return orders.value
    .filter(o => o.status === 'PAID' || o.status === 'SHIPPED' || o.status === 'DELIVERED')
    .reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0)
    .toFixed(2)
})

const getImageUrl = (imageName) => {
  if (!imageName) return '/src/assets/placeholder.jpg'
  return `/src/assets/product_pics/${imageName}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('de-DE')
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
    
    // Admin-Status prüfen
    const profileRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!profileRes.ok) {
      throw new Error(`Profil konnte nicht geladen werden`)
    }
    
    const userData = await profileRes.json()
    isAdmin.value = userData.role === 'ADMIN'
    
    // Bestellungen laden
    const endpoint = isAdmin.value ? '/api/orders/admin' : '/api/orders/my-orders'
    
    const ordersRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!ordersRes.ok) {
      if (ordersRes.status === 403) {
        error.value = 'Zugriff verweigert'
        orders.value = []
      } else {
        throw new Error(`Fehler ${ordersRes.status}`)
      }
    } else {
      const ordersData = await ordersRes.json()
      orders.value = ordersData
    }
    
  } catch (err) {
    error.value = `Fehler: ${err.message}`
    orders.value = []
  } finally {
    loading.value = false
  }
}

const viewOrder = (order) => {
  router.push(`/order-confirmation/${order.orderNumber}`)
}

const updateOrderStatus = async (order, newStatus) => {
  if (!confirm(`Bestellung #${order.orderNumber} wirklich auf "${getStatusText(newStatus)}" setzen?`)) return
  
  try {
    const token = await getAccessTokenSilently()
    
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${order.id}/status`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })
    
    order.status = newStatus
    
  } catch (err) {
    alert(`Fehler: ${err.message}`)
  }
}

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
}

.header h1 {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 0;
}

.admin-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search {
  flex: 1;
  position: relative;
}

.search i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search input, select {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  background: rgba(255,255,255,0.08);
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
}

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

.error i { color: #ff4757; }
.no-orders i { color: #bb9580; }

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
  text-decoration: none;
}

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
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 1.5rem;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.order-number {
  font-size: 1.3rem;
  font-weight: 700;
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

.status.pending { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
.status.paid { background: rgba(0, 123, 255, 0.2); color: #007bff; }
.status.shipped { background: rgba(40, 167, 69, 0.2); color: #28a745; }
.status.delivered { background: rgba(111, 66, 193, 0.2); color: #6f42c1; }

.total {
  font-size: 1.3rem;
  font-weight: 700;
  color: #e26191;
}

.customer {
  background: rgba(255,255,255,0.03);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
}

.customer .email {
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
}

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
  width: 50px;
  height: 50px;
  border-radius: 6px;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-details span:last-child {
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
}

.more-items {
  text-align: center;
  color: rgba(255,255,255,0.5);
  font-size: 0.85rem;
  padding: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
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
}

.btn-view {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.btn-ship {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

.btn-deliver {
  background: rgba(111, 66, 193, 0.2);
  color: #6f42c1;
}

@media (max-width: 768px) {
  .admin-filters { flex-direction: column; }
  .stats { flex-direction: column; }
  .order-header { flex-direction: column; gap: 1rem; }
  .order-right { width: 100%; display: flex; justify-content: space-between; }
}
</style>