<template>
  <div class="home-view">
    <div class="hero">
      <h1>Willkommen bei Paw&Love</h1>
      <p>Das beste für Ihren Hund</p>
      <router-link to="/products" class="btn-primary">
        Produkte entdecken
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  padding-top: 100px;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #8b7355 0%, #a8916d 100%);
  color: white;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.btn-primary {
  display: inline-block;
  background: #e26191;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  margin-top: 1rem;
}
</style>