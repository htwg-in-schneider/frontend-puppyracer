<template>
  <Navbar />
  
  <!-- Homepage-Komponenten NUR auf der Startseite anzeigen -->
  <template v-if="$route.path === '/'">
    <SpecialBanner />
    <HeroSection />
    <DogCarousel />
  </template>
  
  <!-- Hier erscheinen alle Views -->
  <router-view />
  
  <Footer />
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import NavButton from './components/NavButton.vue';
import HeroSection from './components/HeroSection.vue'
import DogCarousel from './components/DogCarousel.vue'
import SpecialBanner from './components/SpecialBanner.vue';
</script>