<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/" class="logo-link" aria-label="Startseite">
          <img src="../assets/Puppy_Racer_Logo.png" alt="PuppyRacer Logo" />
          <span class="logo-text">PuppyRacer</span>
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <div class="desktop-nav" v-if="!isMobile">
        <!-- Kategorien -->
        <div class="categories">
          <button 
            v-for="category in categories" 
            :key="category.path" 
            class="category-btn"
            @click="goToCategory(category.path)"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- Suchleiste -->
        <div class="search">
          <form @submit.prevent="handleSearch" class="search-form">
            <input 
              v-model="searchQuery" 
              placeholder="Hundezubehör suchen..." 
              class="search-input" 
              @keyup.enter="handleSearch"
            />
            <button type="submit" class="search-btn">
              <i class="bi bi-search"></i>
            </button>
          </form>
        </div>

        <!-- User Actions -->
        <div class="user-actions">
          <!-- Nicht eingeloggt: Login Button -->
          <div v-if="!isAuthenticated" class="auth-actions">
            <button @click="handleLogin" class="user-btn login-btn">
              <i class="bi bi-person"></i>
              <span class="btn-text">Login</span>
            </button>
          </div>
          
          <!-- Eingeloggt: User Menu -->
          <div v-else class="user-menu">
            <!-- Admin Button mit Dropdown (Profil ist im Dropdown enthalten) -->
            <div v-if="isAdmin" class="admin-btn-container">
              <button class="user-btn admin-btn" @click="toggleAdminMenu" :aria-expanded="adminMenuOpen">
                <i class="bi bi-shield"></i>
                <span class="btn-text">Admin</span>
                <i class="bi bi-chevron-down dropdown-icon" :class="{ 'rotate': adminMenuOpen }"></i>
              </button>
              
              <div v-if="adminMenuOpen" class="dropdown-menu">
                <router-link to="/admin/users" class="dropdown-item" @click="closeAdminMenu">
                  <i class="bi bi-people"></i> Benutzer
                </router-link>
                <router-link to="/admin/orders" class="dropdown-item" @click="closeAdminMenu">
                  <i class="bi bi-receipt"></i> Bestellungen
                </router-link>
                <router-link to="/admin/products" class="dropdown-item" @click="closeAdminMenu">
                  <i class="bi bi-box"></i> Produkte
                </router-link>
                <router-link to="/account" class="dropdown-item" @click="closeAdminMenu">
                  <i class="bi bi-person-circle"></i> Mein Profil
                </router-link>
              </div>
            </div>
            
            <!-- Normale User (KEIN Admin) - Nur Profil-Button -->
            <router-link v-if="!isAdmin" to="/account" class="user-btn account-btn">
              <i class="bi bi-person-circle"></i>
              <span class="btn-text">Profil</span>
            </router-link>
            
            <!-- Logout Button (für alle) -->
            <button @click="handleLogout" class="user-btn logout-btn">
              <i class="bi bi-box-arrow-right"></i>
              <span class="btn-text">Logout</span>
            </button>
          </div>
          
          <!-- Warenkorb -->
          <router-link to="/warenkorb" class="cart-btn">
            <i class="bi bi-cart3"></i>
            <span class="btn-text">Warenkorb</span>
            <span class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</span>
          </router-link>
        </div>
      </div>

      <!-- Burger Menu für Mobile -->
      <button class="burger-menu" @click="toggleMenu" :class="{ 'open': menuOpen }" v-if="isMobile">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Mobile Navigation -->
      <div class="mobile-nav" v-if="isMobile && menuOpen">
        <div class="mobile-search">
          <input v-model="searchQuery" placeholder="Suchen..." @keyup.enter="handleSearch" />
          <button @click="handleSearch">
            <i class="bi bi-search"></i>
          </button>
        </div>

        <div class="mobile-categories">
          <button v-for="category in categories" :key="category.path" 
                  @click="goToCategoryMobile(category.path)">
            {{ category.name }}
          </button>
        </div>

        <div class="mobile-user-actions">
          <div v-if="!isAuthenticated">
            <button @click="handleLogin">
              <i class="bi bi-person"></i>
              <span>Login / Registrieren</span>
            </button>
          </div>
          
          <div v-else>
            <!-- Profil Button (für alle User) -->
            <button @click="goToAccount">
              <i class="bi bi-person-circle"></i>
              <span>Mein Profil</span>
            </button>
            
            <!-- Admin Bereich (nur wenn Admin) -->
            <div v-if="isAdmin" class="admin-section">
              <div class="admin-title">
                <i class="bi bi-shield"></i>
                <span>Admin-Bereich</span>
              </div>
              <button @click="goToAdmin('users')">Benutzer</button>
              <button @click="goToAdmin('orders')">Bestellungen</button>
              <button @click="goToAdmin('products')">Produkte</button>
            </div>
            
            <button @click="goToCart">
              <i class="bi bi-cart3"></i>
              <span>Warenkorb</span>
              <span v-if="cartCount > 0">{{ cartCount }}</span>
            </button>
            
            <button @click="handleLogout" class="logout-btn">
              <i class="bi bi-box-arrow-right"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/Warenkorb'
