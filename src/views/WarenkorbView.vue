<!-- src/views/CartView.vue -->
<template>
  <div class="cart-page">
    <div class="container mt-5 pt-5">
      <h1>Warenkorb</h1>
      
      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="text-center py-5">
          <i class="bi bi-cart-x" style="font-size: 5rem; color: #ccc;"></i>
          <h3 class="mt-3">Ihr Warenkorb ist leer</h3>
          <p class="text-muted">Fügen Sie Produkte hinzu, um sie hier zu sehen.</p>
          <router-link to="/" class="btn btn-primary mt-3">
            Zurück zum Shop
          </router-link>
        </div>
      </div>
      
      <div v-else>
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item card mb-3">
            <div class="card-body d-flex align-items-center">
              <div class="item-image me-3">
                <img :src="item.image" :alt="item.name" style="width: 80px; height: 80px; object-fit: cover;">
              </div>
              <div class="item-details flex-grow-1">
                <h5 class="mb-1">{{ item.name }}</h5>
                <p class="text-muted mb-1">{{ item.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="quantity-controls">
                    <button @click="decreaseQuantity(item)" class="btn btn-sm btn-outline-secondary">-</button>
                    <span class="mx-2">{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item)" class="btn btn-sm btn-outline-secondary">+</button>
                  </div>
                  <div class="item-price">
                    <strong>{{ (item.price * item.quantity).toFixed(2) }} €</strong>
                  </div>
                  <button @click="removeItem(item)" class="btn btn-sm btn-danger">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="cart-summary card">
          <div class="card-body">
            <h4>Zusammenfassung</h4>
            <div class="d-flex justify-content-between mb-2">
              <span>Zwischensumme:</span>
              <span>{{ subtotal.toFixed(2) }} €</span>
            </div>
            <div class="d-flex justify-content-between mb-3">
              <span>Versand:</span>
              <span>{{ shipping.toFixed(2) }} €</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between mb-3">
              <strong>Gesamt:</strong>
              <strong>{{ total.toFixed(2) }} €</strong>
            </div>
            <button class="btn btn-primary btn-lg w-100" @click="checkout">
              Zur Kasse gehen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartView',
  data() {
    return {
      cartItems: [
        {
          id: 1,
          name: 'Premium Hundeleine',
          description: 'Robuste Leine für große Hunde',
          price: 24.99,
          quantity: 1,
          image: 'https://via.placeholder.com/80'
        },
        {
          id: 2,
          name: 'Hundehalsband',
          description: 'Verstellbares Lederhalsband',
          price: 19.99,
          quantity: 2,
          image: 'https://via.placeholder.com/80'
        }
      ],
      shipping: 4.99
    };
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    total() {
      return this.subtotal + this.shipping;
    }
  },
  methods: {
    increaseQuantity(item) {
      item.quantity++;
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
      }
    },
    removeItem(item) {
      this.cartItems = this.cartItems.filter(i => i.id !== item.id);
    },
    checkout() {
      alert('Checkout-Funktion würde hier implementiert werden!');
    }
  }
};
</script>

<style scoped>
.cart-page {
  min-height: 60vh;
  padding-top: 100px;
}

.empty-cart {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 3rem;
}

.cart-summary {
  max-width: 400px;
  margin-left: auto;
  margin-top: 2rem;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>