<template>
  <div class="order-confirmation">
    <div class="container">
      <div class="header">
        <router-link to="/" class="back-btn">
          <i class="bi bi-arrow-left"></i> Zurück
        </router-link>
        <h1><i class="bi bi-check-circle"></i> Bestellbestätigung</h1>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Bestellung wird geladen...</p>
      </div>

      <div v-else-if="error" class="error">
        <i class="bi bi-exclamation-triangle"></i>
        <h3>Fehler</h3>
        <p>{{ error }}</p>
        <router-link to="/" class="btn-primary">
          <i class="bi bi-shop"></i> Zurück zum Shop
        </router-link>
      </div>

      <div v-else class="order-details">
        <div class="success-message">
          <i class="bi bi-check-circle"></i>
          <div>
            <h3>Bestellung erfolgreich!</h3>
            <p>Vielen Dank für Ihre Bestellung</p>
          </div>
        </div>

        <div class="order-summary">
          <div class="summary-header">
            <h2><i class="bi bi-receipt"></i> Bestellübersicht</h2>
            <div class="order-status pending">
              Ausstehend
            </div>
          </div>

          <div class="summary-grid">
            <div class="info-card">
              <h3><i class="bi bi-info-circle"></i> Bestellinformationen</h3>
              <div class="info-row">
                <span>Bestelldatum:</span>
                <span>{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="info-row">
                <span>Zahlungsmethode:</span>
                <span>Rechnung</span>
              </div>
            </div>

            <div class="info-card">
              <h3><i class="bi bi-person-circle"></i> Lieferadresse</h3>
              <div class="address">
                <p><strong>{{ order.firstName }} {{ order.lastName }}</strong></p>
                <p>{{ order.street }}</p>
                <p>{{ order.zipCode }} {{ order.city }}</p>
                <p>Deutschland</p>
                <p v-if="order.phone"><i class="bi bi-telephone"></i> {{ order.phone }}</p>
                <p><i class="bi bi-envelope"></i> {{ order.email }}</p>
              </div>
            </div>
          </div>

          <div class="order-items">
            <h3><i class="bi bi-cart"></i> Artikelübersicht</h3>
            <div class="items-list">
              <div v-for="item in order.items" :key="item.productId" class="item">
                <img :src="item.productImage || '/placeholder.jpg'" :alt="item.productName" />
                <div class="item-details">
                  <h4>{{ item.productName }}</h4>
                  <div class="item-meta">
                    <span>Menge: {{ item.quantity }}</span>
                    <span>{{ formatCurrency(item.price) }} / Stück</span>
                  </div>
                </div>
                <div class="item-total">
                  {{ formatCurrency(item.price * item.quantity) }}
                </div>
              </div>
            </div>
          </div>

          <div class="order-totals">
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

          <div class="actions">
            <router-link to="/" class="btn-continue">
              <i class="bi bi-shop"></i> Weiter einkaufen
            </router-link>
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const route = useRoute()
const router = useRouter()
const { getAccessTokenSilently } = useAuth0()

const order = ref(null)
const loading = ref(true)
const error = ref('')
const downloading = ref(false)

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

const formatCurrency = (amount) => {
  return `${(parseFloat(amount) || 0).toFixed(2)}€`
}

const loadOrder = async () => {
  loading.value = true
  
  try {
    const orderId = route.params.id
    const token = await getAccessTokenSilently()
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        error.value = 'Bestellung nicht gefunden'
      } else if (response.status === 403) {
        error.value = 'Keine Berechtigung'
      } else {
        throw new Error('Bestellung konnte nicht geladen werden')
      }
    } else {
      order.value = await response.json()
    }
    
  } catch (err) {
    error.value = 'Bestellung konnte nicht geladen werden'
  } finally {
    loading.value = false
  }
}

const downloadInvoice = () => {
  downloading.value = true
  setTimeout(() => {
    alert('Rechnung wird generiert...')
    downloading.value = false
  }, 1000)
}

onMounted(() => {
  loadOrder()
})
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
}

.btn-primary:hover {
  background: #d05583;
}

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

.success-message h3 {
  margin: 0 0 0.5rem 0;
}

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

.order-status.pending { background: rgba(255, 193, 7, 0.2); color: #ffc107; }

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
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
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.8);
}

.info-row:last-child { border-bottom: none; }

.highlight { color: #e26191; font-weight: 600; }

.address p {
  margin: 0.5rem 0;
  color: rgba(255,255,255,0.8);
}

.address p:first-child { font-size: 1.1rem; }

.address i { color: #bb9580; margin-right: 0.5rem; }

.order-items {
  margin-bottom: 2rem;
}

.order-items h3 {
  font-size: 1.3rem;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  padding: 1rem;
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
}

.item img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.item-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
}

.item-total {
  font-size: 1.2rem;
  font-weight: 600;
  color: #e26191;
  min-width: 100px;
  text-align: right;
}

.order-totals {
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
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

.grand-total {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 2px solid rgba(255,255,255,0.2);
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-continue, .btn-download {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-continue {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
}

.btn-continue:hover {
  background: rgba(255,255,255,0.15);
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

.spin { animation: spin 1s linear infinite; }

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .summary-grid { grid-template-columns: 1fr; }
  
  .item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .item-total {
    text-align: center;
    min-width: auto;
    width: 100%;
  }
  
  .actions { flex-direction: column; }
  
  .btn-download { margin-left: 0; }
  
  .order-totals { margin-left: 0; max-width: none; }
}
</style>