<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="navbar-logo">
        <router-link class="logo" to="/">
          <img src="../assets/Puppy_Racer_Logo.png" alt="Logo" />
          <span class="logo-text" v-if="!isScrolled">PuppyRacer</span>
        </router-link>
      </div>

      <!-- Burger Menu -->
      <button class="burger" @click="toggleMenu" :class="{ 'open': menuOpen }" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Navbar Content -->
      <div class="navbar-content" :class="{ 'show': menuOpen }">
        <!-- Kategorien -->
        <div class="navbar-categories" :class="{ 'hidden': isScrolled }">
          <div class="categories-wrapper">
            <router-link to="/leinen" class="nav-category" @click="menuOpen = false">
              Leinen
            </router-link>
            <router-link to="/halsbaender" class="nav-category" @click="menuOpen = false">
              Halsbänder
            </router-link>
            <router-link to="/bekleidung" class="nav-category" @click="menuOpen = false">
              Bekleidung
            </router-link>
            <router-link to="/snacks" class="nav-category" @click="menuOpen = false">
              Snacks
            </router-link>
          </div>
        </div>

        <!-- Suchleiste -->
        <div class="navbar-search" :class="{ 'hidden': isScrolled }">
          <form @submit.prevent="handleSearch">
            <div class="search-wrapper">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Hundezubehör suchen..."
                class="search-input"
                @keyup.enter="handleSearch"
              />
              <button type="submit" class="search-btn">
                <i class="bi bi-search"></i>
                <span class="search-text">Suchen</span>
              </button>
            </div>
          </form>
        </div>

        <!-- User Actions -->
        <div class="navbar-user">
          <router-link to="/account" class="user-action" @click="menuOpen = false">
            <i class="bi bi-person-circle"></i>
            <span class="action-text">Account</span>
          </router-link>
          <router-link to="/warenkorb" class="user-action cart-action" @click="menuOpen = false">
            <i class="bi bi-cart3"></i>
            <span class="action-text">Warenkorb</span>
            <span class="cart-badge" v-if="cartItemCount > 0">{{ cartItemCount }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router' // WICHTIG: Router importieren
import { useCartStore } from '@/stores/Warenkorb'

const router = useRouter()
const cartStore = useCartStore()
const isScrolled = ref(false)
const menuOpen = ref(false)
const searchQuery = ref('')

const cartItemCount = computed(() => {
  return cartStore.itemCount || 0
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 100
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

// SUCHFUNKTION - WICHTIG!
const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (query) {
    console.log('🚀 Suche nach:', query)
    
    // Zur Suchseite navigieren mit dem Suchbegriff
    router.push({
      path: '/search',
      query: {
        q: query
      }
    })
    
    // Suchfeld leeren und Menu schließen
    searchQuery.value = ''
    menuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ===== NAVBAR BASE ===== */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #cbbf9b;
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.navbar-scrolled {
  padding: 0.75rem 0;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

/* ===== LOGO ===== */
.navbar-logo {
  flex: 0 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.logo:hover {
  transform: translateY(-2px);
}

.logo img {
  height: 48px;
  transition: height 0.3s ease;
}

.navbar-scrolled .logo img {
  height: 40px;
}

.logo-text {
  font-family: "Roboto", sans-serif;
  font-weight: 800;
  font-size: 1.8rem;
  background: linear-gradient(135deg, #e26191, #d05583);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.navbar-scrolled .logo-text {
  font-size: 1.5rem;
}

/* ===== BURGER MENU ===== */
.burger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.burger span {
  width: 100%;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: left center;
}

.burger.open span:nth-child(1) {
  transform: rotate(45deg);
}

.burger.open span:nth-child(2) {
  opacity: 0;
}

.burger.open span:nth-child(3) {
  transform: rotate(-45deg);
}

/* ===== NAVBAR CONTENT ===== */
.navbar-content {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  gap: 2rem;
}

/* ===== CATEGORIES ===== */
.navbar-categories {
  flex: 0 0 auto;
  transition: all 0.3s ease;
}

.categories-wrapper {
  display: flex;
  gap: 0.75rem;
}

.nav-category {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
}

.nav-category:hover,
.nav-category.router-link-active {
  background: rgba(226, 97, 145, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* ===== SEARCH ===== */
.navbar-search {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  transition: all 0.3s ease;
}

.search-wrapper {
  display: flex;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  min-width: 0;
}

.search-input:focus {
  outline: none;
}

.search-btn {
  padding: 0 1.5rem;
  background: #e26191;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.search-btn:hover {
  background: #d05583;
}

.search-text {
  font-family: "Roboto", sans-serif;
  font-weight: 600;
}

/* ===== USER ACTIONS ===== */
.navbar-user {
  flex: 0 0 auto;
  display: flex;
  gap: 0.75rem;
  margin-left: auto;
}

.user-action {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
  position: relative;
}

.user-action:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.cart-action {
  position: relative;
}

/* ===== CART BADGE ===== */
.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4757;
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* ===== SCROLL STATES ===== */
.hidden {
  opacity: 0;
  visibility: hidden;
  height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  pointer-events: none;
}

/* ===== RESPONSIVE DESIGN ===== */

/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .navbar-container {
    max-width: 1600px;
    padding: 0 2rem;
  }
  
  .nav-category,
  .user-action {
    padding: 0.7rem 1.4rem;
    font-size: 1.05rem;
  }
  
  .search-btn {
    padding: 0 1.75rem;
  }
}

/* Desktop (1200px - 1439px) */
@media (max-width: 1439px) and (min-width: 1200px) {
  .navbar-container {
    padding: 0 1.5rem;
  }
  
  .categories-wrapper {
    gap: 0.5rem;
  }
  
  .nav-category {
    padding: 0.6rem 1rem;
    font-size: 0.95rem;
  }
}

/* Tablet Landscape (992px - 1199px) */
@media (max-width: 1199px) and (min-width: 992px) {
  .navbar-container {
    padding: 0 1.25rem;
    gap: 1.5rem;
  }
  
  .categories-wrapper {
    gap: 0.4rem;
  }
  
  .nav-category {
    padding: 0.5rem 0.9rem;
    font-size: 0.9rem;
  }
  
  .navbar-search {
    min-width: 250px;
    max-width: 400px;
  }
  
  .user-action {
    padding: 0.5rem 0.9rem;
    font-size: 0.9rem;
  }
  
  .search-text {
    display: none;
  }
  
  .search-btn {
    padding: 0 1.25rem;
  }
}

/* Tablet Portrait (768px - 991px) */
@media (max-width: 991px) and (min-width: 768px) {
  .burger {
    display: flex;
  }
  
  .navbar-content {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: #cbbf9b;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s ease;
    border-radius: 0 0 20px 20px;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
  }
  
  .navbar-content.show {
    transform: translateY(0);
    opacity: 1;
  }
  
  .navbar-categories,
  .navbar-search,
  .navbar-user {
    width: 100%;
  }
  
  .categories-wrapper {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .nav-category {
    width: 100%;
    text-align: center;
    justify-content: center;
    padding: 0.8rem;
    font-size: 1rem;
  }
  
  .navbar-search {
    max-width: 100%;
    min-width: 100%;
  }
  
  .search-text {
    display: inline;
  }
  
  .navbar-user {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .user-action {
    width: 100%;
    justify-content: center;
    padding: 0.8rem;
    font-size: 1rem;
  }
  
  .logo-text {
    font-size: 1.6rem;
  }
  
  .navbar-scrolled .logo-text {
    font-size: 1.4rem;
  }
}

/* Mobile Landscape (576px - 767px) */
@media (max-width: 767px) and (min-width: 576px) {
  .burger {
    display: flex;
  }
  
  .navbar-container {
    padding: 0 1rem;
    gap: 1rem;
  }
  
  .logo img {
    height: 42px;
  }
  
  .logo-text {
    font-size: 1.5rem;
  }
  
  .navbar-content {
    position: fixed;
    top: 75px;
    left: 0;
    right: 0;
    background: #cbbf9b;
    flex-direction: column;
    padding: 1.25rem;
    gap: 1.25rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s ease;
    border-radius: 0 0 15px 15px;
    max-height: calc(100vh - 75px);
    overflow-y: auto;
  }
  
  .navbar-content.show {
    transform: translateY(0);
    opacity: 1;
  }
  
  .navbar-categories,
  .navbar-search,
  .navbar-user {
    width: 100%;
  }
  
  .categories-wrapper {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .nav-category {
    width: 100%;
    text-align: center;
    padding: 0.75rem;
    font-size: 0.95rem;
  }
  
  .navbar-search {
    max-width: 100%;
  }
  
  .search-wrapper {
    flex-direction: column;
    border-radius: 8px;
    overflow: visible;
    gap: 0.5rem;
  }
  
  .search-input {
    border-radius: 8px;
    padding: 0.75rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .search-btn {
    border-radius: 8px;
    padding: 0.75rem;
    justify-content: center;
  }
  
  .navbar-user {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .user-action {
    width: 100%;
    justify-content: center;
    padding: 0.75rem;
    font-size: 0.95rem;
  }
  
  .cart-badge {
    width: 18px;
    height: 18px;
    font-size: 0.65rem;
    top: -5px;
    right: -5px;
  }
}

/* Mobile Portrait (unter 576px) */
@media (max-width: 575px) {
  .burger {
    display: flex;
    width: 28px;
    height: 22px;
  }
  
  .navbar {
    padding: 0.75rem 0;
  }
  
  .navbar-container {
    padding: 0 0.75rem;
    gap: 0.75rem;
  }
  
  .logo img {
    height: 38px;
  }
  
  .logo-text {
    font-size: 1.3rem;
    display: none; /* Auf sehr kleinen Screens ausblenden */
  }
  
  .navbar-scrolled .logo-text {
    font-size: 1.2rem;
  }
  
  .navbar-content {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: #cbbf9b;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s ease;
    border-radius: 0 0 12px 12px;
    max-height: calc(100vh - 70px);
    overflow-y: auto;
  }
  
  .navbar-content.show {
    transform: translateY(0);
    opacity: 1;
  }
  
  .navbar-categories,
  .navbar-search,
  .navbar-user {
    width: 100%;
  }
  
  .categories-wrapper {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .nav-category {
    width: 100%;
    text-align: center;
    padding: 0.7rem;
    font-size: 0.9rem;
  }
  
  .navbar-search {
    max-width: 100%;
  }
  
  .search-wrapper {
    flex-direction: column;
    border-radius: 8px;
    overflow: visible;
    gap: 0.5rem;
    background: transparent;
    box-shadow: none;
  }
  
  .search-input {
    border-radius: 8px;
    padding: 0.7rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .search-btn {
    border-radius: 8px;
    padding: 0.7rem;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .search-text {
    display: inline;
  }
  
  .navbar-user {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .user-action {
    width: 100%;
    justify-content: center;
    padding: 0.7rem;
    font-size: 0.9rem;
  }
  
  .action-text {
    display: inline; /* Immer anzeigen auf Mobile */
  }
  
  .cart-badge {
    width: 16px;
    height: 16px;
    font-size: 0.6rem;
    top: -4px;
    right: -4px;
  }
}

/* Extra kleine Screens (unter 375px) */
@media (max-width: 374px) {
  .navbar-container {
    padding: 0 0.5rem;
  }
  
  .logo img {
    height: 35px;
  }
  
  .burger {
    width: 26px;
    height: 20px;
  }
  
  .burger span {
    height: 2.5px;
  }
  
  .nav-category,
  .user-action {
    font-size: 0.85rem;
    padding: 0.6rem;
  }
  
  .search-input {
    font-size: 0.9rem;
    padding: 0.6rem;
  }
  
  .search-btn {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
}
</style>