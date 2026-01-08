<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/" class="logo-link">
          <img src="../assets/Puppy_Racer_Logo.png" alt="Logo" />
          <span class="logo-text">PuppyRacer</span>
        </router-link>
      </div>

      <!-- Desktop Navigation - für größere Bildschirme -->
      <div class="desktop-nav" v-if="!isMobile">
        <!-- Kategorien mit Dropdown auf kleineren Desktops -->
        <div class="categories-wrapper">
          <div class="categories-dropdown" v-if="showCategoriesDropdown">
            <button class="categories-toggle" @click="toggleCategoriesMenu">
              Kategorien
              <i class="bi bi-chevron-down dropdown-icon" :class="{ 'rotate': categoriesMenuOpen }"></i>
            </button>
            
            <div v-if="categoriesMenuOpen" class="categories-dropdown-menu" @click="closeCategoriesMenu">
              <router-link to="/produkte/leinen" class="dropdown-item">
                Leinen
              </router-link>
              <router-link to="/produkte/halsbaender" class="dropdown-item">
                Halsbänder
              </router-link>
              <router-link to="/produkte/bekleidung" class="dropdown-item">
                Bekleidung
              </router-link>
              <router-link to="/produkte/snacks" class="dropdown-item">
                Snacks
              </router-link>
            </div>
          </div>
          
          <!-- Normale Kategorien auf großen Bildschirmen -->
          <div class="categories" v-else>
            <router-link to="/produkte/leinen" class="category">
              Leinen
            </router-link>
            <router-link to="/produkte/halsbaender" class="category">
              Halsbänder
            </router-link>
            <router-link to="/produkte/bekleidung" class="category">
              Bekleidung
            </router-link>
            <router-link to="/produkte/snacks" class="category">
              Snacks
            </router-link>
          </div>
        </div>

        <!-- Suchleiste -->
        <div class="search">
          <form @submit.prevent="handleSearch" class="search-form">
            <div class="search-wrapper">
              <input 
                v-model="searchQuery" 
                placeholder="Hundezubehör suchen..." 
                class="search-input" 
                @keyup.enter="handleSearch"
                aria-label="Suchbegriff"
              />
              <button type="submit" class="search-btn" aria-label="Suchen">
                <i class="bi bi-search"></i>
                <span class="search-text">Suchen</span>
              </button>
            </div>
          </form>
        </div>

        <!-- User Actions -->
        <div class="user-actions">
          <div class="auth-section">
            <!-- Nicht eingeloggt -->
            <div v-if="!isAuthenticated" class="not-logged">
              <button @click="handleLogin" class="auth-btn">
                <i class="bi bi-person-circle"></i>
                <span class="btn-text">Login</span>
              </button>
            </div>
            
            <!-- Eingeloggt -->
            <div v-else class="logged">
              <div class="user-info">
                <!-- Admin Dropdown -->
                <div v-if="isAdmin" class="admin-menu">
                  <button class="admin-toggle" @click="toggleAdminMenu">
                    <i class="bi bi-shield-lock"></i>
                    <span class="btn-text" v-if="!showCompactAdmin">Admin</span>
                    <i class="bi bi-chevron-down dropdown-icon" :class="{ 'rotate': adminMenuOpen }"></i>
                  </button>
                  
                  <div v-if="adminMenuOpen" class="admin-dropdown">
                    <router-link to="/admin/users" class="dropdown-item" @click="closeAdminMenu">
                      Benutzer
                    </router-link>
                    <router-link to="/admin/orders" class="dropdown-item" @click="closeAdminMenu">
                      Bestellungen
                    </router-link>
                    <router-link to="/admin/products" class="dropdown-item" @click="closeAdminMenu">
                      Produkte
                    </router-link>
                    <router-link to="/account" class="dropdown-item" @click="closeAdminMenu">
                      Mein Profil
                    </router-link>
                  </div>
                </div>
                
                <!-- Account Button für Nicht-Admins -->
                <router-link v-else to="/account" class="account-btn">
                  <i class="bi bi-person-circle"></i>
                  <span class="btn-text" v-if="!showCompactUserInfo">Konto</span>
                </router-link>
                
                <!-- Logout Button -->
                <button @click="handleLogout" class="logout-btn">
                  <i class="bi bi-box-arrow-right"></i>
                  <span class="btn-text" v-if="!showCompactUserInfo">Logout</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Warenkorb -->
          <router-link to="/warenkorb" class="cart-btn">
            <i class="bi bi-cart3"></i>
            <span class="btn-text" v-if="!showCompactCart">Warenkorb</span>
            <span class="badge" v-if="cartCount > 0">{{ cartCount }}</span>
          </router-link>
        </div>
      </div>

      <!-- Burger Menu - für Mobile -->
      <button 
        class="burger" 
        @click="toggleMenu" 
        :class="{ 'open': menuOpen }"
        aria-label="Menü öffnen/schließen"
        v-if="isMobile"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Mobile Navigation -->
      <div class="mobile-nav" v-if="isMobile" :class="{ 'show': menuOpen }">
        <!-- Suchleiste oben in Mobile -->
        <div class="mobile-search">
          <form @submit.prevent="handleSearch" class="search-form">
            <div class="search-wrapper">
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
            </div>
          </form>
        </div>

        <!-- Kategorien -->
        <div class="mobile-categories">
          <router-link to="/produkte/leinen" class="category" @click="closeMenu">
            Leinen
          </router-link>
          <router-link to="/produkte/halsbaender" class="category" @click="closeMenu">
            Halsbänder
          </router-link>
          <router-link to="/produkte/bekleidung" class="category" @click="closeMenu">
            Bekleidung
          </router-link>
          <router-link to="/produkte/snacks" class="category" @click="closeMenu">
            Snacks
          </router-link>
        </div>

        <!-- User Actions in Mobile -->
        <div class="mobile-user-actions">
          <div v-if="!isAuthenticated" class="mobile-auth">
            <button @click="handleLogin" class="mobile-btn">
              <i class="bi bi-person-circle"></i>
              <span>Login / Registrieren</span>
            </button>
          </div>
          
          <div v-else class="mobile-logged">
            <div class="mobile-user-info">
              <router-link to="/account" class="mobile-nav-item" @click="closeMenu">
                <i class="bi bi-person"></i>
                <span>Mein Profil</span>
              </router-link>
              
              <div v-if="isAdmin" class="admin-section">
                <div class="mobile-nav-header">
                  <i class="bi bi-shield-lock"></i>
                  <span>Admin-Bereich</span>
                </div>
                <router-link to="/admin/users" class="mobile-nav-subitem" @click="closeMenu">
                  Benutzer
                </router-link>
                <router-link to="/admin/orders" class="mobile-nav-subitem" @click="closeMenu">
                  Bestellungen
                </router-link>
                <router-link to="/admin/products" class="mobile-nav-subitem" @click="closeMenu">
                  Produkte
                </router-link>
              </div>
              
              <button @click="handleLogout" class="mobile-btn logout">
                <i class="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
          
          <router-link to="/warenkorb" class="mobile-nav-item cart-mobile" @click="closeMenu">
            <div class="cart-info">
              <i class="bi bi-cart3"></i>
              <span>Warenkorb</span>
            </div>
            <span class="badge-mobile" v-if="cartCount > 0">{{ cartCount }}</span>
          </router-link>
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
const categoriesMenuOpen = ref(false)
const searchQuery = ref('')
const isAdmin = ref(false)
const windowWidth = ref(window.innerWidth)

