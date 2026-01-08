<template>
  <div class="checkout">
    <div class="header">
      <h1><i class="bi bi-cart-check"></i> Kasse</h1>
      <p class="subtitle">{{ itemCount }} Artikel • {{ total.toFixed(2) }}€</p>
    </div>

    <div class="checkout-content">
      <!-- Bestellte Produkte -->
      <div class="section">
        <h2><i class="bi bi-box"></i> Ihre Bestellung</h2>
        <div class="products">
          <div v-for="item in cartItems" :key="item.id" class="product">
            <img :src="item.image" :alt="item.name" class="product-img">
            <div class="product-info">
              <h3>{{ item.name }}</h3>
              <p>{{ item.quantity }} × {{ item.price.toFixed(2) }}€</p>
            </div>
            <div class="product-total">{{ (item.price * item.quantity).toFixed(2) }}€</div>
          </div>
        </div>
      </div>

      <!-- Formulare -->
      <div class="forms-grid">
        <!-- Persönliche Daten -->
        <div class="form-section">
          <h3><i class="bi bi-person"></i> Persönliche Daten</h3>
          <div class="form-group">
            <input v-model="form.firstName" placeholder="Vorname *" class="input" required>
            <input v-model="form.lastName" placeholder="Nachname *" class="input" required>
          </div>
          <input v-model="form.email" type="email" placeholder="E-Mail *" class="input full" required>
          <input v-model="form.phone" placeholder="Telefon" class="input full">
        </div>

        <!-- Adresse -->
        <div class="form-section">
          <h3><i class="bi bi-house"></i> Lieferadresse</h3>
          <input v-model="form.street" placeholder="Straße und Hausnummer *" class="input full" required>
          <div class="form-group">
            <input v-model="form.zip" placeholder="PLZ *" class="input" required>
            <input v-model="form.city" placeholder="Stadt *" class="input" required>
          </div>
          <select v-model="form.country" class="input full" required>
            <option value="">Land wählen</option>
            <option value="de">Deutschland</option>
            <option value="at">Österreich</option>
            <option value="ch">Schweiz</option>
          </select>
        </div>

        <!-- Zahlung -->
        <div class="form-section">
          <h3><i class="bi bi-credit-card"></i> Zahlung</h3>
          <div class="payment-options">
            <button @click="paymentMethod = 'creditcard'" :class="{ active: paymentMethod === 'creditcard' }">
              <i class="bi bi-credit-card"></i> Karte
            </button>
            <button @click="paymentMethod = 'paypal'" :class="{ active: paymentMethod === 'paypal' }">
              <i class="bi bi-paypal"></i> PayPal
            </button>
            <button @click="paymentMethod = 'invoice'" :class="{ active: paymentMethod === 'invoice' }">
              <i class="bi bi-receipt"></i> Rechnung
            </button>
          </div>
        </div>
      </div>

      <!-- Zusammenfassung -->
      <div class="summary">
        <h2><i class="bi bi-receipt"></i> Zusammenfassung</h2>
        
        <div class="summary-row">
          <span>Zwischensumme</span>
          <span>{{ subtotal.toFixed(2) }}€</span>
        </div>
        <div class="summary-row">
          <span>Versand</span>
          <span>4.99€</span>
        </div>
        <div class="summary-row total">
          <span>Gesamt</span>
          <span>{{ total.toFixed(2) }}€</span>
        </div>

        <div class="terms">
          <input type="checkbox" v-model="acceptTerms" id="terms" required>
          <label for="terms">Ich akzeptiere die AGB</label>
        </div>

        <button @click="submitOrder" :disabled="!canSubmit || loading" class="order-btn">
          <i class="bi bi-lock"></i>
          {{ loading ? 'Wird verarbeitet...' : `Jetzt zahlen (${total.toFixed(2)}€)` }}
        </button>

        <div v-if="error" class="error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/Warenkorb.js'
import { useAuth0 } from '@auth0/auth0-vue'

