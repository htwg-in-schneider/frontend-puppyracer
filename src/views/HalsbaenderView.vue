<template>
  <div class="category-view">
    <div class="category-hero bg-light py-5 mb-5">
      <div class="container text-center">
        <h1 class="display-5 fw-bold mb-3">Halsbänder & Halsketten</h1>
        <p class="lead text-muted max-width-700 mx-auto">
          Stylische und funktionelle Halsbänder für jeden Hund. 
          Ob klassisch, reflektierend oder personalisiert - finde das perfekte Halsband.
        </p>
      </div>
    </div>
    
    <ProductCatalog :category="'halsbaender'" />
  </div>
</template>

<script setup>
import ProductCatalog from '@/views/ProductCatalog.vue'
</script>

<style scoped>
.category-hero {
  background: linear-gradient(135deg, #f8f5ec 0%, #e8e1d1 100%);
  border-bottom: 3px solid #e26191;
}

.max-width-700 {
  max-width: 700px;
}
</style>