<template>
  <div class="order-history">
    <div class="container">
      <div class="header">
        <router-link to="/" class="back-btn">
          <i class="bi bi-arrow-left"></i> Zurück
        </router-link>
        <h1>
          <i class="bi bi-receipt"></i>
          Meine Bestellungen
        </h1>
      </div>

      <!-- Admin-Hinweis -->
      <div v-if="isAdminRoute" class="admin-info">
        <i class="bi bi-shield-check"></i> Sie sind im Admin-Modus
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Lade Bestellungen...</p>
      </div>

      <div v-else-if="error" class="error">
        <i class="bi bi-exclamation-triangle"></i>
        <h3>Keine Bestellungen gefunden</h3>
        <p>Die Bestellungen konnten nicht geladen werden. Bitte versuchen Sie:</p>
        <div class="solutions">
          <button @click="useDemoData = true; loadOrders()" class="btn-primary">
            <i class="bi bi-database"></i> Demo-Daten anzeigen
          </button>
          <router-link to="/" class="btn-secondary">
            <i class="bi bi-shop"></i> Zum Shop
          </router-link>
        </div>
      </div>

      <div v-else-if="orders.length === 0" class="no-orders">
        <i class="bi bi-inbox"></i>
        <h3>Noch keine Bestellungen</h3>
        <p>Sie haben noch keine Bestellungen aufgegeben.</p>
        <router-link to="/" class="btn-primary">
          <i class="bi bi-shop"></i> Jetzt einkaufen
        </router-link>
      </div>

      <div v-else class="orders">
        <!-- Admin-Filter -->
        <div v-if="isAdminRoute" class="admin-filters">
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

        <!-- Bestellungsliste -->
        <div class="order-list">
          <div v-for="order in filteredOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <div>
                <div class="order-number">Bestellung #{{ order.id }}</div>
                <div class="order-date">{{ formatDate(order.createdAt) }}</div>
              </div>
              <div class="order-right">
                <div class="status" :class="order.status.toLowerCase()">
                  {{ getStatusText(order.status) }}
                </div>
                <div class="total">{{ formatCurrency(order.total) }}</div>
              </div>
            </div>

            <div v-if="isAdminRoute && order.user" class="customer">
              <span>{{ order.user.name }}</span>
              <span class="email">{{ order.user.email }}</span>
            </div>

            <div class="actions">
              <router-link :to="`/order-confirmation/${order.id}`" class="btn-view">
                <i class="bi bi-eye"></i> Details
              </router-link>
              
              <button 
                v-if="isAdminRoute && order.status === 'PAID'" 
                @click="updateOrderStatus(order, 'SHIPPED')"
                class="btn-ship"
              >
                <i class="bi bi-truck"></i> Versendet
              </button>
              
              <button 
                v-if="isAdminRoute && order.status === 'SHIPPED'" 
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
import { useRoute } from 'vue-router'

const route = useRoute()

// Einfache Daten
const orders = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const statusFilter = ref('')
const useDemoData = ref(false)

// Prüfe ob Admin-Route
const isAdminRoute = computed(() => {
  return route.name === 'AdminOrders'
})

// Filter
const filteredOrders = computed(() => {
  let filtered = orders.value
  
  if (statusFilter.value) {
    filtered = filtered.filter(o => o.status === statusFilter.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(o => 
      String(o.id).includes(query) ||
      (o.user && o.user.name && o.user.name.toLowerCase().includes(query))
    )
  }
  
  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Hilfsfunktionen
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('de-DE')
}

const formatCurrency = (amount) => {
  return `${parseFloat(amount || 0).toFixed(2)}€`
}

const getStatusText = (status) => {
  const map = {
    'PENDING': 'Ausstehend',
    'PAID': 'Bezahlt',
    'SHIPPED': 'Versendet',
    'DELIVERED': 'Geliefert'
  }
  return map[status] || status
}

// Demo-Daten generieren
const generateDemoOrders = () => {
  const demoOrders = []
  const statuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED']
  
  for (let i = 1; i <= 8; i++) {
    demoOrders.push({
      id: `ORD-${1000 + i}`,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      total: (Math.random() * 150 + 20).toFixed(2),
      user: isAdminRoute.value ? {
        name: ['Max Mustermann', 'Erika Beispiel'][Math.floor(Math.random() * 2)],
        email: `kunde${i}@example.com`
      } : null
    })
  }
  
  return demoOrders
}

// Bestellungen laden
const loadOrders = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Warte 1 Sekunde (Simuliert API-Call)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (useDemoData.value) {
      // Demo-Daten verwenden
      orders.value = generateDemoOrders()
      console.log('Demo-Daten geladen:', orders.value)
    } else {
      // Versuche echte API (wird wahrscheinlich fehlschlagen)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
        headers: {
          'Authorization': 'Bearer demo-token'
        }
      })
      
      if (response.ok) {
        orders.value = await response.json()
      } else {
        throw new Error('API nicht verfügbar')
      }
    }
  } catch (err) {
    console.log('API Fehler, verwende Demo-Daten')
    orders.value = generateDemoOrders()
    error.value = 'API nicht verfügbar - Zeige Demo-Daten'
  } finally {
    loading.value = false
  }
}

// Status aktualisieren
const updateOrderStatus = async (order, newStatus) => {
  if (!confirm(`Bestellung #${order.id} auf "${getStatusText(newStatus)}" setzen?`)) return
  
  // Lokal aktualisieren
  order.status = newStatus
  alert(`Status aktualisiert auf "${getStatusText(newStatus)}"`)
  
  // Hier würde normalerweise API-Call stehen
  console.log(`Order ${order.id} status updated to ${newStatus}`)
}

// Initial laden
onMounted(() => {
  loadOrders()
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
  max-width: 800px;
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

.admin-info {
  background: rgba(0, 123, 255, 0.1);
  border-left: 4px solid #007bff;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
}

.loading, .error, .no-orders {
  text-align: center;
  padding: 3rem;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
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
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ff6b6b;
}

.no-orders i {
  color: #bb9580;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #e26191;
  color: white;
}

.btn-secondary {
  background: rgba(255,255,255,0.1);
  color: white;
}

.solutions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  font-size: 1.1rem;
  font-weight: 600;
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
  font-size: 1.2rem;
  font-weight: 600;
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

.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-view, .btn-ship, .btn-deliver {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.btn-view {
  background: rgba(255,255,255,0.1);
  color: white;
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
  .admin-filters {
    flex-direction: column;
  }
  
  .order-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .order-right {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .solutions {
    flex-direction: column;
  }
}
</style>