// Computed
const cartCount = computed(() => cartStore.itemCount || 0)

// Responsive computed properties
const isMobile = computed(() => windowWidth.value < 900)
const showCategoriesDropdown = computed(() => windowWidth.value < 1100 && windowWidth.value >= 900)
const showCompactUserInfo = computed(() => windowWidth.value < 1000)
const showCompactAdmin = computed(() => windowWidth.value < 950)
const showCompactCart = computed(() => windowWidth.value < 1000)

// Admin-Check
async function checkAdminStatus() {
  if (!isAuthenticated.value) {
    isAdmin.value = false
    return
  }
  
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch('http://localhost:8081/api/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (response.ok) {
      const userData = await response.json()
      isAdmin.value = userData.role === 'ADMIN'
    }
  } catch (error) {
    console.error('Admin-Check fehlgeschlagen:', error)
    const roles = user.value?.['puppyracer/roles'] || user.value?.['https://puppyracer.com/roles']
    isAdmin.value = roles?.includes('ADMIN') || false
  }
}

// WATCHER für Authentifizierungsänderungen
watch(isAuthenticated, (newVal) => {
  if (newVal) {
    checkAdminStatus()
  } else {
    isAdmin.value = false
  }
})

// Scroll Handler
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Search Handler
const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (query) {
    router.push({ 
      path: '/search', 
      query: { q: query } 
    })
    searchQuery.value = ''
    closeAllMenus()
  }
}

