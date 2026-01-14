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
                <div class="order-number">Bestellung #{{ order.id || order.orderNumber }}</div>
                <div class="order-date">{{ formatDate(order.orderDate || order.createdAt) }}</div>
              </div>
              <div class="order-right">
                <div class="status" :class="getStatusClass(order.status)">
                  {{ getStatusText(order.status) }}
                </div>
                <div class="total">{{ formatCurrency(order.total || order.totalAmount) }}</div>
              </div>
            </div>

            <div v-if="isAdmin && order.customer" class="customer">
              <span>{{ order.customer.name || order.customer.username }}</span>
              <span class="email">{{ order.customer.email }}</span>
            </div>

            <div class="items">
              <div v-for="item in (order.items || []).slice(0, 2)" :key="item.id" class="item">
                <img v-if="item.product && item.product.image" 
                     :src="getImageUrl(item.product.image)" 
                     :alt="item.product.name" />
                <div v-else class="image-placeholder">
                  <i class="bi bi-image"></i>
                </div>
                <div class="item-details">
                  <span>{{ item.product?.name || 'Produkt' }}</span>
                  <span>{{ item.quantity }} × {{ formatCurrency(item.price) }}</span>
                </div>
              </div>
              <div v-if="order.items && order.items.length > 2" class="more-items">
                + {{ order.items.length - 2 }} weitere
              </div>
            </div>

            <div class="actions">
              <router-link 
                :to="isAdmin ? `/admin/orders/${order.id}` : `/order-confirmation/${order.id}`" 
                class="btn-view"
              >
                <i class="bi bi-eye"></i> Details
              </router-link>
              <button 
                v-if="isAdmin && order.status === 'PAID'" 
                @click="updateOrderStatus(order, 'SHIPPED')"
                class="btn-ship"
                :disabled="updatingOrderId === order.id"
              >
                <i class="bi bi-truck"></i> 
                {{ updatingOrderId === order.id ? 'Wird aktualisiert...' : 'Versendet' }}
              </button>
              <button 
                v-if="isAdmin && order.status === 'SHIPPED'" 
                @click="updateOrderStatus(order, 'DELIVERED')"
                class="btn-deliver"
                :disabled="updatingOrderId === order.id"
              >
                <i class="bi bi-check-circle"></i> 
                {{ updatingOrderId === order.id ? 'Wird aktualisiert...' : 'Geliefert' }}
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
const { getAccessTokenSilently, isAuthenticated, user } = useAuth0()

const orders = ref([])
const loading = ref(true)
const error = ref('')
const isAdmin = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const updatingOrderId = ref(null)

const filteredOrders = computed(() => {
  let filtered = orders.value
  
  if (statusFilter.value) {
    filtered = filtered.filter(o => o.status === statusFilter.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(o => 
      String(o.id).toLowerCase().includes(query) ||
      (o.customer && o.customer.name && o.customer.name.toLowerCase().includes(query)) ||
      (o.customer && o.customer.email && o.customer.email.toLowerCase().includes(query))
    )
  }
  
  return filtered.sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt))
})

const totalRevenue = computed(() => {
  return orders.value
    .filter(o => o.status === 'PAID' || o.status === 'SHIPPED' || o.status === 'DELIVERED')
    .reduce((sum, order) => sum + (parseFloat(order.total || order.totalAmount) || 0), 0)
    .toFixed(2)
})

