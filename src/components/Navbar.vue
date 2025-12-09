<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-navbar shadow-sm">
    <div class="container">
      <!-- Logo links -->
      <router-link class="navbar-brand fw-bold text-accent d-flex align-items-center" to="/">
        <img src="../assets/Puppy_Racer_Logo.png" alt="Logo" height="50" class="me-2" />
        PuppyRacer
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- Kategorien links -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link category-link" to="/leinen">Leinen</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link category-link" to="/halsbaender">Halsbänder</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link category-link" to="/bekleidung">Bekleidung</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link category-link" to="/snacks">Leckerlis & Snacks</router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- Suchfeld unter Kategorien -->
    <div class="search-bar-container">
      <form class="search-form d-flex justify-content-center align-items-center">
        <input class="form-control search-input me-3" type="search" placeholder="Zubehör suchen" aria-label="Search" />
        <div class="account-wrapper d-flex align-items-center">
          <router-link class="account-link" to="#">Account</router-link>
          <router-link class="account-link ms-3" to="#">Warenkorb</router-link>
        </div>
        <button class="btn btn-outline-accent btn-search ms-3" type="submit">
          <i class="bi bi-search"></i>
        </button>
      </form>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
/* Navbar Hintergrund */
.bg-navbar {
  background-color: #cbbf9b; /* dunkleres Beige */
}

/* Navbar fixiert */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 0.5rem 1rem;
}

/* Logo */
.navbar-brand {
  font-weight: 700;
  font-size: 1.5rem;
  color: #e26191;
}

/* Kategorie Links */
.category-link {
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  transition: color 0.3s, transform 0.2s;
}
.category-link:hover {
  color: #e26191;
  transform: translateY(-2px);
}

.navbar-nav {
  margin-top: 20px; /* Abstand unter dem Logo */
}

.search-bar-container {
  margin-top: 30px; /* Abstand unter den Kategorien */
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Suchleiste */
.search-form {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px; /* größer */
}

.search-input {
  width: 100%;
  height: 50px; /* kleiner */
  font-size: 1.2rem;
  border-radius: 8px;
  border: 1px solid #e0c097;
  padding-left: 15px;
}

/* Buttons */
.btn-search {
  border-color: #e26191;
  background-color: #fff;
  color: #e26191;
  font-weight: 600;
  border-radius: 8px;
  height: 55px;
}
.btn-search:hover {
  background-color: #e26191;
  color: white;
}

/* Account-Link rechts von Suchleiste */
.account-link {
  font-weight: 600;
  color: white;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  text-decoration: none; /* Unterstreichung entfernen */
  margin-left: 15px; /* Abstand nach links */
  transition: color 0.3s;
}
.account-link:hover {
  color: #e26191;
}
.account-link i {
  font-size: 1.3rem;
  margin-right: 5px;
}

/* Cart-Icon optional, falls noch benötigt */
.cart-link {
  font-weight: 600;
  color: white;
  display: inline-flex;
  align-items: center;
  margin-left: 15px;
}
.cart-link:hover {
  color: #e26191;
}

.account-wrapper,
.account-wrapper * {
  list-style: none !important;
}

.navbar-brand {
  list-style: none !important;
}

.category-link {
  border: none !important;
}

/* Entfernt vertikale Linie rechts von der letzten Kategorie */
.navbar-nav .nav-item,
.navbar-nav .nav-link {
  border-right: none !important;
  border-left: none !important;
}

/* Falls ein pseudo-element die Linie erzeugt */
.navbar-nav .nav-item::after,
.navbar-nav .nav-link::after {
  display: none !important;
  border: none !important;
}
</style>