// Auth Handler
const handleLogin = () => {
  loginWithRedirect()
  closeAllMenus()
}

const handleLogout = () => {
  logout({ 
    logoutParams: { 
      returnTo: window.location.origin 
    } 
  })
  closeAllMenus()
  isAdmin.value = false
}

// Menu Functions
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    adminMenuOpen.value = false
    categoriesMenuOpen.value = false
  }
}

const toggleCategoriesMenu = () => {
  categoriesMenuOpen.value = !categoriesMenuOpen.value
  if (categoriesMenuOpen.value) {
    adminMenuOpen.value = false
  }
}

const toggleAdminMenu = () => {
  adminMenuOpen.value = !adminMenuOpen.value
  if (adminMenuOpen.value) {
    categoriesMenuOpen.value = false
  }
}

const closeMenu = () => {
  menuOpen.value = false
}

const closeCategoriesMenu = () => {
  categoriesMenuOpen.value = false
}

// NEUE FUNKTION: Schließt Admin-Dropdown
const closeAdminMenu = () => {
  adminMenuOpen.value = false
}

const closeAllMenus = () => {
  menuOpen.value = false
  adminMenuOpen.value = false
  categoriesMenuOpen.value = false
}

// Resize Handler
const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (windowWidth.value >= 900) {
    menuOpen.value = false
  }
}

// Klick außerhalb schließt Menüs
const handleClickOutside = (event) => {
  if (!event.target.closest('.navbar')) {
    closeAllMenus()
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
  handleScroll()
  checkAdminStatus()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Basis Styles */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #cbbf9b;
  padding: 1rem 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: padding 0.3s ease;
}

.navbar.scrolled {
  padding: 0.75rem 0;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
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
  flex-shrink: 0;
}

.logo img {
  height: 40px;
  width: auto;
}

.logo-text {
  font-family: "Roboto", sans-serif;
  font-weight: 800;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #e26191, #d05583);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Burger Menu */
.burger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 22px;
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
}

.burger.open span:first-child {
  transform: rotate(45deg) translate(6px, 5px);
}

.burger.open span:nth-child(2) {
  opacity: 0;
}

.burger.open span:last-child {
  transform: rotate(-45deg) translate(6px, -5px);
}

/* ===== DESKTOP NAVIGATION ===== */
.desktop-nav {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  gap: 1rem;
}

/* Categories */
.categories-wrapper {
  flex-shrink: 0;
}

.categories-dropdown {
  position: relative;
}

.categories-toggle {
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.categories-toggle:hover {
  background: rgba(226, 97, 145, 0.3);
}

.categories-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  z-index: 1002;
  overflow: hidden;
  border: 1px solid #eee;
}

.categories-dropdown-menu .dropdown-item {
  display: block;
  padding: 0.7rem 1rem;
  color: #333;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-size: 0.9rem;
  transition: all 0.2s;
  border-bottom: 1px solid #f5f5f5;
}

.categories-dropdown-menu .dropdown-item:hover {
  background: #f8f9fa;
  color: #e26191;
}

.categories {
  display: flex;
  gap: 0.5rem;
  flex-wrap: nowrap;
}

.category {
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
  flex-shrink: 0;
}

.category:hover {
  background: rgba(226, 97, 145, 0.3);
}

/* Search */
.search {
  flex: 1;
  min-width: 150px;
  max-width: 400px;
}

.search-wrapper {
  display: flex;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  height: 40px;
}

.search-input {
  flex: 1;
  padding: 0 0.8rem;
  border: none;
  font-family: "Roboto", sans-serif;
  font-size: 0.95rem;
  min-width: 120px;
}

.search-input:focus {
  outline: none;
}

.search-btn {
  padding: 0 1rem;
  background: #e26191;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  white-space: nowrap;
  height: 100%;
}

.search-btn:hover {
  background: #d05583;
}

/* User Actions */
.user-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-shrink: 0;
}

