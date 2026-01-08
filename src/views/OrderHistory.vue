<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'

const { getAccessTokenSilently, loginWithRedirect, isAuthenticated } = useAuth0()
const router = useRouter()

const orders = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const statusFilter = ref('')
const userRole = ref('') // Rolle aus Backend

// Admin-Erkennung NUR aus Backend (PDF Seite 41)
const isAdmin = computed(() => userRole.value === 'ADMIN')

// API-URL je nach Rolle
const apiUrl = computed(() => {
  return isAdmin.value 
    ? 'http://localhost:8081/api/orders/admin' 
    : 'http://localhost:8081/api/orders/my-orders'
})

// Rolle vom Backend holen (PDF Seite 41)
const fetchUserRole = async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch('http://localhost:8081/api/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    if (response.ok) {
      const data = await response.json()
      userRole.value = data.role // "ADMIN", "SELLER", "BUYER"
      console.log('📊 User Rolle vom Backend:', userRole.value)
    } else {
      console.error('Fehler beim Holen der Rolle:', response.status)
    }
  } catch (err) {
    console.error('❌ Error fetching user role:', err)
  }
}

// Bestellungen laden
const loadOrders = async () => {
  if (!isAuthenticated.value) {
    error.value = 'Bitte anmelden'
    loading.value = false
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 1. ZUERST Rolle holen
    await fetchUserRole()
    
    // 2. DANN Bestellungen laden
    const token = await getAccessTokenSilently()
    console.log('📤 Lade Bestellungen von:', apiUrl.value)
    
    const response = await fetch(apiUrl.value, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('📥 Response Status:', response.status)
    
    if (response.status === 403) {
      error.value = 'Zugriff verweigert. Nur Administratoren können alle Bestellungen einsehen.'
    } else if (response.status === 401) {
      error.value = 'Bitte melden Sie sich an, um Ihre Bestellungen zu sehen.'
    } else if (!response.ok) {
      throw new Error(`Server-Fehler: ${response.status}`)
    } else {
      const data = await response.json()
      // Preise formatieren (max. 2 Nachkommastellen)
      orders.value = data.map(order => ({
        ...order,
        totalAmount: parseFloat(order.totalAmount).toFixed(2),
        shippingCost: order.shippingCost ? parseFloat(order.shippingCost).toFixed(2) : '0.00',
        items: order.items.map(item => ({
          ...item,
          price: parseFloat(item.price).toFixed(2),
          subtotal: (parseFloat(item.price) * item.quantity).toFixed(2)
        }))
      }))
      console.log('✅ Bestellungen geladen:', orders.value.length)
    }
  } catch (err) {
    console.error('❌ Fehler in loadOrders:', err)
    error.value = `Fehler beim Laden: ${err.message}`
  } finally {
    loading.value = false
  }
}

// Status aktualisieren (Admin)
const updateOrderStatus = async (order) => {
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`http://localhost:8081/api/orders/admin/${order.id}/status`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order.status)
    })
    
    if (!response.ok) {
      alert('Status konnte nicht aktualisiert werden')
      await loadOrders() // Neu laden
    }
  } catch (err) {
    alert('Netzwerkfehler beim Status-Update')
  }
}

// Als versendet markieren
const markAsShipped = async (order) => {
  if (confirm(`Bestellung #${order.orderNumber} als versendet markieren?`)) {
    order.status = 'SHIPPED'
    await updateOrderStatus(order)
  }
}

// Bestelldetails anzeigen
const viewOrderDetails = (order) => {
  router.push(`/order-details/${order.orderNumber}`)
}

const viewOrder = (orderNumber) => {
  router.push(`/order-confirmation/${orderNumber}`)
}

// Formatierung
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Status-Text für User
const getStatusText = (status) => {
  const statusMap = {
    'PENDING': 'Ausstehend',
    'PAID': 'Bezahlt',
    'SHIPPED': 'Versendet',
    'DELIVERED': 'Geliefert'
  }
  return statusMap[status] || status
}

// Umsatz berechnen (mit Formatierung)
const totalRevenue = computed(() => {
  return orders.value.reduce((sum, order) => {
    const amount = parseFloat(order.totalAmount) || 0
    return sum + amount
  }, 0).toFixed(2)
})

