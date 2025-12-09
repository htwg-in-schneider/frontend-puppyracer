<template>
  <div class="category-view">
    <div class="category-hero bg-light py-5 mb-5">
      <div class="container text-center">
        <h1 class="display-5 fw-bold mb-3">Leinen & Geschirre</h1>
        <p class="lead text-muted max-width-700 mx-auto">
          Entdecke unsere hochwertigen Leinen und Geschirre für Ihren Vierbeiner. 
          Von alltäglichen Spaziergängen bis hin zu sportlichen Aktivitäten.
        </p>
      </div>
    </div>
    
    <ProductCatalog :category="'leinen'" />
  </div>
</template>

<script setup>
import ProductCatalog from '@/views/ProductCatalog.vue'
</script>

<style scoped>
.category-hero {
  background: linear-gradient(135deg, #f8f5ec 0%, #e8e1d1 100%);
  border-bottom: 3px solid #e0c097;
}

.max-width-700 {
  max-width: 700px;
}
</style>