.auth-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

/* Admin Menu */
.admin-menu {
  position: relative;
}

.admin-toggle {
  padding: 0.4rem 0.6rem;
  border-radius: 5px;
  background: rgba(255, 193, 7, 0.25);
  color: white;
  border: 1px solid rgba(255, 193, 7, 0.4);
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s ease;
  cursor: pointer;
  white-space: nowrap;
}

.admin-toggle:hover {
  background: rgba(255, 193, 7, 0.4);
}

.dropdown-icon {
  font-size: 0.7rem;
  transition: transform 0.3s;
}

.dropdown-icon.rotate {
  transform: rotate(180deg);
}

.admin-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  z-index: 1002;
  overflow: hidden;
  border: 1px solid #eee;
}

.admin-dropdown .dropdown-item {
  display: block;
  padding: 0.6rem 0.8rem;
  color: #333;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-size: 0.85rem;
  transition: all 0.2s;
  border-bottom: 1px solid #f5f5f5;
}

.admin-dropdown .dropdown-item:hover {
  background: #f8f9fa;
  color: #e26191;
}

/* Buttons */
.auth-btn, .logout-btn, .account-btn, .cart-btn {
  padding: 0.4rem 0.7rem;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  white-space: nowrap;
}

.auth-btn:hover, .logout-btn:hover, .account-btn:hover, .cart-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Cart Badge */
.cart-btn {
  position: relative;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  border: 2px solid #cbbf9b;
}

/* ===== MOBILE NAVIGATION ===== */
.mobile-nav {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: #cbbf9b;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
  max-height: calc(100vh - 70px);
  overflow-y: auto;
}