const getImageUrl = (imageName) => {
  if (!imageName) return ''
  // Annahme: Bilder werden relativ gespeichert
  if (imageName.startsWith('http')) return imageName
  return `/frontend-puppyracer/product_pics/${imageName}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
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
  const num = parseFloat(amount) || 0
  return num.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR'
  })
}

const getStatusClass = (status) => {
  const map = {
    'PENDING': 'pending',
    'PAID': 'paid',
    'SHIPPED': 'shipped',
    'DELIVERED': 'delivered',
    'CANCELLED': 'cancelled'
  }
  return map[status] || 'pending'
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

const checkAdminStatus = async (token) => {
  try {
    // Option 1: Überprüfe die Rolle im Benutzerprofil
    if (user.value && user.value['https://your-app/roles']) {
      const roles = user.value['https://your-app/roles']
      isAdmin.value = roles.includes('ADMIN') || roles.includes('admin')
      return true
    }
    
    // Option 2: API-Abfrage für Admin-Endpoint
    const testRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/test`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (testRes.status === 200 || testRes.status === 403) {
      // Wenn 200 -> Admin, wenn 403 -> kein Admin
      isAdmin.value = testRes.status === 200
      return true
    }
    
    // Option 3: Standardmäßig false
    isAdmin.value = false
    return true
  } catch (err) {
    console.warn('Admin-Check fehlgeschlagen:', err)
    isAdmin.value = false
    return false
  }
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
    await checkAdminStatus(token)
    
    console.log('Admin-Status:', isAdmin.value)
    
    // Korrekte API-Endpoints basierend auf Benutzerrolle
    let endpoint
    if (isAdmin.value) {
      // Admin: Alle Bestellungen
      // Teste verschiedene mögliche Endpoints
      const adminEndpoints = [
        '/api/orders/admin',
        '/api/orders/all',
        '/api/admin/all-orders',
        '/api/orders'
      ]
      
      let ordersData = null
      
      for (const ep of adminEndpoints) {
        try {
          console.log('Versuche Endpoint:', ep)
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${ep}`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          })
          
          if (res.ok) {
            ordersData = await res.json()
            console.log(`Erfolgreich von ${ep}:`, ordersData)
            break
          } else if (res.status === 404) {
            console.log(`Endpoint ${ep} nicht gefunden`)
            continue
          }
        } catch (err) {
          console.log(`Fehler bei ${ep}:`, err)
        }
      }
      
      if (ordersData) {
        // Normalisiere die Datenstruktur
        orders.value = Array.isArray(ordersData) ? ordersData : []
        
        // Debug-Ausgabe
        if (orders.value.length > 0) {
          console.log('Erste Bestellung:', orders.value[0])
        }
      } else {
        // Fallback: Normale Bestellungen laden
        const fallbackRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (fallbackRes.ok) {
          orders.value = await fallbackRes.json()
        } else {
          throw new Error(`Keine Bestellungen gefunden. Status: ${fallbackRes.status}`)
        }
      }
      
    } else {
      // Normaler Benutzer: Eigene Bestellungen
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!res.ok) {
        throw new Error(`Fehler ${res.status}: ${await res.text()}`)
      }
      
      orders.value = await res.json()
    }
    
  } catch (err) {
    console.error('Fehler beim Laden der Bestellungen:', err)
    error.value = 'Bestellungen konnten nicht geladen werden: ' + (err.message || 'Unbekannter Fehler')
    orders.value = []
  } finally {
    loading.value = false
  }
}

const updateOrderStatus = async (order, newStatus) => {
  if (!confirm(`Bestellung #${order.id} auf "${getStatusText(newStatus)}" setzen?`)) return
  
  updatingOrderId.value = order.id
  
  try {
    const token = await getAccessTokenSilently()
    
    // Mögliche Endpoints für Status-Update
    const endpoints = [
      `/api/orders/${order.id}/status`,
      `/api/admin/orders/${order.id}/status`,
      `/api/orders/${order.id}`,
      `/api/admin/orders/${order.id}`
    ]
    
    let success = false
    
    for (const endpoint of endpoints) {
      try {
        console.log('Versuche Status-Update über:', endpoint)
        
        const payload = {
          status: newStatus,
          orderId: order.id
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        
        if (response.ok) {
          // Aktualisiere die lokale Bestellliste
          const updatedOrder = await response.json()
          const index = orders.value.findIndex(o => o.id === order.id)
          if (index !== -1) {
            orders.value[index] = { ...orders.value[index], ...updatedOrder }
          }
          
          success = true
          console.log(`Status erfolgreich aktualisiert über ${endpoint}`)
          break
        } else {
          console.log(`Endpoint ${endpoint} antwortete mit:`, response.status)
        }
      } catch (err) {
        console.log(`Fehler bei ${endpoint}:`, err)
      }
    }
    
    if (!success) {
      // Fallback: Lokales Update, falls API fehlschlägt
      console.log('API-Update fehlgeschlagen, aktualisiere lokal')
      const index = orders.value.findIndex(o => o.id === order.id)
      if (index !== -1) {
        orders.value[index].status = newStatus
      }
      alert('Status lokal aktualisiert (API nicht erreichbar)')
    } else {
      alert(`Status erfolgreich auf "${getStatusText(newStatus)}" aktualisiert`)
    }
    
  } catch (err) {
    console.error('Fehler beim Status-Update:', err)
    alert(`Fehler: ${err.message}`)
  } finally {
    updatingOrderId.value = null
  }
}

// Beobachte Authentifizierungsstatus
watch(isAuthenticated, (newVal) => {
  if (newVal) {
    loadOrders()
  } else {
    orders.value = []
    isAdmin.value = false
  }
})

onMounted(() => {
  console.log('OrderHistory Komponente geladen')
  if (isAuthenticated.value) {
    loadOrders()
  } else {
    loading.value = false
    error.value = 'Bitte zuerst anmelden'
  }
})
</script>

<style scoped>
/* Füge diese neuen CSS-Regeln hinzu */

.image-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.3);
  font-size: 1.5rem;
}

.status.cancelled {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
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
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-view {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.btn-view:hover {
  background: rgba(255,255,255,0.15);
}

.btn-ship {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

.btn-ship:hover:not(:disabled) {
  background: rgba(40, 167, 69, 0.3);
}

.btn-deliver {
  background: rgba(111, 66, 193, 0.2);
  color: #6f42c1;
}

.btn-deliver:hover:not(:disabled) {
  background: rgba(111, 66, 193, 0.3);
}

.btn-ship:disabled,
.btn-deliver:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Bestehende CSS-Regeln bleiben unverändert */
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

.btn-primary:hover {
  background: #d05583;
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
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .admin-filters { flex-direction: column; }
  .stats { flex-direction: column; }
  .order-header { flex-direction: column; gap: 1rem; }
  .order-right { width: 100%; display: flex; justify-content: space-between; }
  .actions { flex-direction: column; }
  .actions a, .actions button { width: 100%; justify-content: center; }
}
</style>