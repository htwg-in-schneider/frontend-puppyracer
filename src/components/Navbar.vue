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
        <!-- Kategorien als Buttons -->
        <div class="categories">
          <button 
            v-for="category in categories" 
            :key="category.path" 
            class="category-btn"
            @click="goToCategory(category.path)"
            :aria-label="`Zu ${category.name} navigieren`"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- Suchleiste -->
        <div class="search">
          <form @submit.prevent="handleSearch" class="search-form" role="search">
            <input 
              v-model="searchQuery" 
              placeholder="Hundezubehör suchen..." 
              class="search-input" 
              @keyup.enter="handleSearch"
              aria-label="Suchbegriff"
            />
            <button type="submit" class="search-btn" aria-label="Suchen">
              <i class="bi bi-search"></i>
            </button>
          </form>
        </div>

        <!-- User Actions -->
        <div class="user-actions">
          <!-- Authentifizierung -->
          <div v-if="!isAuthenticated" class="auth-actions">
            <button @click="handleLogin" class="user-btn login-btn" aria-label="Login">
              <i class="bi bi-person"></i>
              <span class="btn-text">Login</span>
            </button>
          </div>
          
          <div v-else class="user-menu">
            <!-- Admin Menu -->
            <div v-if="isAdmin" class="admin-dropdown">
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
              </div>
            </div>
            
            <!-- User Profile -->
            <router-link to="/account" class="user-btn account-btn" aria-label="Mein Konto">
              <i class="bi bi-person-circle"></i>
              <span class="btn-text">Konto</span>
            </router-link>
            
            <!-- Logout -->
            <button @click="handleLogout" class="user-btn logout-btn" aria-label="Abmelden">
              <i class="bi bi-box-arrow-right"></i>
              <span class="btn-text">Logout</span>
            </button>
          </div>
          
          <!-- Warenkorb -->
          <router-link to="/warenkorb" class="cart-btn" aria-label="Warenkorb">
            <i class="bi bi-cart3"></i>
            <span class="btn-text">Warenkorb</span>
            <span class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</span>
          </router-link>
        </div>
      </div>

      <!-- Burger Menu für Mobile -->
      <button 
        class="burger-menu" 
        @click="toggleMenu" 
        :class="{ 'open': menuOpen }"
        :aria-label="menuOpen ? 'Menü schließen' : 'Menü öffnen'"
        v-if="isMobile"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Mobile Navigation -->
      <div class="mobile-nav" v-if="isMobile && menuOpen">
        <!-- Suchleiste -->
        <div class="mobile-search">
          <input 
            v-model="searchQuery" 
            placeholder="Suchen..." 
            class="mobile-search-input"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="mobile-search-btn">
            <i class="bi bi-search"></i>
          </button>
        </div>

        <!-- Kategorien -->
        <div class="mobile-categories">
          <button 
            v-for="category in categories" 
            :key="category.path" 
            class="mobile-category-btn"
            @click="goToCategoryMobile(category.path)"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- User Actions -->
        <div class="mobile-user-actions">
          <div v-if="!isAuthenticated">
            <button @click="handleLogin" class="mobile-btn login-mobile">
              <i class="bi bi-person"></i>
              <span>Login / Registrieren</span>
            </button>
          </div>
          
          <div v-else>
            <button @click="goToAccount" class="mobile-nav-item">
              <i class="bi bi-person-circle"></i>
              <span>Mein Profil</span>
            </button>
            
            <div v-if="isAdmin" class="admin-section">
              <div class="admin-title">
                <i class="bi bi-shield"></i>
                <span>Admin-Bereich</span>
              </div>
              <button @click="goToAdmin('users')" class="mobile-nav-subitem">
                Benutzer
              </button>
              <button @click="goToAdmin('orders')" class="mobile-nav-subitem">
                Bestellungen
              </button>
              <button @click="goToAdmin('products')" class="mobile-nav-subitem">
                Produkte
              </button>
            </div>
            
            <button @click="handleLogout" class="mobile-btn logout">
              <i class="bi bi-box-arrow-right"></i>
              <span>Logout</span>
            </button>
          </div>
          
          <button @click="goToCart" class="mobile-nav-item cart-item">
            <div>
              <i class="bi bi-cart3"></i>
              <span>Warenkorb</span>
            </div>
            <span class="badge" v-if="cartCount > 0">{{ cartCount }}</span>
          </button>
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
const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0()

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

