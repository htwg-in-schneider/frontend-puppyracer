<template>
  <div class="home-view">
    <SpecialBanner />
    <HeroSection />
    <DogCarousel />
    <!-- Optional: Featured Products oder andere Homepage-Inhalte -->
    <div class="container my-5">
      <h2 class="text-center mb-4">Beliebte Produkte</h2>
      <ProductCatalog :show-category-filter="false" />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-view {
  padding-top: 20px; /* Abstand zur Navbar */
}
</style>