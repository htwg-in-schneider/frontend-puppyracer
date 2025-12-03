<template>
<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
  <div class="container">
    <router-link class="navbar-brand fw-bold text-accent" to="/">
      <img src="../assets/Puppy_Racer_Logo.jpg" alt="PuppyRacer Logo" height="100" class="me-2">
    </router-link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-4">
        <li class="nav-item"><router-link class="nav-link" to="/">Main Page</router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="/products">Doggy Profiles</router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="/tierheim">Animal Shelters</router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="/contact">Contact</router-link></li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script setup>
</script>

<style scoped>
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    background: transparent;
    z-index: 10;
}

.navbar nav {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

.navbar ul {
    display: flex;
    list-style: none;
    gap: 5rem;
}

.navbar a {
    text-decoration: none;
    color: #EFE1D6;
    font-weight: 500;
}

.navbar a:hover {
    color: #E26191;
}

</style>