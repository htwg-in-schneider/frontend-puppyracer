<template>
  <div v-if="bannerVisible" class="special-banner">
    <div class="banner-content">
      <p class="banner-text">
        <strong>10% Rabatt</strong> auf deine erste Bestellung mit Code: 
        <span class="discount-code">HUNDE10</span>
      </p>
      <button @click="hideBanner" class="close-btn" aria-label="Banner schließen" title="Schließen">
        <i class="bi bi-x"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const bannerVisible = ref(false);
const BANNER_KEY = 'puppyracer_banner_hidden';

function hideBanner() {
  bannerVisible.value = false;
  localStorage.setItem(BANNER_KEY, 'true');
}

onMounted(() => {
  setTimeout(() => {
    const isHidden = localStorage.getItem(BANNER_KEY);
    bannerVisible.value = (isHidden !== 'true');
  }, 100);
});
</script>

<style scoped>
.special-banner {
  background: var(--color-accent-pink); /* #E26191 */
  color: white;
  padding: 0.5rem 0;
  position: sticky;
  top: 80px; /* ANPASSEN: Navbar-Höhe (80px bei Desktop) */
  z-index: 1099; /* Unter Navbar (1100) */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.banner-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.banner-text {
  margin: 0;
  font-size: 0.9rem;
  color: white;
  line-height: 1.4;
  flex: 1;
}

.banner-text strong {
  font-weight: 700;
}

.discount-code {
  font-family: 'Courier New', monospace;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 0.85rem;
}

.close-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.75rem;
  padding: 0;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.close-btn:active {
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 768px) {
  .special-banner {
    top: 70px; /* Mobile Navbar-Höhe */
    padding: 0.4rem 0;
  }
  
  .banner-content {
    padding: 0 0.75rem;
  }
  
  .banner-text {
    font-size: 0.8rem;
  }
  
  .discount-code {
    font-size: 0.75rem;
    padding: 0.15rem 0.4rem;
  }
  
  .close-btn {
    width: 22px;
    height: 22px;
  }
}

@media (max-width: 480px) {
  .special-banner {
    top: 65px; /* Mobile kleine Navbar */
  }
  
  .banner-text {
    font-size: 0.75rem;
  }
  
  .discount-code {
    display: inline-block;
    margin-top: 0.1rem;
  }
}
</style>