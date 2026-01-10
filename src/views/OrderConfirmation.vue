<template>
  <div class="order-confirmation">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <router-link to="/order-history" class="back-btn">
          <i class="bi bi-arrow-left"></i> Zur Bestellübersicht
        </router-link>
        <h1>
          <i class="bi bi-check-circle"></i>
          Bestellbestätigung
        </h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Bestellung wird geladen...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error">
        <i class="bi bi-exclamation-triangle"></i>
        <h3>Fehler</h3>
        <p>{{ error }}</p>
        <router-link to="/order-history" class="btn-primary">
          <i class="bi bi-arrow-left"></i> Zurück zur Übersicht
        </router-link>
      </div>

      <!-- Order Details -->
      <div v-else-if="order" class="order-details">
        <!-- Success Message -->
        <div class="success-message">
          <i class="bi bi-check-circle"></i>
          <div class="success-content">
            <h3>Bestellung erfolgreich!</h3>
            <p>Vielen Dank für Ihre Bestellung <strong>#{{ order.orderNumber }}</strong></p>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <div class="summary-header">
            <h2><i class="bi bi-receipt"></i> Bestellübersicht</h2>
            <div class="order-status" :class="order.status.toLowerCase()">
              {{ getStatusText(order.status) }}
            </div>
          </div>

          <div class="summary-grid">
            <!-- Order Info -->
            <div class="info-card">
              <h3><i class="bi bi-info-circle"></i> Bestellinformationen</h3>
              <div class="info-row">
                <span>Bestellnummer:</span>
                <span class="highlight">#{{ order.orderNumber }}</span>
              </div>
              <div class="info-row">
                <span>Bestelldatum:</span>
                <span>{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="info-row">
                <span>Zahlungsmethode:</span>
                <span>{{ getPaymentMethodText(order.paymentMethod) }}</span>
              </div>
              <div v-if="order.status === 'SHIPPED' || order.status === 'DELIVERED'" class="info-row">
                <span>Versanddatum:</span>
                <span>{{ formatDate(order.updatedAt || order.createdAt) }}</span>
              </div>
            </div>

            <!-- Customer Info -->
            <div class="info-card">
              <h3><i class="bi bi-person-circle"></i> Lieferadresse</h3>
              <div class="address">
                <p><strong>{{ order.firstName }} {{ order.lastName }}</strong></p>
                <p>{{ order.street }}</p>
                <p>{{ order.zipCode }} {{ order.city }}</p>
                <p>{{ order.country }}</p>
                <p v-if="order.phone"><i class="bi bi-telephone"></i> {{ order.phone }}</p>
                <p><i class="bi bi-envelope"></i> {{ order.email }}</p>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="order-items">
            <h3><i class="bi bi-cart"></i> Artikelübersicht</h3>
            <div class="items-list">
              <div v-for="item in order.items" :key="item.id" class="item">
                <img :src="getImageUrl(item.productImage)" :alt="item.productName" />
                <div class="item-details">
                  <h4>{{ item.productName }}</h4>
                  <div class="item-meta">
                    <span>Artikelnummer: {{ item.productId }}</span>
                    <span>Kategorie: {{ getCategoryFromProductId(item.productId) }}</span>
                  </div>
                </div>
                <div class="item-pricing">
                  <div class="quantity">Menge: {{ item.quantity }}</div>
                  <div class="price">{{ formatCurrency(item.price) }} / Stück</div>
                  <div class="total">{{ formatCurrency(item.price * item.quantity) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Totals -->
          <div class="order-totals">
            <div class="totals-grid">
              <div class="total-row">
                <span>Zwischensumme:</span>
                <span>{{ formatCurrency(order.subtotal) }}</span>
              </div>
              <div class="total-row">
                <span>Versandkosten:</span>
                <span>{{ formatCurrency(order.shippingCost) }}</span>
              </div>
              <div class="total-row grand-total">
                <span>Gesamtsumme:</span>
                <span class="highlight">{{ formatCurrency(order.totalAmount) }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="actions">
            <router-link to="/" class="btn-continue">
              <i class="bi bi-shop"></i> Weiter einkaufen
            </router-link>
            <button v-if="isAdmin" @click="updateOrderStatus" class="btn-update">
              <i class="bi bi-pencil-square"></i> Status aktualisieren
            </button>
            <button @click="downloadInvoice" class="btn-download" :disabled="downloading">
              <i v-if="downloading" class="bi bi-arrow-clockwise spin"></i>
              <i v-else class="bi bi-download"></i>
              {{ downloading ? 'Wird erstellt...' : 'Rechnung herunterladen' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const route = useRoute()
const router = useRouter()
const { getAccessTokenSilently } = useAuth0()

const order = ref(null)
const loading = ref(true)
const error = ref('')
const isAdmin = ref(false)
const downloading = ref(false)

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

// Kategorien-Mapping (basierend auf deinem DataLoader)
const categoryMap = {
  1: 'Leinen & Geschirre',
  2: 'Leinen & Geschirre',
  3: 'Leinen & Geschirre',
  4: 'Halsbänder',
  5: 'Halsbänder',
  6: 'Halsbänder',
  7: 'Bekleidung',
  8: 'Bekleidung',
  9: 'Bekleidung',
  10: 'Snacks',
  11: 'Snacks',
  12: 'Snacks'
}

// Helper: Bild-URL konstruieren
const getImageUrl = (imageName) => {
  if (!imageName) return '/src/assets/placeholder.jpg'
  return `/src/assets/product_pics/${imageName}`
}

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

const getPaymentMethodText = (method) => {
  const map = {
    'PAYPAL': 'PayPal',
    'CREDITCARD': 'Kreditkarte',
    'INVOICE': 'Rechnung',
    'BANK_TRANSFER': 'Überweisung'
  }
  return map[method] || method
}

const getCategoryFromProductId = (productId) => {
  return categoryMap[productId] || 'Unbekannt'
}

// Load order from backend
const loadOrder = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const token = await getAccessTokenSilently()
    
    // 1. Admin-Status prüfen
    const profileRes = await fetch(`${API_BASE}/api/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (profileRes.ok) {
      const userData = await profileRes.json()
      isAdmin.value = userData.role === 'ADMIN'
    }
    
    // 2. Bestellung laden
    const orderNumber = route.params.orderNumber
    
    // Für Admin: /api/orders/admin/{orderNumber}
    // Für User: /api/orders/my-orders/{orderNumber}
    const endpoint = isAdmin.value 
      ? `/api/orders/admin/${orderNumber}`
      : `/api/orders/my-orders/${orderNumber}`
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        error.value = 'Bestellung nicht gefunden'
      } else if (response.status === 403) {
        error.value = 'Sie haben keine Berechtigung für diese Bestellung'
      } else {
        throw new Error(`Fehler ${response.status}: ${response.statusText}`)
      }
    } else {
      order.value = await response.json()
      console.log('Bestellung geladen:', order.value)
    }
    
  } catch (err) {
    console.error('Fehler beim Laden der Bestellung:', err)
    error.value = `Fehler: ${err.message}`
  } finally {
    loading.value = false
  }
}

// Update order status (Admin only)
const updateOrderStatus = async () => {
  if (!order.value || !isAdmin.value) return
  
  const currentStatus = order.value.status
  let newStatus = ''
  
  if (currentStatus === 'PAID') {
    newStatus = 'SHIPPED'
  } else if (currentStatus === 'SHIPPED') {
    newStatus = 'DELIVERED'
  } else {
    alert('Diese Bestellung kann nicht aktualisiert werden')
    return
  }
  
  if (!confirm(`Bestellung wirklich auf "${getStatusText(newStatus)}" setzen?`)) return
  
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`${API_BASE}/api/orders/${order.value.id}/status`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })
    
    if (response.ok) {
      // Status lokal aktualisieren
      order.value.status = newStatus
      order.value.updatedAt = new Date().toISOString()
      alert(`Bestellung wurde auf "${getStatusText(newStatus)}" aktualisiert`)
    } else {
      throw new Error('Status konnte nicht aktualisiert werden')
    }
  } catch (err) {
    alert(`Fehler: ${err.message}`)
  }
}

// Download invoice (mock)
const downloadInvoice = () => {
  downloading.value = true
  
  // Simuliere Download
  setTimeout(() => {
    alert(`Rechnung für Bestellung #${order.value.orderNumber} wird generiert...\n\n(Demo-Funktion)`)
    downloading.value = false
  }, 1000)
}

// Init
onMounted(loadOrder)
</script>

<style scoped>
.order-confirmation {
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

/* Loading & Error */
.loading, .error {
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

.error i {
  font-size: 2.5rem;
  color: #ff4757;
  margin-bottom: 1rem;
}

.error h3 {
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
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
}

.btn-primary:hover {
  background: #d05583;
  transform: translateY(-2px);
}

/* Success Message */
.success-message {
  background: rgba(46, 213, 115, 0.15);
  border: 1px solid rgba(46, 213, 115, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.success-message i {
  font-size: 2.5rem;
  color: #2ed573;
}

.success-content h3 {
  margin: 0 0 0.5rem 0;
  color: #fff;
}

.success-content p {
  margin: 0;
  color: rgba(255,255,255,0.8);
}

/* Order Summary */
.order-summary {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.summary-header h2 {
  margin: 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.order-status.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.order-status.paid {
  background: rgba(0, 123, 255, 0.2);
  color: #007bff;
}

.order-status.shipped {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

.order-status.delivered {
  background: rgba(111, 66, 193, 0.2);
  color: #6f42c1;
}

.order-status.cancelled {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

/* Summary Grid */
.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

.info-card {
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
  padding: 1.5rem;
}

.info-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.8);
}

.info-row:last-child {
  border-bottom: none;
}

.highlight {
  color: #e26191;
  font-weight: 600;
}

.address p {
  margin: 0.5rem 0;
  color: rgba(255,255,255,0.8);
}

.address p:first-child {
  font-size: 1.1rem;
}

.address i {
  color: #bb9580;
  margin-right: 0.5rem;
}

/* Order Items */
.order-items {
  margin-bottom: 2rem;
}

.order-items h3 {
  font-size: 1.3rem;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.05);
}

.item img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(255,255,255,0.1);
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 0.5rem 0;
  color: #fff;
  font-size: 1.1rem;
}

.item-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
}

.item-pricing {
  text-align: right;
  min-width: 200px;
}

.quantity, .price {
  color: rgba(255,255,255,0.7);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.total {
  font-size: 1.2rem;
  font-weight: 600;
  color: #e26191;
}

/* Order Totals */
.order-totals {
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.totals-grid {
  max-width: 400px;
  margin-left: auto;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.8);
}

.total-row:last-child {
  border-bottom: none;
}

.grand-total {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 2px solid rgba(255,255,255,0.2);
}

/* Actions */
.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-continue, .btn-update, .btn-download {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s;
  cursor: pointer;
  border: none;
}

.btn-continue {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
}

.btn-continue:hover {
  background: rgba(255,255,255,0.2);
}

.btn-update {
  background: rgba(0, 123, 255, 0.2);
  color: #007bff;
  border: 1px solid rgba(0, 123, 255, 0.3);
}

.btn-update:hover {
  background: rgba(0, 123, 255, 0.3);
}

.btn-download {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
  margin-left: auto;
}

.btn-download:hover:not(:disabled) {
  background: rgba(40, 167, 69, 0.3);
}

.btn-download:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .item-pricing {
    text-align: center;
    min-width: auto;
    width: 100%;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn-download {
    margin-left: 0;
  }
}
</style>