import { useAuth0 } from '@auth0/auth0-vue'

const router = useRouter()
const cartStore = useCartStore()
const { loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently } = useAuth0()

// Refs
const isScrolled = ref(false)
const menuOpen = ref(false)
const adminMenuOpen = ref(false)
const searchQuery = ref('')
const isAdmin = ref(false)
const windowWidth = ref(window.innerWidth)

// Kategorien
const categories = [
  { name: 'Leinen', path: '/produkte/leinen' },
  { name: 'Halsbänder', path: '/produkte/halsbaender' },
  { name: 'Bekleidung', path: '/produkte/bekleidung' },
  { name: 'Snacks', path: '/produkte/snacks' }
]

// Computed
const cartCount = computed(() => cartStore.itemCount || 0)
const isMobile = computed(() => windowWidth.value < 900)

// Navigation Functions
const goToCategory = (path) => {
  router.push(path)
  closeAllMenus()
}

const goToCategoryMobile = (path) => {
  router.push(path)
  closeMenu()
}

const goToAccount = () => {
  router.push('/account')
  closeMenu()
}

const goToAdmin = (section) => {
  router.push(`/admin/${section}`)
  closeMenu()
}

const goToCart = () => {
  router.push('/warenkorb')
  closeMenu()
}

// Admin Check
async function checkAdminStatus() {
  if (!isAuthenticated.value) {
    isAdmin.value = false
    return
  }
  
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    if (response.ok) {
      const data = await response.json()
      isAdmin.value = data.role === 'ADMIN'
    }
  } catch (error) {
    isAdmin.value = false
  }
}

// Event Handlers
const handleScroll = () => isScrolled.value = window.scrollY > 50
const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (query) {
    router.push({ path: '/search', query: { q: query } })
    searchQuery.value = ''
    closeAllMenus()
  }
}
const handleLogin = () => {
  loginWithRedirect()
  closeAllMenus()
}
const handleLogout = () => {
  logout({ logoutParams: { returnTo: window.location.origin + '/frontend-puppyracer/' } })
  closeAllMenus()
}

// Menu Functions
const toggleMenu = () => menuOpen.value = !menuOpen.value
const toggleAdminMenu = () => adminMenuOpen.value = !adminMenuOpen.value
const closeMenu = () => menuOpen.value = false
const closeAdminMenu = () => adminMenuOpen.value = false
const closeAllMenus = () => {
  menuOpen.value = false
  adminMenuOpen.value = false
}

// Resize Handler
const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (windowWidth.value >= 900) menuOpen.value = false
}

// Watch
watch(isAuthenticated, (newVal) => {
  if (newVal) checkAdminStatus()
  else isAdmin.value = false
})

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
  handleScroll()
  if (isAuthenticated.value) checkAdminStatus()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Basis Navbar */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: var(--color-accent-brown);
  padding: 1rem 0;
  z-index: 1100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-height: 70px;
  display: flex;
  align-items: center;
}

.navbar.scrolled {
  padding: 0.6rem 0;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.navbar-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* Logo */
.logo-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.logo img {
  height: 45px;
  transition: transform 0.3s;
}

.logo-link:hover img {
  transform: scale(1.05);
}

.logo-text {
  font-family: var(--font-roboto);
  font-weight: 800;
  font-size: 1.6rem;
  color: var(--color-primary-dark);
  white-space: nowrap;
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 1rem;
  justify-content: flex-end;
}

/* Kategorien */
.categories {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  min-width: 0;
}

.category-btn {
  padding: 0.4rem 0.8rem;
  background: var(--color-background-light);
  color: var(--color-primary-dark);
  border: 2px solid var(--color-accent-brown);
  border-radius: 5px;
  font-family: var(--font-roboto);
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  flex-shrink: 0;
}

.category-btn:hover {
  background: var(--color-accent-pink);
  color: white;
  border-color: var(--color-accent-pink);
}

/* Suchleiste */
.search {
  flex: 1;
  min-width: 150px;
  max-width: 300px;
}

.search-form {
  display: flex;
  background: var(--color-background-light);
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--color-accent-brown);
}

