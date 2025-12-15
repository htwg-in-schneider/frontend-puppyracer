import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: []
  }),

  getters: {
    itemCount: (state) => {
      return state.cartItems.reduce((total, item) => total + item.quantity, 0)
    },
    subtotal: (state) => {
      return state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    total: (state) => {
      return state.subtotal + 4.99
    }
  },

  actions: {
    addToCart(product) {
      console.log('Add to Cart aufgerufen mit:', product)
      
      // Finde ob Produkt bereits existiert
      const existingIndex = this.cartItems.findIndex(item => item.id === product.id)
      
      if (existingIndex !== -1) {
        // Produkt existiert bereits - Menge addieren
        console.log('Produkt existiert bereits. Alte Menge:', this.cartItems[existingIndex].quantity)
        console.log('Neue Menge hinzufügen:', product.quantity)
        
        this.cartItems[existingIndex].quantity += product.quantity
        console.log('Neue Gesamtmenge:', this.cartItems[existingIndex].quantity)
      } else {
        // Neues Produkt hinzufügen
        console.log('Neues Produkt hinzufügen')
        this.cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          category: product.category,
          quantity: product.quantity
        })
      }
      
      console.log('Aktueller Warenkorb:', this.cartItems)
    },

    removeFromCart(productId) {
      this.cartItems = this.cartItems.filter(item => item.id !== productId)
    },

    increaseQuantity(productId) {
      const item = this.cartItems.find(item => item.id === productId)
      if (item) {
        item.quantity++
      }
    },

    decreaseQuantity(productId) {
      const item = this.cartItems.find(item => item.id === productId)
      if (item && item.quantity > 1) {
        item.quantity--
      }
    },

    clearCart() {
      this.cartItems = []
    }
  }
})