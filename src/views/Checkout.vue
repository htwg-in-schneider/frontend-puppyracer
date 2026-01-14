<template>
  <div class="checkout">
    <div class="container">
      <div class="header">
        <h1><i class="bi bi-cart-check"></i> Kasse</h1>
        <p>{{ itemCount }} Artikel • {{ total.toFixed(2) }} €</p>
      </div>

      <div v-if="cartItems.length === 0" class="empty-cart">
        <i class="bi bi-cart-x"></i>
        <h3>Ihr Warenkorb ist leer</h3>
        <p>Fügen Sie Produkte hinzu, um fortzufahren</p>
        <router-link to="/" class="btn-shop">
          <i class="bi bi-shop"></i> Zum Shop
        </router-link>
      </div>

      <div v-else class="checkout-grid">
        <!-- Artikel -->
        <section class="section">
          <h2><i class="bi bi-box"></i> Ihre Bestellung</h2>
          <div class="products">
            <div v-for="item in cartItems" :key="item.id" class="product">
              <img :src="getImageUrl(item.image)" :alt="item.name">
              <div>
                <h3>{{ item.name }}</h3>
                <p>{{ item.quantity }} × {{ item.price.toFixed(2) }} €</p>
              </div>
              <div>{{ (item.price * item.quantity).toFixed(2) }} €</div>
            </div>
          </div>
        </section>

        <!-- Formulare -->
        <div class="forms">
          <section class="form-section">
            <h3><i class="bi bi-person"></i> Persönliche Daten</h3>
            <div class="form-row">
              <input v-model="form.firstName" placeholder="Vorname *" required :disabled="loading">
              <input v-model="form.lastName" placeholder="Nachname *" required :disabled="loading">
            </div>
            <input v-model="form.email" type="email" placeholder="E-Mail *" required :disabled="loading">
            <input v-model="form.phone" placeholder="Telefon (optional)" :disabled="loading">
            <input v-model="form.street" placeholder="Straße *" required :disabled="loading">
            <div class="form-row">
              <input v-model="form.zipCode" placeholder="PLZ *" required :disabled="loading">
              <input v-model="form.city" placeholder="Stadt *" required :disabled="loading">
            </div>
            <input v-model="form.country" placeholder="Land" value="Deutschland" :disabled="loading">
          </section>

          <!-- Zahlung -->
          <section class="form-section">
            <h3><i class="bi bi-credit-card"></i> Zahlungsmethode</h3>
            <div class="payment-options">
              <button v-for="method in paymentMethods" :key="method.id"
                @click="form.paymentMethod = method.id"
                :class="{ active: form.paymentMethod === method.id }"
                :disabled="loading">
                <i :class="method.icon"></i> {{ method.name }}
              </button>
            </div>
          </section>
        </div>

        <!-- Zusammenfassung -->
        <section class="summary">
          <h2><i class="bi bi-receipt"></i> Zusammenfassung</h2>
          
          <div class="summary-row">
            <span>Zwischensumme</span>
            <span>{{ subtotal.toFixed(2) }} €</span>
          </div>
          <div class="summary-row">
            <span>Versand</span>
            <span>{{ shippingCost.toFixed(2) }} €</span>
          </div>
          <div class="summary-row total">
            <span>Gesamtsumme</span>
            <span><strong>{{ total.toFixed(2) }} €</strong></span>
          </div>

          <div class="terms">
            <input type="checkbox" v-model="acceptTerms" id="terms" required :disabled="loading">
            <label for="terms">Ich akzeptiere die AGB *</label>
          </div>

          <div v-if="error" class="error-message">
            <i class="bi bi-exclamation-triangle"></i>
            <span>{{ error }}</span>
          </div>

          <button @click="submitOrder" :disabled="!canSubmit || loading" class="order-btn">
            <i class="bi bi-lock"></i>
            {{ loading ? 'Wird verarbeitet...' : `Jetzt bestellen (${total.toFixed(2)} €)` }}
          </button>

          <p class="secure-note">
            <i class="bi bi-shield-check"></i> Sichere SSL-Verschlüsselung
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/Warenkorb.js'
import { useAuth0 } from '@auth0/auth0-vue'

const router = useRouter()
const cartStore = useCartStore()
const { getAccessTokenSilently, user: auth0User } = useAuth0()

// Formular-Daten
const form = reactive({
  firstName: '',
  lastName: '',
  email: auth0User.value?.email || '',
  phone: '',
  street: '',
  zipCode: '',
  city: '',
  country: 'Deutschland',
  paymentMethod: 'invoice' // Standard: Rechnung
})

const paymentMethods = [
  { id: 'invoice', name: 'Rechnung', icon: 'bi bi-receipt' },
  { id: 'creditcard', name: 'Kreditkarte', icon: 'bi bi-credit-card' },
  { id: 'paypal', name: 'PayPal', icon: 'bi bi-paypal' }
]

const acceptTerms = ref(false)
const loading = ref(false)
const error = ref('')

