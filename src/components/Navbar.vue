<template>
  <nav class="navbar navbar-expand-xl navbar-light bg-navbar shadow-sm" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="container-xxl px-3 px-xl-4">
      <!-- Logo und Überschrift OBERER BEREICH -->
      <div class="navbar-brand-section">
        <router-link class="navbar-brand fw-bold text-accent d-flex align-items-center" to="/">
          <img src="../assets/Puppy_Racer_Logo.png" alt="Logo" :style="{ height: logoHeight + 'px' }" class="me-3 logo" />
          <span class="d-none d-lg-inline brand-text" :class="{ 'brand-text-hidden': isScrolled }">PuppyRacer</span>
        </router-link>
      </div>

      <!-- Burger Menu Button - NUR auf Mobile sichtbar -->
      <button
        class="navbar-toggler ms-auto d-xl-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar Content - UNTERER BEREICH -->
      <div class="collapse navbar-collapse justify-content-between align-items-center" id="navbarContent">
        <!-- Kategorien LINKS -->
        <div class="navbar-categories" :class="{ 'navbar-categories-hidden': isScrolled }">
          <ul class="navbar-nav custom-navbar-nav">
            <li class="nav-item custom-nav-item">
              <router-link class="nav-link category-link custom-nav-link" to="/leinen">Leinen</router-link>
            </li>
            <li class="nav-item custom-nav-item">
              <router-link class="nav-link category-link custom-nav-link" to="/halsbaender">Halsbänder</router-link>
            </li>
            <li class="nav-item custom-nav-item">
              <router-link class="nav-link category-link custom-nav-link" to="/bekleidung">Bekleidung</router-link>
            </li>
            <li class="nav-item custom-nav-item">
              <router-link class="nav-link category-link custom-nav-link" to="/snacks">Leckerlis & Snacks</router-link>
            </li>
          </ul>
        </div>

        <!-- Suchleiste MITTE -->
        <div class="navbar-search" :class="{ 'navbar-search-hidden': isScrolled }">
          <form class="search-form" @submit.prevent="handleSearch">
            <div class="input-group-wrapper">
              <div class="input-group">
                <input 
                  class="form-control search-input" 
                  type="search" 
                  placeholder="Hundezubehör, Leinen, Futter..." 
                  aria-label="Search"
                  v-model="searchQuery"
                />
                <button class="btn btn-search" type="submit">
                  <i class="bi bi-search"></i>
                  <span class="d-none d-md-inline ms-2">Suchen</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Account & Warenkorb RECHTS -->
        <div class="navbar-user">
          <router-link class="nav-link user-link me-3" to="/account">
            <i class="bi bi-person-circle me-2"></i>
            <span class="d-none d-xl-inline">Account</span>
          </router-link>
          <router-link class="nav-link user-link cart-link" to="/warenkorb">
            <i class="bi bi-cart3 me-2"></i>
            <span class="d-none d-xl-inline">Warenkorb</span>
            <span class="cart-badge">{{ cartItemCount }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Scroll State
const isScrolled = ref(false)
const logoHeight = ref(55)
const searchQuery = ref('')
const cartItemCount = ref(0)

// Handle Scroll Event
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  
  if (scrollTop > 100) {
    isScrolled.value = true
    logoHeight.value = 40
  } else {
    isScrolled.value = false
    logoHeight.value = 55
  }
}

// Search Handler
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Hier würde die Suchlogik implementiert werden
    console.log('Suche nach:', searchQuery.value)
    // Zum Beispiel: router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

// Simuliere Warenkorb-Items (später aus Store oder API)
const updateCartCount = () => {
  // Hier würde die tatsächliche Logik stehen
  cartItemCount.value = Math.floor(Math.random() * 5) // Test: zufällige Anzahl
}

// Event Listener hinzufügen/entfernen
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  updateCartCount()
  
  // Initialen Scroll-Status setzen
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ===== WICHTIG: Bootstrap Defaults überschreiben ===== */
.custom-navbar-nav {
  list-style: none !important;
  padding-left: 0 !important;
  margin-bottom: 0 !important;
}

.custom-nav-item {
  list-style: none !important;
}

.custom-nav-link {
  text-decoration: none !important;
  border: none !important;
  outline: none !important;
}

