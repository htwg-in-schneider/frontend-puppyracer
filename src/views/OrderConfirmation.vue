<template>
  <div class="order-confirmation">
    <h1>Bestellbestätigung</h1>
    
    <div v-if="order">
      <p><strong>Bestellnummer:</strong> {{ order.orderNumber }}</p>
      <p><strong>Datum:</strong> {{ formatDate(order.orderDate) }}</p>
      <p><strong>Gesamtsumme:</strong> {{ order.totalAmount }}€</p>
      <p><strong>Status:</strong> {{ order.status }}</p>
      
      <h3>Bestellte Artikel:</h3>
      <div v-for="item in order.items" :key="item.id" class="order-item">
        {{ item.productName }} × {{ item.quantity }}: {{ item.price * item.quantity }}€
      </div>
      
      <button @click="goToOrders" class="btn">Zu meinen Bestellungen</button>
      <button @click="goHome" class="btn-secondary">Zur Startseite</button>
    </div>
    
    <div v-else>
      <p>Lade Bestelldaten...</p>
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

onMounted(async () => {
  const orderNumber = route.params.orderNumber
  
  if (orderNumber) {
    await fetchOrder(orderNumber)
  }
  
  // Fallback: Aus localStorage falls keine Route
  if (!order.value) {
    order.value = {
      orderNumber: localStorage.getItem('lastOrderNumber') || 'ORD-000001',
      orderDate: new Date().toISOString(),
      totalAmount: localStorage.getItem('lastOrderTotal') || '0.00',
      status: 'IN_BEARBEITUNG',
      items: JSON.parse(localStorage.getItem('lastOrderItems') || '[]')
    }
  }
  
  loading.value = false
})

const fetchOrder = async (orderNumber) => {
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`http://localhost:8081/api/product/order/${orderNumber}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (response.ok) {
      order.value = await response.json()
    }
  } catch (error) {
    console.error('Fehler beim Laden der Bestellung:', error)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('de-DE')
}

const goToOrders = () => {
  router.push('/orders')
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.order-confirmation {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.order-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.btn {
  background: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 1rem;
  margin-top: 1rem;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}
</style>