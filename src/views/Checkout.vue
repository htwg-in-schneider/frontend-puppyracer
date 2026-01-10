<template>
  <div class="checkout">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <router-link to="/warenkorb" class="breadcrumb-link">Warenkorb</router-link>
      <span class="separator">/</span>
      <span class="current">Kasse</span>
    </nav>

    <!-- Header -->
    <div class="header">
      <h1><i class="bi bi-cart-check" aria-hidden="true"></i> Kasse</h1>
      <p class="subtitle">{{ itemCount }} Artikel • {{ total.toFixed(2) }} €</p>
    </div>

    <!-- Content -->
    <div class="checkout-content">
      <!-- Bestellte Produkte -->
      <section class="section" aria-labelledby="order-title">
        <h2 id="order-title"><i class="bi bi-box" aria-hidden="true"></i> Ihre Bestellung</h2>
        <div class="products" role="list">
          <div v-for="item in cartItems" :key="item.id" class="product" role="listitem">
            <img :src="item.image" :alt="`Bild von ${item.name}`" class="product-img">
            <div class="product-info">
              <h3>{{ item.name }}</h3>
              <p>{{ item.quantity }} × {{ item.price.toFixed(2) }} €</p>
            </div>
            <div class="product-total">{{ (item.price * item.quantity).toFixed(2) }} €</div>
          </div>
        </div>
      </section>

      <!-- Formulare -->
      <div class="forms-grid">
        <!-- Persönliche Daten -->
        <section class="form-section" aria-labelledby="personal-title">
          <h3 id="personal-title"><i class="bi bi-person" aria-hidden="true"></i> Persönliche Daten</h3>
          <div class="form-group">
            <div class="input-wrapper">
              <label for="first-name" class="sr-only">Vorname</label>
              <input 
                id="first-name"
                v-model="form.firstName" 
                placeholder="Vorname *" 
                class="input" 
                required
                aria-required="true"
                :disabled="loading"
              >
            </div>
            <div class="input-wrapper">
              <label for="last-name" class="sr-only">Nachname</label>
              <input 
                id="last-name"
                v-model="form.lastName" 
                placeholder="Nachname *" 
                class="input" 
                required
                aria-required="true"
                :disabled="loading"
              >
            </div>
          </div>
          <div class="input-wrapper">
            <label for="email" class="sr-only">E-Mail</label>
            <input 
              id="email"
              v-model="form.email" 
              type="email" 
              placeholder="E-Mail *" 
              class="input full" 
              required
              aria-required="true"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              :disabled="loading"
            >
          </div>
          <div class="input-wrapper">
            <label for="phone" class="sr-only">Telefon</label>
            <input 
              id="phone"
              v-model="form.phone" 
              placeholder="Telefon (optional)" 
              class="input full"
              type="tel"
              pattern="[0-9+\s\-()]+"
              :disabled="loading"
            >
          </div>
        </section>

        <!-- Adresse -->
        <section class="form-section" aria-labelledby="address-title">
          <h3 id="address-title"><i class="bi bi-house" aria-hidden="true"></i> Lieferadresse</h3>
          <div class="input-wrapper">
            <label for="street" class="sr-only">Straße und Hausnummer</label>
            <input 
              id="street"
              v-model="form.street" 
              placeholder="Straße und Hausnummer *" 
              class="input full" 
              required
              aria-required="true"
              :disabled="loading"
            >
          </div>
          <div class="form-group">
            <div class="input-wrapper">
              <label for="zip" class="sr-only">PLZ</label>
              <input 
                id="zip"
                v-model="form.zip" 
                placeholder="PLZ *" 
                class="input" 
                required
                aria-required="true"
                pattern="[0-9]{5}"
                :disabled="loading"
              >
            </div>
            <div class="input-wrapper">
              <label for="city" class="sr-only">Stadt</label>
              <input 
                id="city"
                v-model="form.city" 
                placeholder="Stadt *" 
                class="input" 
                required
                aria-required="true"
                :disabled="loading"
              >
            </div>
          </div>
          <div class="input-wrapper">
            <label for="country" class="sr-only">Land</label>
            <select 
              id="country"
              v-model="form.country" 
              class="input full" 
              required
              aria-required="true"
              :disabled="loading"
            >
              <option value="" disabled>Land wählen *</option>
              <option value="de">Deutschland</option>
              <option value="at">Österreich</option>
              <option value="ch">Schweiz</option>
            </select>
          </div>
        </section>

        <!-- Zahlung -->
        <section class="form-section" aria-labelledby="payment-title">
          <h3 id="payment-title"><i class="bi bi-credit-card" aria-hidden="true"></i> Zahlungsmethode</h3>
          <div class="payment-options" role="radiogroup" aria-label="Zahlungsmethode wählen">
            <button 
              type="button"
              @click="paymentMethod = 'creditcard'" 
              :class="{ active: paymentMethod === 'creditcard' }"
              :aria-pressed="paymentMethod === 'creditcard'"
              :disabled="loading"
            >
              <i class="bi bi-credit-card" aria-hidden="true"></i> Kreditkarte
            </button>
            <button 
              type="button"
              @click="paymentMethod = 'paypal'" 
              :class="{ active: paymentMethod === 'paypal' }"
              :aria-pressed="paymentMethod === 'paypal'"
              :disabled="loading"
            >
              <i class="bi bi-paypal" aria-hidden="true"></i> PayPal
            </button>
            <button 
              type="button"
              @click="paymentMethod = 'invoice'" 
              :class="{ active: paymentMethod === 'invoice' }"
              :aria-pressed="paymentMethod === 'invoice'"
              :disabled="loading"
            >
              <i class="bi bi-receipt" aria-hidden="true"></i> Rechnung
            </button>
          </div>
        </section>
      </div>

      <!-- Zusammenfassung -->
      <section class="summary" aria-labelledby="summary-title">
        <h2 id="summary-title"><i class="bi bi-receipt" aria-hidden="true"></i> Zusammenfassung</h2>
        
        <div class="summary-row">
          <span>Zwischensumme</span>
          <span>{{ subtotal.toFixed(2) }} €</span>
        </div>
        <div class="summary-row">
          <span>Versandkosten</span>
          <span>4,99 €</span>
        </div>
        <div class="summary-row total">
          <span>Gesamtsumme</span>
          <span><strong>{{ total.toFixed(2) }} €</strong></span>
        </div>

        <!-- AGB -->
        <div class="terms">
          <input 
            type="checkbox" 
            v-model="acceptTerms" 
            id="terms" 
            required
            aria-required="true"
            :disabled="loading"
          >
          <label for="terms">
            Ich akzeptiere die 
            <router-link to="/agb" class="terms-link">AGB</router-link>
            und habe die 
            <router-link to="/datenschutz" class="terms-link">Datenschutzerklärung</router-link>
            zur Kenntnis genommen *
          </label>
        </div>

        <!-- Newsletter -->
        <div class="newsletter" v-if="!loading">
          <input 
            type="checkbox" 
            v-model="acceptNewsletter" 
            id="newsletter"
          >
          <label for="newsletter">
            Ich möchte den PuppyRacer Newsletter mit exklusiven Angeboten erhalten
          </label>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message" role="alert" aria-live="assertive">
          <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
          <span>{{ error }}</span>
        </div>

        <!-- Order Button -->
        <button 
          @click="submitOrder" 
          :disabled="!canSubmit || loading" 
          class="order-btn"
          aria-label="Bestellung abschließen und bezahlen"
        >
          <i class="bi bi-lock" aria-hidden="true"></i>
          {{ loading ? 'Wird verarbeitet...' : `Jetzt zahlen (${total.toFixed(2)} €)` }}
        </button>

        <!-- Sicherheitshinweis -->
        <div class="security-note">
          <i class="bi bi-shield-check" aria-hidden="true"></i>
          <span>Sicher bezahlen mit SSL-Verschlüsselung</span>
        </div>
      </section>
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
const acceptNewsletter = ref(false)
const loading = ref(false)
const error = ref('')

