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
            <p>Wir haben Ihre Bestellung erhalten.</p>
          </div>
        </div>

        <div class="order-summary">
          <div class="summary-header">
            <h2><i class="bi bi-receipt"></i> Bestellung #{{ order.id }}</h2>
            <div class="order-status">
              {{ getStatusText(order.status) }}
            </div>
          </div>

          <div class="order-info">
            <div class="info-row">
              <span>Bestelldatum:</span>
              <span>{{ formatDate(order.createdAt) }}</span>
            </div>
            <div class="info-row">
              <span>Zahlung:</span>
              <span>Rechnung</span>
            </div>
          </div>

          <div class="customer-info">
            <h3><i class="bi bi-person-circle"></i> Lieferadresse</h3>
            <p><strong>{{ order.firstName }} {{ order.lastName }}</strong></p>
            <p>{{ order.street }}, {{ order.zipCode }} {{ order.city }}</p>
            <p>Deutschland</p>
            <p><i class="bi bi-envelope"></i> {{ order.email }}</p>
            <p v-if="order.phone"><i class="bi bi-telephone"></i> {{ order.phone }}</p>
          </div>

          <div class="order-items">
            <h3><i class="bi bi-cart"></i> Artikel</h3>
            <div class="items-list">
              <div v-for="item in order.items" :key="item.productId" class="item">
                <div class="item-image">
                  <img :src="getImageUrl(item.productImage)" :alt="item.productName" />
                </div>
                <div class="item-details">
                  <h4>{{ item.productName }}</h4>
                  <div class="item-quantity">{{ item.quantity }} × {{ formatCurrency(item.price) }}</div>
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
              <span>Versand:</span>
              <span>{{ formatCurrency(order.shippingCost) }}</span>
            </div>
            <div class="total-row grand-total">
              <span>Gesamtsumme:</span>
              <span>{{ formatCurrency(order.totalAmount) }}</span>
            </div>
          </div>

          <div class="actions">
            <router-link to="/" class="btn-continue">
              <i class="bi bi-shop"></i> Weiter einkaufen
            </router-link>
            <router-link v-if="isAdmin" :to="`/admin/orders`" class="btn-admin">
              <i class="bi bi-list"></i> Alle Bestellungen
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const route = useRoute()
const { getAccessTokenSilently } = useAuth0()

const order = ref(null)
const loading = ref(true)
const error = ref('')
const isAdmin = ref(false)

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

const getStatusText = (status) => {
  const map = {
    'PENDING': 'Ausstehend',
    'PAID': 'Bezahlt',
    'SHIPPED': 'Versendet',
    'DELIVERED': 'Geliefert'
  }
  return map[status] || status
}

const getImageUrl = (imageName) => {
  if (!imageName) return '/placeholder.jpg'
  if (imageName.startsWith('http')) return imageName
  return `/frontend-puppyracer/product_pics/${imageName}`
}

const loadOrder = async () => {
  loading.value = true
  
  try {
    const orderId = route.params.id
    const token = await getAccessTokenSilently()
    
    // Admin-Status prüfen
    try {
      const profileRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (profileRes.ok) {
        const userData = await profileRes.json()
        isAdmin.value = userData.role === 'ADMIN'
      }
    } catch {}
    
    // Bestellung laden
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        error.value = 'Bestellung nicht gefunden'
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

@keyframes spin { to { transform: rotate(360deg); } }

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

.success-message p {
  margin: 0;
  color: rgba(255,255,255,0.8);
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
  margin-bottom: 1.5rem;
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
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.order-info {
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: rgba(255,255,255,0.8);
}

.info-row:first-child {
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.customer-info {
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.customer-info h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.customer-info p {
  margin: 0.5rem 0;
  color: rgba(255,255,255,0.8);
}

.customer-info p:first-of-type {
  font-size: 1.1rem;
}

.customer-info i {
  color: #bb9580;
  margin-right: 0.5rem;
}

.order-items {
  margin-bottom: 1.5rem;
}

.order-items h3 {
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
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
  gap: 1rem;
  padding: 1rem;
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
}

.item-image {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.item-quantity {
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
}

.item-total {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e26191;
  min-width: 80px;
  text-align: right;
}

.order-totals {
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: rgba(255,255,255,0.8);
}

.grand-total {
  font-size: 1.3rem;
  font-weight: 700;
  color: #e26191;
  border-top: 2px solid rgba(255,255,255,0.1);
  margin-top: 0.5rem;
  padding-top: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-continue, .btn-admin {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.btn-continue {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
}

.btn-continue:hover {
  background: rgba(255,255,255,0.15);
}

.btn-admin {
  background: rgba(0, 123, 255, 0.2);
  color: #007bff;
  border: 1px solid rgba(0, 123, 255, 0.3);
}

.btn-admin:hover {
  background: rgba(0, 123, 255, 0.3);
}

@media (max-width: 768px) {
  .order-confirmation {
    padding: 70px 15px 30px;
  }
  
  .container {
    padding: 0;
  }
  
  .order-summary {
    padding: 1.5rem;
  }
  
  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .item {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .item-total {
    text-align: center;
    min-width: auto;
    width: 100%;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>