.search-input {
  flex: 1;
  padding: 0.5rem 0.8rem;
  border: none;
  font-family: var(--font-roboto);
  font-size: 0.85rem;
  color: var(--color-primary-dark);
  background: transparent;
  min-width: 80px;
}

.search-input:focus {
  outline: none;
}

.search-btn {
  padding: 0 0.8rem;
  background: var(--color-accent-pink);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.search-btn:hover {
  background: #d04a7c;
}

/* User Actions */
.user-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

/* Buttons */
.user-btn, .cart-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.7rem;
  background: var(--color-background-light);
  color: var(--color-primary-dark);
  border: 2px solid var(--color-accent-brown);
  border-radius: 5px;
  cursor: pointer;
  font-family: var(--font-roboto);
  font-weight: 600;
  font-size: 0.75rem;
  transition: all 0.3s;
  white-space: nowrap;
  text-decoration: none;
  flex-shrink: 0;
}

.user-btn:hover, .cart-btn:hover {
  background: var(--color-accent-pink);
  color: white;
  border-color: var(--color-accent-pink);
}

.logout-btn:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.cart-btn {
  background: var(--color-accent-pink);
  color: white;
  border-color: var(--color-accent-pink);
}

.cart-btn:hover {
  background: white;
  color: var(--color-accent-pink);
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  font-size: 0.6rem;
  font-weight: 800;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-accent-brown);
}

/* Admin Dropdown */
.admin-btn-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.3rem;
  background: var(--color-background-light);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  z-index: 1001;
  border: 2px solid var(--color-accent-brown);
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  color: var(--color-primary-dark);
  text-decoration: none;
  border-bottom: 1px solid var(--color-accent-brown);
  font-size: 0.75rem;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: rgba(226, 97, 145, 0.1);
  color: var(--color-accent-pink);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-icon {
  font-size: 0.6rem;
  transition: transform 0.3s;
  margin-left: 0.2rem;
}

.dropdown-icon.rotate {
  transform: rotate(180deg);
}

/* Burger Menu */
.burger-menu {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.burger-menu span {
  width: 25px;
  height: 3px;
  background: var(--color-primary-dark);
  border-radius: 2px;
  transition: all 0.3s;
}

.burger-menu.open span:first-child {
  transform: rotate(45deg) translate(6px, 6px);
}

.burger-menu.open span:nth-child(2) {
  opacity: 0;
}

.burger-menu.open span:last-child {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Mobile Navigation */
.mobile-nav {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: var(--color-accent-brown);
  padding: 1.5rem;
  max-height: calc(100vh - 70px);
  overflow-y: auto;
  z-index: 999;
}

.mobile-search, .mobile-categories, .mobile-user-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.mobile-search {
  flex-direction: row;
}

.mobile-search input, .mobile-categories button, .mobile-user-actions button {
  padding: 0.75rem;
  border-radius: 6px;
  font-family: var(--font-roboto);
  border: 2px solid var(--color-accent-brown);
  background: var(--color-background-light);
  color: var(--color-primary-dark);
}

.mobile-search input {
  flex: 1;
}

.mobile-search button, .mobile-user-actions .logout-btn {
  background: var(--color-accent-pink);
  color: white;
  border: none;
  cursor: pointer;
}

.mobile-user-actions .logout-btn {
  background: var(--color-primary-dark);
}

.admin-section {
  padding: 1rem;
  background: rgba(255, 193, 7, 0.15);
  border: 2px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  margin: 0.5rem 0;
}

.admin-title {
  color: var(--color-primary-dark);
  font-weight: 700;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 1100px) {
  .btn-text {
    display: none;
  }
  
  .user-btn,
  .cart-btn {
    padding: 0.4rem 0.4rem;
  }
  
  .user-btn i,
  .cart-btn i {
    margin: 0;
  }
}

@media (max-width: 1000px) {
  .category-btn {
    font-size: 0.7rem;
    padding: 0.3rem 0.5rem;
  }
  
  .search {
    min-width: 120px;
  }
  
  .search-input {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .search-btn {
    padding: 0 0.6rem;
  }
}

@media (max-width: 899px) {
  .desktop-nav { display: none; }
  .burger-menu { display: flex; }
  
  .navbar-container {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0.6rem 0;
    min-height: 65px;
  }
  
  .navbar-container {
    padding: 0 0.75rem;
  }
  
  .logo img {
    height: 40px;
  }
  
  .logo-text {
    font-size: 1.4rem;
  }
  
  .mobile-nav {
    top: 65px;
    padding: 1rem;
  }
}
</style>