.mobile-nav.show {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-search {
  margin-bottom: 1.5rem;
}

.mobile-search .search-wrapper {
  width: 100%;
}

.mobile-search .search-btn span {
  display: none;
}

.mobile-categories {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.mobile-categories .category {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  text-decoration: none;
  color: white;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.mobile-categories .category:hover {
  background: rgba(226, 97, 145, 0.4);
}

.mobile-user-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-auth .mobile-btn {
  width: 100%;
  padding: 1rem;
  background: rgba(226, 97, 145, 0.3);
  border: 1px solid rgba(226, 97, 145, 0.5);
  border-radius: 8px;
  color: white;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-auth .mobile-btn:hover {
  background: rgba(226, 97, 145, 0.5);
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  text-decoration: none;
  color: white;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.mobile-nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.mobile-nav-item i {
  margin-right: 0.75rem;
}

.cart-info {
  display: flex;
  align-items: center;
}

.badge-mobile {
  background: #ff4757;
  color: white;
  font-size: 0.8rem;
  font-weight: 800;
  min-width: 24px;
  height: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.admin-section {
  margin: 1rem 0;
  padding: 0.75rem;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.mobile-nav-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: white;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.mobile-nav-subitem {
  display: block;
  padding: 0.6rem 1rem;
  padding-left: 2rem;
  text-decoration: none;
  color: white;
  font-family: "Roboto", sans-serif;
  font-size: 0.9rem;
  border-radius: 4px;
  margin-bottom: 0.25rem;
  transition: all 0.3s ease;
}

.mobile-nav-subitem:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-btn.logout {
  margin-top: 1rem;
  background: rgba(45, 33, 33, 0.3);
  border: 1px solid rgba(45, 33, 33, 0.5);
}

.mobile-btn.logout:hover {
  background: rgba(45, 33, 33, 0.5);
}

/* ===== RESPONSIVE BREAKPOINTS ===== */
@media (min-width: 1400px) {
  .navbar-container {
    padding: 0 2rem;
  }
  
  .category {
    padding: 0.6rem 1.2rem;
  }
  
  .search {
    max-width: 500px;
  }
}

@media (max-width: 1399px) and (min-width: 1200px) {
  .navbar-container {
    padding: 0 1.5rem;
  }
  
  .category {
    padding: 0.5rem 1rem;
  }
  
  .search {
    max-width: 450px;
  }
}

@media (max-width: 1199px) and (min-width: 1100px) {
  .category {
    padding: 0.5rem 0.8rem;
  }
  
  .search {
    max-width: 400px;
  }
}

@media (max-width: 1099px) and (min-width: 1000px) {
  .category {
    padding: 0.4rem 0.7rem;
    font-size: 0.85rem;
  }
  
  .search {
    max-width: 350px;
  }
}

@media (max-width: 999px) and (min-width: 950px) {
  .category {
    padding: 0.4rem 0.6rem;
    font-size: 0.82rem;
  }
  
  .search {
    max-width: 300px;
  }
  
  .search-text {
    display: none;
  }
}

@media (max-width: 949px) and (min-width: 900px) {
  .category {
    padding: 0.4rem 0.5rem;
    font-size: 0.8rem;
  }
  
  .search {
    max-width: 250px;
  }
  
  .search-text, .btn-text {
    display: none;
  }
  
  .admin-toggle .btn-text {
    display: none;
  }
}

@media (max-width: 899px) and (min-width: 768px) {
  .burger {
    display: flex;
  }
  
  .desktop-nav {
    display: none;
  }
  
  .logo img {
    height: 35px;
  }
  
  .logo-text {
    font-size: 1.3rem;
  }
  
  .mobile-nav.show {
    top: 65px;
    padding: 1.25rem;
  }
}

@media (max-width: 767px) and (min-width: 600px) {
  .burger {
    display: flex;
  }
  
  .desktop-nav {
    display: none;
  }
  
  .navbar-container {
    padding: 0 0.75rem;
  }
  
  .logo img {
    height: 35px;
  }
  
  .logo-text {
    font-size: 1.3rem;
  }
  
  .mobile-nav.show {
    top: 65px;
    padding: 1.25rem;
  }
}

@media (max-width: 599px) and (min-width: 480px) {
  .burger {
    display: flex;
  }
  
  .desktop-nav {
    display: none;
  }
  
  .navbar-container {
    padding: 0 0.5rem;
  }
  
  .logo img {
    height: 32px;
  }
  
  .logo-text {
    font-size: 1.2rem;
  }
  
  .mobile-nav.show {
    top: 60px;
    padding: 1rem;
  }
  
  .mobile-categories {
    gap: 0.5rem;
  }
  
  .mobile-categories .category {
    padding: 0.75rem;
  }
}

@media (max-width: 479px) {
  .burger {
    display: flex;
  }
  
  .desktop-nav {
    display: none;
  }
  
  .navbar-container {
    padding: 0 0.5rem;
  }
  
  .logo img {
    height: 30px;
  }
  
  .logo-text {
    font-size: 1.1rem;
  }
  
  .mobile-nav.show {
    top: 58px;
    padding: 1rem;
  }
  
  .mobile-categories {
    grid-template-columns: 1fr;
  }
  
  .mobile-nav-item {
    padding: 0.7rem 0.9rem;
    font-size: 0.95rem;
  }
}
</style>