// Computed Properties
const cartItems = computed(() => cartStore.cartItems)
const itemCount = computed(() => cartStore.itemCount)
const subtotal = computed(() => cartStore.subtotal)
const total = computed(() => {
  const shipping = cartItems.value.length > 0 ? 4.99 : 0
  return subtotal.value + shipping
})

const canSubmit = computed(() => {
  const requiredFields = [
    form.firstName.trim(),
    form.lastName.trim(),
    form.email.trim(),
    form.street.trim(),
    form.zip.trim(),
    form.city.trim(),
    form.country.trim()
  ]
  
  return requiredFields.every(field => field.length > 0) && 
         acceptTerms.value && 
         cartItems.value.length > 0
})

// Methoden
const validateForm = () => {
  const errors = []
  
  if (!form.firstName.trim()) errors.push('Vorname ist erforderlich')
  if (!form.lastName.trim()) errors.push('Nachname ist erforderlich')
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.push('E-Mail ist erforderlich')
  } else if (!emailRegex.test(form.email)) {
    errors.push('Bitte geben Sie eine gültige E-Mail ein')
  }
  
  if (!form.street.trim()) errors.push('Straße ist erforderlich')
  
  const zipRegex = /^[0-9]{5}$/
  if (!form.zip.trim()) {
    errors.push('PLZ ist erforderlich')
  } else if (!zipRegex.test(form.zip)) {
    errors.push('PLZ muss 5 Ziffern haben')
  }
  
  if (!form.city.trim()) errors.push('Stadt ist erforderlich')
  if (!acceptTerms.value) errors.push('AGB müssen akzeptiert werden')
  if (cartItems.value.length === 0) errors.push('Warenkorb ist leer')
  
  return errors
}