// Admin Check - Direkt aus Auth0 User Object
async function checkAdminStatus() {
  console.log('checkAdminStatus called')
  
  if (!isAuthenticated.value) {
    console.log('User not authenticated')
    isAdmin.value = false
    return
  }
  
  console.log('User is authenticated, checking roles...')
  console.log('User object:', user.value)
  
  // 1. Direkt aus Auth0 User Object lesen (Standard-Weg)
  const rolesClaimPaths = [
    'puppyracer/roles',
    'https://puppyracer.api/roles',
    'https://puppyracer.com/roles',
    'roles'
  ]
  
  let userRoles = []
  
  // Alle möglichen Role-Pfade prüfen
  rolesClaimPaths.forEach(path => {
    if (user.value && user.value[path]) {
      console.log(`Found roles at path '${path}':`, user.value[path])
      const roles = user.value[path]
      if (Array.isArray(roles)) {
        userRoles = [...userRoles, ...roles]
      } else if (typeof roles === 'string') {
        userRoles.push(roles)
      }
    }
  })
  
  console.log('All found roles:', userRoles)
  
  // Admin prüfen
  isAdmin.value = userRoles.includes('ADMIN') || userRoles.includes('admin')
  console.log('Admin status from Auth0:', isAdmin.value)
  
  // 2. Fallback: Backend /api/profile versuchen (wenn Auth0 keine Roles hat)
  if (userRoles.length === 0) {
    console.log('No roles found in Auth0, trying backend...')
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const userData = await response.json()
        console.log('Backend user data:', userData)
        isAdmin.value = userData.role === 'ADMIN'
        console.log('Admin status from backend:', isAdmin.value)
      } else {
        console.log('Backend returned status:', response.status)
      }
    } catch (error) {
      console.log('Backend call failed:', error.message)
    }
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
  logout({ 
    logoutParams: { 
      returnTo: window.location.origin + window.location.pathname 
    }
  })
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

// Watch for authentication changes
watch(isAuthenticated, (newVal) => {
  if (newVal) {
    console.log('User logged in, checking admin status...')
    checkAdminStatus()
  } else {
    console.log('User logged out')
    isAdmin.value = false
  }
})

// Watch for user object changes
watch(user, () => {
  if (isAuthenticated.value) {
    console.log('User object updated, rechecking admin status...')
    checkAdminStatus()
  }
})

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
  handleScroll()
  
  // Initial check
  if (isAuthenticated.value) {
    checkAdminStatus()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Basis Navbar - HÖHER und mit deinen Farben */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: var(--color-accent-brown); /* #B48665 - HELLBRAUN */
  padding: 1.25rem 0; /* MEHR PADDING = HÖHER */
  z-index: 1100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-height: 80px; /* Mindesthöhe */
  display: flex;
  align-items: center;
}

.navbar.scrolled {
  padding: 0.75rem 0;
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
}

/* Logo - etwas größer für höhere Navbar */
.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo img {
  height: 50px; /* Größeres Logo */
  width: auto;
  transition: transform 0.3s;
}

.logo-link:hover img {
  transform: scale(1.05);
}

.logo-text {
  font-family: var(--font-roboto);
  font-weight: 800;
  font-size: 1.8rem; /* Größere Schrift */
  color: var(--color-primary-dark); /* #2D2121 */
  letter-spacing: -0.5px;
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  margin-left: 2rem;
}

/* Kategorien als Buttons - KLEINER & DEINE FARBEN */
.categories {
  display: flex;
  gap: 0.5rem;
}

.category-btn {
  padding: 0.5rem 1rem; /* KLEINER */
  background: var(--color-background-light); /* #EFE1D6 - CREME */
  color: var(--color-primary-dark); /* #2D2121 */
  border: 2px solid var(--color-accent-brown); /* #B48665 - Rahmen */
  border-radius: 6px; /* Weniger rund */
  font-family: var(--font-roboto);
  font-weight: 600;
  font-size: 0.85rem; /* Kleinere Schrift */
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.category-btn:hover {
  background: var(--color-accent-pink); /* #E26191 */
  color: white;
  border-color: var(--color-accent-pink);
  transform: translateY(-1px);
}

.category-btn:active {
  transform: translateY(0);
}

/* Suchleiste */
.search {
  flex: 1;
  max-width: 400px;
  min-width: 200px;
}

.search-form {
  display: flex;
  background: var(--color-background-light); /* #EFE1D6 */
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--color-accent-brown); /* #B48665 */
}

.search-input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  font-family: var(--font-roboto);
  font-size: 0.9rem;
  color: var(--color-primary-dark);
  background: transparent;
}

.search-input:focus {
  outline: none;
}

.search-input::placeholder {
  color: #888;
}

.search-btn {
  padding: 0 1rem;
  background: var(--color-accent-pink); /* #E26191 */
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.search-btn:hover {
  background: #d04a7c; /* Dunkleres Pink */
}

/* User Actions */
.user-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Gemeinsame Button-Stile - DEINE FARBEN */
.user-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem; /* KLEINER */
  background: var(--color-background-light); /* #EFE1D6 */
  color: var(--color-primary-dark); /* #2D2121 */
  border: 2px solid var(--color-accent-brown); /* #B48665 */
  border-radius: 6px;
  cursor: pointer;
  font-family: var(--font-roboto);
  font-weight: 600;
  font-size: 0.8rem; /* Kleinere Schrift */
  transition: all 0.3s;
  white-space: nowrap;
}