// Computed Properties
const cartItems = computed(() => cartStore.cartItems)
const itemCount = computed(() => cartStore.itemCount)
const subtotal = computed(() => cartStore.subtotal)
const shippingCost = computed(() => 4.99)
const total = computed(() => subtotal.value + shippingCost.value)

const canSubmit = computed(() => {
  const required = [
    form.firstName,
    form.lastName, 
    form.email,
    form.street,
    form.zipCode,
    form.city,
    form.paymentMethod
  ]
  return required.every(f => f && f.toString().trim()) && 
         acceptTerms.value && 
         cartItems.value.length > 0 &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
         /^[0-9]{5}$/.test(form.zipCode)
})

// Hilfsfunktionen
const getImageUrl = (imageName) => {
  if (!imageName) return '/placeholder.jpg'
  if (imageName.startsWith('http')) return imageName
  return `/frontend-puppyracer/product_pics/${imageName}`
}

// Bestellung abschicken
const submitOrder = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const token = await getAccessTokenSilently()
    
    // Order-Daten für Backend
    const orderData = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      street: form.street.trim(),
      zipCode: form.zipCode.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
      paymentMethod: form.paymentMethod,
      subtotal: subtotal.value,
      shippingCost: shippingCost.value,
      totalAmount: total.value,
      items: cartItems.value.map(item => ({
        productId: item.id,
        productName: item.name,
        productImage: item.image,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity)
      }))
    }

    console.log('Sending order to backend:', orderData)

    // POST an Backend
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      let errorMsg = `Bestellung fehlgeschlagen (Status: ${response.status})`
      try {
        const errorData = await response.json()
        errorMsg = errorData.message || errorMsg
      } catch {
        const text = await response.text()
        if (text) errorMsg = text
      }
      throw new Error(errorMsg)
    }

    const orderResult = await response.json()
    console.log('Order created successfully:', orderResult)

    // Warenkorb leeren
    cartStore.clearCart()

    // Zur Bestellbestätigung navigieren
    router.push({ 
      name: 'OrderConfirmation', 
      params: { id: orderResult.id }
    })

  } catch (err) {
    console.error('Order submission error:', err)
    error.value = `Fehler bei der Bestellung: ${err.message}`
  } finally {
    loading.value = false
  }
}

// User-Daten vorausfüllen
onMounted(() => {
  if (auth0User.value) {
    const nameParts = (auth0User.value.name || '').split(' ')
    if (nameParts.length >= 2) {
      form.firstName = nameParts[0]
      form.lastName = nameParts.slice(1).join(' ')
    } else if (nameParts.length === 1) {
      form.firstName = nameParts[0]
    }
    form.email = auth0User.value.email || ''
  }
})
</script>

<style scoped>
.checkout {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 80px 20px 40px;
  color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header h1 {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.header p {
  opacity: 0.8;
  font-size: 1.1rem;
}

.empty-cart {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.empty-cart i {
  font-size: 3rem;
  color: #e26191;
  margin-bottom: 1rem;
}

.empty-cart h3 {
  margin: 0 0 0.5rem 0;
}

.empty-cart p {
  opacity: 0.7;
  margin-bottom: 1.5rem;
}

.btn-shop {
  padding: 0.75rem 1.5rem;
  background: #e26191;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-shop:hover {
  background: #d05583;
}

.checkout-grid {
  display: grid;
  gap: 2rem;
}

@media (min-width: 768px) {
  .checkout-grid {
    grid-template-columns: 2fr 1fr;
  }
  
  .forms {
    grid-column: 1;
  }
  
  .summary {
    grid-column: 2;
    grid-row: 1 / span 2;
  }
}

.section, .form-section, .summary {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.section h2, .form-section h3, .summary h2 {
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.products {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.product img {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}

.product > div:nth-child(2) {
  flex: 1;
}

.product h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.product p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
}

.forms {
  display: grid;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

input, select {
  width: 100%;
  padding: 0.875rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  margin-bottom: 1rem;
}

input:focus {
  outline: none;
  border-color: #e26191;
  background: rgba(255, 255, 255, 0.15);
}

input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.payment-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

@media (max-width: 767px) {
  .payment-options {
    grid-template-columns: 1fr;
  }
}

.payment-options button {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.payment-options button.active {
  background: rgba(226, 97, 145, 0.2);
  border-color: #e26191;
  color: #e26191;
}

.payment-options button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
}

.payment-options button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.total {
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

.terms {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.terms input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 71, 87, 0.15);
  color: #ff6b6b;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.order-btn {
  width: 100%;
  padding: 1rem;
  background: #e26191;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.order-btn:hover:not(:disabled) {
  background: #d05583;
  transform: translateY(-2px);
}

.order-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secure-note {
  text-align: center;
  margin-top: 1rem;
  opacity: 0.7;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

@media (max-width: 767px) {
  .checkout {
    padding: 70px 1rem 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>