const submitOrder = async () => {
  const validationErrors = validateForm()
  if (validationErrors.length > 0) {
    error.value = validationErrors.join(', ')
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const token = await getAccessTokenSilently()
    
    const orderData = {
      customer: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null
      },
      shippingAddress: {
        street: form.street.trim(),
        zipCode: form.zip.trim(),
        city: form.city.trim(),
        country: form.country === 'de' ? 'Deutschland' : 
                form.country === 'at' ? 'Österreich' : 'Schweiz'
      },
      payment: {
        method: paymentMethod.value,
        status: 'pending'
      },
      order: {
        subtotal: subtotal.value,
        shippingCost: 4.99,
        total: total.value,
        items: cartItems.value.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }))
      },
      preferences: {
        newsletter: acceptNewsletter.value
      }
    }
    
    const response = await fetch('http://localhost:8081/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Bestellung fehlgeschlagen (${response.status})`)
    }
    
    const result = await response.json()
    
    // Bestätigung speichern
    localStorage.setItem('lastOrder', JSON.stringify({
      orderNumber: result.orderNumber,
      total: result.total,
      email: form.email,
      date: new Date().toISOString()
    }))
    
    // Warenkorb leeren
    cartStore.clearCart()
    
    // Zur Bestätigungsseite navigieren
    router.push({
      name: 'OrderConfirmation',
      params: { orderNumber: result.orderNumber }
    })
    
  } catch (err) {
    console.error('Checkout error:', err)
    error.value = `Fehler bei der Bestellung: ${err.message}. Bitte versuchen Sie es erneut oder kontaktieren Sie unseren Support.`
  } finally {
    loading.value = false
  }
}

// Formular mit gespeicherten Daten vorausfüllen
onMounted(() => {
  if (auth0User.value) {
    const nameParts = (auth0User.value.name || '').split(' ')
    if (nameParts.length >= 2) {
      form.firstName = nameParts[0]
      form.lastName = nameParts.slice(1).join(' ')
    }
    form.email = auth0User.value.email || ''
  }
})
</script>

<style scoped>
.checkout {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, #2d3748 100%);
  padding: 120px 20px 40px;
  color: var(--color-background-light);
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.breadcrumb-link {
  color: var(--color-accent-pink);
  text-decoration: none;
  transition: opacity 0.2s;
}

.breadcrumb-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.separator {
  opacity: 0.5;
}

.current {
  font-weight: 600;
  opacity: 0.8;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 2.5rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.subtitle {
  opacity: 0.8;
  font-size: 1.1rem;
  font-weight: 300;
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
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.products {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: background-color 0.2s;
}

.product:hover {
  background: rgba(255, 255, 255, 0.08);
}

.product-img {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.product-info {
  flex: 1;
}

.product-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.product-info p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
}

.product-total {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--color-accent-pink);
}

/* Forms Grid */
.forms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-section {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.form-section h3 {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.input-wrapper {
  position: relative;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: var(--color-background-light);
  font-family: inherit;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input:focus {
  outline: none;
  border-color: var(--color-accent-pink);
  box-shadow: 0 0 0 3px rgba(226, 97, 145, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

/* Payment Options */
.payment-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.payment-options button {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: var(--color-background-light);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.payment-options button.active {
  background: rgba(226, 97, 145, 0.2);
  border-color: var(--color-accent-pink);
  color: var(--color-accent-pink);
}

.payment-options button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
}

.payment-options button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.payment-options button i {
  font-size: 1.5rem;
}

/* Summary */
.summary {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.summary h2 {
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  font-weight: 700;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

.summary-row.total strong {
  color: var(--color-accent-pink);
}

/* Terms & Newsletter */
.terms, .newsletter {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.terms input, .newsletter input {
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.terms label, .newsletter label {
  font-size: 0.95rem;
  line-height: 1.4;
}

.terms-link {
  color: var(--color-accent-pink);
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 71, 87, 0.15);
  color: #ff6b6b;
  padding: 1rem;
  border-radius: 10px;
  margin: 1rem 0;
  border: 1px solid rgba(255, 71, 87, 0.3);
}

.error-message i {
  font-size: 1.2rem;
  flex-shrink: 0;
}

/* Order Button */
.order-btn {
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(135deg, var(--color-accent-pink), #ff8fab);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.order-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(226, 97, 145, 0.4);
}

.order-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Security Note */
.security-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-top: 1rem;
}

.security-note i {
  color: #2ed573;
}

/* Responsive */
@media (max-width: 992px) {
  .forms-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .checkout {
    padding: 100px 1rem 2rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .form-group {
    grid-template-columns: 1fr;
  }
  
  .payment-options {
    grid-template-columns: 1fr;
  }
  
  .product {
    grid-template-columns: auto 1fr;
  }
  
  .product-total {
    grid-column: 2;
    justify-self: end;
  }
}

@media (max-width: 480px) {
  .header h1 {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .section, .form-section, .summary {
    padding: 1.25rem;
  }
}
</style>