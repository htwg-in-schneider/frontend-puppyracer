import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const cartItems = ref([])
  
  // Getters als computed properties
  const itemCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })
  
  const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })
  
  const total = computed(() => {
    const shipping = cartItems.value.length > 0 ? 4.99 : 0
    return subtotal.value + shipping
  })
  
  const shippingCost = computed(() => {
    return cartItems.value.length > 0 ? 4.99 : 0
  })
  
  const isEmpty = computed(() => cartItems.value.length === 0)
  
  // Actions
  const addToCart = (product) => {
    if (!product || !product.id) {
      console.error('Ungültiges Produkt:', product)
      return
    }
    
    const existingIndex = cartItems.value.findIndex(item => item.id === product.id)
    
    if (existingIndex !== -1) {
      // Produkt existiert bereits - Menge addieren
      const newQuantity = cartItems.value[existingIndex].quantity + (product.quantity || 1)
      cartItems.value[existingIndex].quantity = newQuantity
    } else {
      // Neues Produkt hinzufügen
      cartItems.value.push({
        id: product.id,
        name: product.name || product.title,
        price: parseFloat(product.price),
        image: product.image || product.imageUrl,
        description: product.description,
        category: product.category,
        quantity: product.quantity || 1
      })
    }
    
    // Persistenz (optional für localStorage)
    persistCart()
  }

  const removeFromCart = (productId) => {
    const index = cartItems.value.findIndex(item => item.id === productId)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
      persistCart()
    }
  }

  const increaseQuantity = (productId) => {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      item.quantity++
      persistCart()
    }
  }

  const decreaseQuantity = (productId) => {
    const item = cartItems.value.find(item => item.id === productId)
    if (item && item.quantity > 1) {
      item.quantity--
      persistCart()
    } else if (item && item.quantity === 1) {
      removeFromCart(productId)
    }
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      item.quantity = parseInt(quantity)
      persistCart()
    }
  }

  const clearCart = () => {
    cartItems.value = []
    persistCart()
  }

  const getItem = (productId) => {
    return cartItems.value.find(item => item.id === productId)
  }

  const persistCart = () => {
    try {
      localStorage.setItem('puppyracer-cart', JSON.stringify(cartItems.value))
    } catch (error) {
      console.warn('Konnte Warenkorb nicht speichern:', error)
    }
  }

  const loadCart = () => {
    try {
      const saved = localStorage.getItem('puppyracer-cart')
      if (saved) {
        cartItems.value = JSON.parse(saved)
      }
    } catch (error) {
      console.warn('Konnte Warenkorb nicht laden:', error)
    }
  }

  // Initial load
  loadCart()

  return {
    // State
    cartItems,
    
    // Getters
    itemCount,
    subtotal,
    total,
    shippingCost,
    isEmpty,
    
    // Actions
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    getItem,
    loadCart,
    persistCart
  }
}, {
  persist: {
    key: 'puppyracer-cart',
    storage: localStorage,
    paths: ['cartItems']
  }
})