.custom-nav-link::before,
.custom-nav-link::after,
.custom-nav-item::before,
.custom-nav-item::after {
  display: none !important;
  content: none !important;
}

/* ===== NAVBAR GRUNDLAGEN ===== */
.bg-navbar {
  background-color: #cbbf9b;
  min-height: 140px;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1030;
  box-shadow: 0 6px 25px rgba(0,0,0,0.12);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Navbar im gescrollten Zustand */
.navbar-scrolled {
  min-height: 90px;
  padding-top: 1rem;
  padding-bottom: 1rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.container-xxl {
  width: 100%;
  max-width: 100%;
  padding-right: var(--bs-gutter-x, 1.5rem);
  padding-left: var(--bs-gutter-x, 1.5rem);
  margin-right: auto;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  transition: all 0.4s ease;
}

/* ===== LOGO & ÜBERSCHRIFT (OBERER BEREICH) ===== */
.navbar-brand-section {
  width: 100%;
  margin-bottom: 2.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.25);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-scrolled .navbar-brand-section {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom-width: 1px;
}

.navbar-brand {
  font-weight: 800;
  font-size: 2rem;
  color: #e26191;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  text-decoration: none !important;
}

.navbar-scrolled .navbar-brand {
  font-size: 1.7rem;
}

.logo {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(2px 2px 5px rgba(0,0,0,0.2));
}

.brand-text {
  background: linear-gradient(135deg, #e26191, #d05583);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 2px 2px 5px rgba(0,0,0,0.15);
  font-size: 2.2rem;
  letter-spacing: 0.5px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-scrolled .brand-text {
  font-size: 1.8rem;
}

.brand-text-hidden {
  opacity: 0;
  transform: translateX(-10px);
  width: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-brand:hover {
  transform: translateY(-3px);
  text-decoration: none !important;
}

.navbar-brand:hover img {
  transform: rotate(-10deg) scale(1.15);
}

/* ===== UNTERER BEREICH - ALLE ELEMENTE AUF GLEICHER HÖHE ===== */
.navbar-collapse {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-top: 0.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-scrolled .navbar-collapse {
  margin-top: 0.25rem;
  gap: 1rem;
}

/* KATEGORIEN - LINKS (OHNE UNTERSTRICHE UND PUNKTE) */
.navbar-categories {
  flex: 0 0 auto;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: translateY(0);
  height: auto;
  overflow: hidden;
}

.navbar-categories-hidden {
  opacity: 0;
  transform: translateY(-20px);
  height: 0;
  margin: 0;
  padding: 0;
  flex: 0;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: nowrap;
  margin: 0;
  padding: 0;
  transition: all 0.4s ease;
}

.navbar-categories-hidden .navbar-nav {
  display: none;
}

.nav-item {
  margin: 0;
  list-style: none !important;
}

.nav-link.category-link {
  color: white;
  font-weight: 600;
  font-size: 1.15rem;
  padding: 0.75rem 1.4rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  height: 48px;
  
  /* ABSOLUT KEINE Trennlinien oder Punkte */
  text-decoration: none !important;
  border-right: none !important;
  border-left: none !important;
  outline: none !important;
}

.navbar-scrolled .nav-link.category-link {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  height: 42px;
}

/* ENTFERNE ALLE Bootstrap/Standard Underlines */
.nav-link.category-link:hover,
.nav-link.category-link:focus,
.nav-link.category-link:active {
  text-decoration: none !important;
  outline: none !important;
}

/* ENTFERNE alle Pseudo-Elemente */
.nav-link.category-link::before,
.nav-link.category-link::after {
  display: none !important;
  content: none !important;
}

.nav-item::before,
.nav-item::after {
  display: none !important;
  content: none !important;
}

.nav-link.category-link:hover {
  color: #e26191;
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  text-decoration: none !important;
}

/* Aktive Kategorie - OHNE UNTERSTRICH */
.router-link-active.category-link {
  color: white !important;
  background: linear-gradient(135deg, #e26191, #d05583);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 6px 18px rgba(226, 97, 145, 0.4);
  transform: translateY(-2px);
  text-decoration: none !important;
}

/* SUCHLEISTE - MITTE */
.navbar-search {
  flex: 1;
  min-width: 300px;
  max-width: 650px;
  margin: 0 1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: translateY(0);
  height: auto;
  overflow: hidden;
}

.navbar-search-hidden {
  opacity: 0;
  transform: translateY(-20px);
  height: 0;
  margin: 0;
  padding: 0;
  flex: 0;
  min-width: 0;
  max-width: 0;
}

.input-group-wrapper {
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 4px 15px rgba(0,0,0,0.1),
    0 0 0 2px rgba(255, 255, 255, 0.2) inset;
  background: linear-gradient(135deg, rgba(255,255,255,0.97), rgba(255,255,255,0.99));
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-scrolled .input-group-wrapper {
  height: 42px;
}

.input-group-wrapper:focus-within {
  box-shadow: 
    0 6px 25px rgba(226, 97, 145, 0.25),
    0 0 0 2px rgba(226, 97, 145, 0.3) inset;
  transform: translateY(-2px);
}

.input-group {
  height: 100%;
  display: flex;
  border-radius: 12px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  padding: 0.75rem 1.5rem;
  color: #333;
  transition: all 0.3s;
}

.navbar-scrolled .search-input {
  font-size: 1rem;
  padding: 0.6rem 1.2rem;
}

.search-input::placeholder {
  color: #777;
  font-weight: 400;
}

.search-input:focus {
  outline: none;
  box-shadow: none;
}

/* Suchbutton */
.btn-search {
  height: 100%;
  border: none;
  background: linear-gradient(135deg, #e26191, #d05583);
  color: white;
  font-weight: 700;
  padding: 0 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  font-size: 1.1rem;
  border-radius: 0 12px 12px 0;
  position: relative;
  overflow: hidden;
}

.navbar-scrolled .btn-search {
  padding: 0 1.5rem;
  font-size: 1rem;
}

.btn-search::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: 0.6s;
}

.btn-search:hover::before {
  left: 100%;
}

.btn-search:hover {
  background: linear-gradient(135deg, #d05583, #c14a77);
  transform: scale(1.02);
}

.btn-search:active {
  transform: scale(0.98);
}

/* ACCOUNT & WARENKORB - RECHTS */
.navbar-user {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-scrolled .navbar-user {
  gap: 1rem;
}

.user-link {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.75rem 1.4rem;
  border-radius: 12px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  height: 48px;
  text-decoration: none !important;
}

.navbar-scrolled .user-link {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  height: 42px;
}

.user-link:hover {
  color: #e26191;
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  text-decoration: none !important;
}

.user-link i {
  font-size: 1.4rem;
}

.navbar-scrolled .user-link i {
  font-size: 1.2rem;
}

.cart-link {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(0,0,0,0.25);
}

.navbar-scrolled .cart-badge {
  width: 18px;
  height: 18px;
  font-size: 0.65rem;
  top: -6px;
  right: -6px;
}

/* ===== BURGER MENU BUTTON ===== */
.navbar-toggler {
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 0.9rem;
  border-radius: 10px;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.1);
  position: absolute;
  right: 1.5rem;
  top: 2rem;
  display: none;
}

.navbar-scrolled .navbar-toggler {
  top: 1.5rem;
  padding: 0.4rem 0.8rem;
}

.navbar-toggler:hover {
  border-color: #e26191;
  background-color: rgba(255, 255, 255, 0.2);
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 0.3rem rgba(226, 97, 145, 0.25);
}

/* Verstecke Burger auf Desktop */
@media (min-width: 1200px) {
  .navbar-toggler {
    display: none !important;
  }
}

/* ===== RESPONSIVE ANPASSUNGEN ===== */

/* Desktop (xl und größer) */
@media (min-width: 1200px) {
  .navbar-expand-xl .navbar-collapse {
    display: flex !important;
  }
  
  .container-xxl {
    max-width: 1400px;
  }
}

/* Tablet (lg - 992px bis 1199px) */
@media (max-width: 1199px) and (min-width: 992px) {
  .bg-navbar {
    min-height: 130px;
  }
  
  .navbar-search {
    max-width: 500px;
    margin: 0 1rem;
  }
  
  .nav-link.category-link,
  .user-link {
    padding: 0.7rem 1.2rem;
    font-size: 1.05rem;
  }
  
  .navbar-brand-section {
    margin-bottom: 2rem;
  }
}

/* Tablet/Mobile (unter 992px) */
@media (max-width: 991px) {
  .bg-navbar {
    min-height: 110px;
    padding: 1rem;
  }
  
  .navbar-toggler {
    display: flex;
    top: 1.5rem;
    right: 1rem;
  }
  
  .navbar-brand-section {
    margin-bottom: 1.5rem;
    width: calc(100% - 60px);
    padding-right: 50px;
  }
  
  .navbar-expand-xl .navbar-collapse {
    background-color: rgba(203, 191, 155, 0.98);
    border-radius: 18px;
    margin-top: 0.5rem;
    padding: 2rem;
    box-shadow: 0 15px 45px rgba(0,0,0,0.3);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.35);
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
  
  /* Mobile: Alles untereinander */
  .navbar-categories,
  .navbar-search,
  .navbar-user {
    width: 100%;
    margin: 0;
  }
  
  .navbar-nav {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 0;
  }
  
  .nav-item {
    width: 100%;
  }
  
  .nav-link.category-link {
    width: 100%;
    justify-content: center;
    font-size: 1.2rem;
    padding: 1rem;
    height: 52px;
    margin-bottom: 0.5rem;
  }
  
  .input-group-wrapper {
    max-width: 100%;
    height: 52px;
  }
  
  .navbar-user {
    justify-content: center;
    margin-top: 1rem;
    padding-top: 1.5rem;
    border-top: 2px solid rgba(255,255,255,0.3);
    gap: 1.5rem;
  }
  
  .user-link {
    padding: 1rem 1.5rem;
    font-size: 1.2rem;
    height: 52px;
    justify-content: center;
  }
  
  .user-link span {
    display: inline !important;
  }
  
  .brand-text {
    display: inline !important;
    font-size: 1.8rem;
  }
  
  .navbar-brand img {
    height: 45px;
  }
  
  /* Mobile: Verstecke Kategorien und Suchleiste bei Scroll */
  .navbar-categories-hidden,
  .navbar-search-hidden {
    display: none !important;
  }
}

/* Mobile (sm - 576px bis 767px) */
@media (max-width: 767px) {
  .container-xxl {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .bg-navbar {
    min-height: 100px;
  }
  
  .navbar-brand {
    font-size: 1.8rem;
  }
  
  .navbar-brand img {
    height: 40px;
  }
  
  .nav-link.category-link,
  .user-link {
    font-size: 1.15rem;
    padding: 0.9rem;
  }
  
  .search-input {
    font-size: 1.05rem;
    padding: 0.75rem 1.25rem;
  }
  
  .btn-search {
    padding: 0 1.5rem;
  }
}

/* Sehr kleine Mobile (unter 576px) */
@media (max-width: 575px) {
  .container-xxl {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  .bg-navbar {
    min-height: 95px;
  }
  
  .navbar-brand-section {
    margin-bottom: 1.2rem;
  }
  
  .navbar-expand-xl .navbar-collapse {
    padding: 1.5rem;
  }
  
  .nav-link.category-link,
  .user-link {
    font-size: 1.1rem;
    padding: 0.85rem;
    height: 48px;
  }
  
  .input-group-wrapper {
    height: 48px;
  }
  
  .search-input {
    font-size: 1rem;
    padding: 0.75rem 1rem;
  }
  
  .btn-search span {
    display: none;
  }
  
  .btn-search {
    padding: 0 1.25rem;
  }
  
  .user-link i {
    font-size: 1.3rem;
  }
  
  .navbar-user {
    gap: 1rem;
  }
}

/* Extra kleine Screens */
@media (max-width: 400px) {
  .navbar-user {
    flex-direction: column;
    gap: 1rem;
  }
  
  .user-link {
    width: 100%;
  }
}

/* Smooth Transitions */
.navbar-collapse {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Padding für Content unter Navbar */
.page-content-padding {
  padding-top: 160px;
}

/* Scroll Animationen */
.navbar-categories,
.navbar-search {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Verhindert Layout-Shifts */
.navbar-categories-hidden,
.navbar-search-hidden {
  pointer-events: none;
  user-select: none;
}
</style>