const router = useRouter()
const cartStore = useCartStore()
const { getAccessTokenSilently, user: auth0User } = useAuth0()

// Reaktive Daten
const form = reactive({
  firstName: '',
  lastName: '',
  email: auth0User.value?.email || '',
  phone: '',
  street: '',
  zip: '',
  city: '',
  country: 'de'
})

const paymentMethod = ref('creditcard')
const acceptTerms = ref(false)
const loading = ref(false)
const error = ref('')

// Computed Properties
const cartItems = computed(() => cartStore.cartItems)
const itemCount = computed(() => cartStore.itemCount)
const subtotal = computed(() => cartStore.subtotal)
const total = computed(() => subtotal.value + 4.99)

const canSubmit = computed(() => {
  return (
    form.firstName &&
    form.lastName &&
    form.email &&
    form.street &&
    form.zip &&
    form.city &&
    form.country &&
    acceptTerms.value &&
    cartItems.value.length > 0
  )
})

// Methoden
const submitOrder = async () => {
  if (!canSubmit.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    // 1. Token von Auth0 holen
    const token = await getAccessTokenSilently()
    
    // 2. Bestelldaten für Backend vorbereiten
    const orderData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      street: form.street,
      zipCode: form.zip,
      city: form.city,
      country: form.country === 'de' ? 'Deutschland' : 
              form.country === 'at' ? 'Österreich' : 'Schweiz',
      paymentMethod: paymentMethod.value,
      subtotal: subtotal.value,
      shippingCost: 4.99,
      total: total.value,
      items: cartItems.value.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    }
    
    // 3. An Backend senden
    const response = await fetch('http://localhost:8081/api/product/checkout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Bestellung fehlgeschlagen')
    }
    
    const result = await response.json()
    
    // 4. Erfolg - Daten für Bestätigungsseite speichern
    localStorage.setItem('lastOrderNumber', result.orderNumber)
    localStorage.setItem('lastOrderTotal', result.total)
    localStorage.setItem('lastOrderEmail', form.email)
    
    // 5. Warenkorb leeren
    cartStore.clearCart()
    
    // 6. Zur Startseite navigieren (später Bestätigungsseite)
    alert(`Bestellung #${result.orderNumber} erfolgreich!`)
    router.push('/')
    
  } catch (err) {
    error.value = 'Fehler: ' + err.message
    console.error('Checkout error:', err)
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
/* Grundlayout */
.checkout {
  min-height: 100vh;
  background: linear-gradient(135deg, #8b7355 0%, #a8916d 100%);
  padding: 100px 20px 40px;
  color: white;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  opacity: 0.9;
  font-size: 1.1rem;
}

/* Content */
.checkout-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 2rem;
}

/* Produkte */
.section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section h2 {
  margin-bottom: 1rem;
  font-size: 1.4rem;
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
  border-radius: 10px;
}

.product-img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.product-info p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
}

.product-total {
  font-weight: bold;
  font-size: 1.1rem;
}

/* Forms */
.forms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.form-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-family: inherit;
  margin-bottom: 1rem;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input.full {
  grid-column: 1 / -1;
}

select.input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

/* Zahlungsoptionen */
.payment-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.payment-options button {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-options button.active {
  background: rgba(226, 97, 145, 0.3);
  border-color: rgba(226, 97, 145, 0.5);
}

.payment-options button:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Zusammenfassung */
.summary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.summary h2 {
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-row.total {
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  border-bottom: none;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 0.5rem;
}

/* AGB */
.terms {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

/* Order Button */
.order-btn {
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(135deg, #e26191, #ff8fab);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1rem;
}

.order-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(226, 97, 145, 0.4);
}

.order-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Error */
.error {
  color: #ff6b6b;
  text-align: center;
  padding: 0.5rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .checkout {
    padding: 80px 15px 30px;
  }
  
  .forms-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group {
    grid-template-columns: 1fr;
  }
  
  .header h1 {
    font-size: 2rem;
  }
}
</style>