// Gefilterte Bestellungen
const filteredOrders = computed(() => {
  let filtered = orders.value
  
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => 
      order.orderNumber.toLowerCase().includes(query) ||
      order.firstName?.toLowerCase().includes(query) ||
      order.lastName?.toLowerCase().includes(query) ||
      order.email?.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

// Login
const login = () => {
  loginWithRedirect()
}

// Initial laden
onMounted(async () => {
  await loadOrders()
})
</script>

<template>
  <div class="orders-history">
    <!-- Header mit Admin-Erkennung -->
    <div class="page-header">
      <div class="header-content">
        <h1>
          <i class="bi" :class="isAdmin ? 'bi-shield-check' : 'bi-receipt'"></i>
          {{ isAdmin ? 'Bestellverwaltung' : 'Meine Bestellungen' }}
        </h1>
        <p class="subtitle">
          {{ isAdmin ? 'Verwalten Sie alle Kundenbestellungen' : 'Ihre Bestellhistorie' }}
        </p>
      </div>
      
      <!-- Admin-Filter nur für Admins -->
      <div v-if="isAdmin" class="admin-controls">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input 
            v-model="searchQuery" 
            placeholder="Bestellnummer, Name oder E-Mail..." 
          />
        </div>
        <select v-model="statusFilter" class="status-filter">
          <option value="">Alle Status</option>
          <option value="PENDING">Ausstehend</option>
          <option value="PAID">Bezahlt</option>
          <option value="SHIPPED">Versendet</option>
          <option value="DELIVERED">Geliefert</option>
        </select>
        <button @click="loadOrders" class="btn-refresh" :disabled="loading">
          <i class="bi" :class="loading ? 'bi-arrow-clockwise spin' : 'bi-arrow-clockwise'"></i>
        </button>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>{{ isAdmin ? 'Lade alle Bestellungen...' : 'Lade Ihre Bestellungen...' }}</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <i class="bi bi-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button v-if="error.includes('anmelden')" @click="login" class="btn-primary">
        Jetzt anmelden
      </button>
    </div>
    
    <!-- No Orders -->
    <div v-else-if="filteredOrders.length === 0" class="no-orders">
      <i class="bi bi-inbox"></i>
      <p v-if="searchQuery || statusFilter">Keine Bestellungen mit den aktuellen Filtern</p>
      <p v-else>{{ isAdmin ? 'Noch keine Bestellungen im System' : 'Noch keine Bestellungen vorhanden.' }}</p>
      <router-link to="/" class="btn-primary">
        <i class="bi bi-shop"></i> Zum Shop
      </router-link>
    </div>
    
    <!-- Content -->
    <div v-else>
      <!-- Admin Stats -->
      <div v-if="isAdmin" class="admin-stats">
        <div class="stat-card">
          <div class="stat-value">{{ orders.length }}</div>
          <div class="stat-label">Bestellungen</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ orders.filter(o => o.status === 'PENDING').length }}</div>
          <div class="stat-label">Ausstehend</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalRevenue }}€</div>
          <div class="stat-label">Umsatz</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ filteredOrders.length }}</div>
          <div class="stat-label">Gefiltert</div>
        </div>
      </div>
      
      <!-- Order Cards -->
      <div class="orders-list">
        <div v-for="order in filteredOrders" :key="order.id" class="order-card">
          <!-- Order Header -->
          <div class="order-header">
            <div class="order-info">
              <div class="order-id">
                <span class="order-label">Bestellung</span>
                <h3>#{{ order.orderNumber }}</h3>
              </div>
              <div class="order-date-time">
                <i class="bi bi-calendar"></i>
                <span>{{ formatDate(order.orderDate) }}</span>
              </div>
            </div>
            
            <div class="order-status-price">
              <div class="status-container">
                <!-- Admin kann Status ändern -->
                <select 
                  v-if="isAdmin" 
                  v-model="order.status" 
                  @change="updateOrderStatus(order)"
                  :class="'status-select status-' + order.status.toLowerCase()"
                >
                  <option value="PENDING">Ausstehend</option>
                  <option value="PAID">Bezahlt</option>
                  <option value="SHIPPED">Versendet</option>
                  <option value="DELIVERED">Geliefert</option>
                </select>
                <!-- User sieht nur Status -->
                <div v-else class="order-status" :class="order.status.toLowerCase()">
                  {{ getStatusText(order.status) }}
                </div>
              </div>
              
              <div class="order-price">
                <span class="price-label">Gesamt</span>
                <span class="price-amount">{{ order.totalAmount }}€</span>
              </div>
            </div>
          </div>
          
          <!-- Kundeninfo nur für Admin -->
          <div v-if="isAdmin" class="customer-info">
            <div class="customer-detail">
              <i class="bi bi-person"></i>
              <span>{{ order.firstName }} {{ order.lastName }}</span>
            </div>
            <div class="customer-detail">
              <i class="bi bi-envelope"></i>
              <span>{{ order.email }}</span>
            </div>
            <div class="customer-detail" v-if="order.phone">
              <i class="bi bi-telephone"></i>
              <span>{{ order.phone }}</span>
            </div>
            <div class="customer-detail">
              <i class="bi bi-geo-alt"></i>
              <span>{{ order.street }}, {{ order.zipCode }} {{ order.city }}</span>
            </div>
          </div>
          
          <!-- Order Items -->
          <div class="order-items">
            <div class="items-header">
              <h4>Artikel ({{ order.items.length }})</h4>
            </div>
            <div class="items-list">
              <div v-for="item in order.items" :key="item.id" class="order-item">
                <div class="item-details">
                  <span class="item-name">{{ item.productName }}</span>
                  <span class="item-meta">
                    <span class="item-price">{{ item.price }}€</span>
                    <span class="item-quantity">× {{ item.quantity }}</span>
                  </span>
                </div>
                <div class="item-subtotal">
                  {{ (parseFloat(item.price) * item.quantity).toFixed(2) }}€
                </div>
              </div>
            </div>
          </div>
          
          <!-- Order Footer -->
          <div class="order-footer">
            <div class="footer-details">
              <div class="footer-detail">
                <i class="bi bi-credit-card"></i>
                <span>{{ order.paymentMethod || 'Kreditkarte' }}</span>
              </div>
              <div class="footer-detail">
                <i class="bi bi-truck"></i>
                <span>{{ order.shippingCost !== '0.00' ? `Versand: ${order.shippingCost}€` : 'Kostenloser Versand' }}</span>
              </div>
            </div>
            
            <div class="footer-actions">
              <button @click="viewOrder(order.orderNumber)" class="btn-secondary">
                <i class="bi bi-eye"></i> Details
              </button>
              <button 
                v-if="isAdmin && order.status === 'PAID'" 
                @click="markAsShipped(order)" 
                class="btn-primary"
              >
                <i class="bi bi-truck"></i> Als versendet markieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-history {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
  background: #EFE1D6;
}