.user-btn:hover {
  background: var(--color-accent-pink); /* #E26191 */
  color: white;
  border-color: var(--color-accent-pink);
}

/* Spezifische Buttons */
.login-btn:hover {
  background: var(--color-accent-pink);
}

.logout-btn:hover {
  background: var(--color-primary-dark); /* #2D2121 */
  border-color: var(--color-primary-dark);
}

.account-btn {
  text-decoration: none;
}

/* Admin Button */
.admin-btn {
  background: var(--color-background-light); /* #EFE1D6 */
  border-color: var(--color-accent-brown); /* #B48665 */
  position: relative;
}

.admin-btn:hover {
  background: rgba(255, 193, 7, 0.2);
  border-color: #ffc107;
}

.dropdown-icon {
  font-size: 0.7rem;
  transition: transform 0.3s;
  margin-left: 0.25rem;
}

.dropdown-icon.rotate {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.admin-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  background: var(--color-background-light); /* #EFE1D6 */
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  z-index: 1001;
  border: 2px solid var(--color-accent-brown); /* #B48665 */
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1rem;
  color: var(--color-primary-dark);
  text-decoration: none;
  border-bottom: 1px solid var(--color-accent-brown); /* #B48665 */
  font-size: 0.8rem;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: rgba(226, 97, 145, 0.1);
  color: var(--color-accent-pink);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item i {
  font-size: 0.9rem;
  width: 16px;
}

/* Warenkorb */
.cart-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem; /* KLEINER */
  background: var(--color-accent-pink); /* #E26191 */
  color: white;
  border: 2px solid var(--color-accent-pink);
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.8rem; /* Kleinere Schrift */
  transition: all 0.3s;
}

.cart-btn:hover {
  background: white;
  color: var(--color-accent-pink);
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4757;
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-accent-brown);
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
  top: 80px; /* Höhere Navbar = höhere Position */
  left: 0;
  right: 0;
  background: var(--color-accent-brown);
  padding: 1.5rem;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  z-index: 999;
}

.mobile-search {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.mobile-search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-accent-brown);
  border-radius: 6px;
  font-family: var(--font-roboto);
  background: var(--color-background-light);
  color: var(--color-primary-dark);
}

.mobile-search-btn {
  padding: 0 1.25rem;
  background: var(--color-accent-pink);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* Mobile Kategorien */
.mobile-categories {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.mobile-category-btn {
  padding: 0.875rem;
  background: var(--color-background-light);
  color: var(--color-primary-dark);
  border: 2px solid var(--color-accent-brown);
  border-radius: 6px;
  font-family: var(--font-roboto);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.mobile-category-btn:hover {
  background: var(--color-accent-pink);
  color: white;
  border-color: var(--color-accent-pink);
}

/* Mobile User Actions */
.mobile-user-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem;
  background: var(--color-background-light);
  color: var(--color-primary-dark);
  border: 2px solid var(--color-accent-brown);
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
  border: none;
  width: 100%;
  text-align: left;
}

.mobile-nav-item:hover {
  background: var(--color-accent-pink);
  color: white;
}

.mobile-btn {
  width: 100%;
  padding: 0.875rem;
  background: var(--color-accent-pink);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.mobile-btn.logout {
  background: var(--color-primary-dark);
  border: 2px solid var(--color-primary-dark);
}

.mobile-btn.login-mobile {
  background: var(--color-accent-pink);
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

.mobile-nav-subitem {
  display: block;
  padding: 0.7rem 1rem;
  color: var(--color-primary-dark);
  text-decoration: none;
  border-radius: 6px;
  margin-left: 1rem;
  background: var(--color-background-light);
  margin-bottom: 0.25rem;
  cursor: pointer;
  border: none;
  width: calc(100% - 1rem);
  text-align: left;
  border: 2px solid var(--color-accent-brown);
}

.mobile-nav-subitem:hover {
  background: var(--color-accent-pink);
  color: white;
  border-color: var(--color-accent-pink);
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  background: #ff4757;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
}

/* Responsive */
@media (max-width: 899px) {
  .desktop-nav { display: none; }
  .burger-menu { display: flex; }
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem 0;
    min-height: 70px;
  }
  
  .navbar-container {
    padding: 0 1rem;
  }
  
  .logo img {
    height: 45px;
  }
  
  .logo-text {
    font-size: 1.6rem;
  }
  
  .mobile-nav {
    top: 70px;
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0.875rem 0;
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
  
  .mobile-category-btn,
  .mobile-nav-item,
  .mobile-btn {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
}
</style>