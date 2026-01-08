<template>
  <div v-if="bannerVisible" class="special-banner">
    <div class="banner-content">
      <p class="banner-text"> <strong>Spare 5% auf deine erste Bestellung!</strong> Code: <span class="discount-code">ERSTEBESTELLUNG5</span></p>
      <NavButton variant="primary" @click="hideBanner">OK</NavButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NavButton from './NavButton.vue';

const bannerVisible = ref(true);

function hideBanner() {
  bannerVisible.value = false;
}
</script>

<style scoped>
.special-banner {
  background: linear-gradient(135deg, #e26191, #ff8c00);
  color: white;
  padding: 0.5rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

.banner-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.banner-text {
  margin: 0;
  font-size: 0.95rem;
}

.discount-code {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .banner-text {
    font-size: 0.85rem;
  }
}
</style>