/* Header */
.page-header {
  background: linear-gradient(135deg, #E26191, #B48665);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2.5rem;
  color: white;
  box-shadow: 0 8px 32px rgba(226, 97, 145, 0.15);
}

.header-content h1 {
  font-size: 2.4rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-content h1 i {
  font-size: 2.2rem;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 400;
}

/* Admin Controls */
.admin-controls {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 320px;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.search-box input {
  width: 100%;
  padding: 1rem 1rem 1rem 3.2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.search-box input:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.4);
}

.search-box input:focus {
  outline: none;
  border-color: white;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.status-filter {
  padding: 1rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  min-width: 160px;
  backdrop-filter: blur(10px);
}

.status-filter option {
  background: #B48665;
  color: white;
}

.btn-refresh {
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  cursor: pointer;
  min-width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-refresh:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading & Error States */
.loading-state, .error-state, .no-orders {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 20px;
  margin: 2rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.loading-state .spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #EFE1D6;
  border-top: 4px solid #E26191;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state i {
  font-size: 3.5rem;
  color: #E26191;
  margin-bottom: 1.5rem;
}

.error-state p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.no-orders i {
  font-size: 4.5rem;
  color: #BB9580;
  margin-bottom: 1.5rem;
}

.no-orders p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

/* Button Styles */
.btn-primary, .btn-secondary {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: #E26191;
  color: white;
}

.btn-primary:hover {
  background: #d15280;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(226, 97, 145, 0.3);
}

.btn-secondary {
  background: #B48665;
  color: white;
}

.btn-secondary:hover {
  background: #9e7354;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(180, 134, 101, 0.3);
}

/* Admin Stats */
.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(187, 149, 128, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #E26191;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.stat-label {
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Order List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Order Card */
.order-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(187, 149, 128, 0.15);
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

/* Order Header */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.75rem;
  border-bottom: 2px solid #EFE1D6;
  background: linear-gradient(to right, rgba(239, 225, 214, 0.3), rgba(239, 225, 214, 0.1));
}

.order-info {
  flex: 1;
}

.order-id {
  margin-bottom: 0.75rem;
}

.order-label {
  display: block;
  font-size: 0.9rem;
  color: #888;
  font-weight: 500;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.order-id h3 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
}

.order-date-time {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #666;
  font-size: 0.95rem;
}

.order-date-time i {
  color: #B48665;
}

.order-status-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  min-width: 200px;
}

.status-container {
  width: 100%;
}

.status-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 2px solid;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.status-select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(226, 97, 145, 0.1);
}

.status-select.status-pending {
  border-color: #FFC107;
  color: #856404;
  background: #FFF3CD;
}

.status-select.status-paid {
  border-color: #17A2B8;
  color: #0C5460;
  background: #D1ECF1;
}

.status-select.status-shipped {
  border-color: #28A745;
  color: #155724;
  background: #D4EDDA;
}

.status-select.status-delivered {
  border-color: #BB9580;
  color: #5D4037;
  background: #EFE1D6;
}

.order-status {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  display: inline-block;
}

.order-status.pending {
  background: #FFF3CD;
  color: #856404;
}

.order-status.paid {
  background: #D1ECF1;
  color: #0C5460;
}

.order-status.shipped {
  background: #D4EDDA;
  color: #155724;
}

.order-status.delivered {
  background: #EFE1D6;
  color: #5D4037;
}

.order-price {
  text-align: right;
}

.price-label {
  display: block;
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 0.25rem;
}

.price-amount {
  font-size: 2rem;
  font-weight: 700;
  color: #E26191;
  line-height: 1;
}

/* Customer Info */
.customer-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1.5rem 1.75rem;
  background: rgba(239, 225, 214, 0.3);
  border-bottom: 2px solid #EFE1D6;
}

.customer-detail {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #555;
  font-size: 0.95rem;
}

.customer-detail i {
  color: #B48665;
  min-width: 20px;
}

/* Order Items */
.order-items {
  padding: 1.75rem;
}

.items-header {
  margin-bottom: 1.5rem;
}

.items-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.items-header h4::before {
  content: '';
  display: block;
  width: 4px;
  height: 24px;
  background: #E26191;
  border-radius: 2px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: rgba(239, 225, 214, 0.15);
  border-radius: 12px;
  border-left: 4px solid #B48665;
}

.item-details {
  flex: 1;
}

.item-name {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.05rem;
}

.item-meta {
  display: flex;
  gap: 1.5rem;
  color: #666;
  font-size: 0.95rem;
}

.item-price {
  color: #E26191;
  font-weight: 600;
}

.item-subtotal {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  min-width: 100px;
  text-align: right;
}

/* Order Footer */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.75rem;
  border-top: 2px solid #EFE1D6;
  background: rgba(239, 225, 214, 0.3);
}

.footer-details {
  display: flex;
  gap: 2rem;
}

.footer-detail {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #555;
  font-size: 0.95rem;
}

.footer-detail i {
  color: #B48665;
}

.footer-actions {
  display: flex;
  gap: 1rem;
}

/* Spin Animation for Refresh */
.bi-arrow-clockwise.spin {
  animation: spin 1s linear infinite;
}

/* Responsive */
@media (max-width: 1024px) {
  .order-header {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .order-status-price {
    width: 100%;
    align-items: stretch;
  }
  
  .status-select, .order-status {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .orders-history {
    padding: 1rem;
  }
  
  .page-header {
    padding: 1.75rem;
  }
  
  .header-content h1 {
    font-size: 2rem;
  }
  
  .admin-controls {
    flex-direction: column;
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .order-footer {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .footer-details {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
  
  .footer-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .admin-stats {
    grid-template-columns: 1fr;
  }
  
  .customer-info {
    grid-template-columns: 1fr;
  }
  
  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .item-subtotal {
    text-align: left;
    width: 100%;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(187, 149, 128, 0.2);
  }
}
</style>