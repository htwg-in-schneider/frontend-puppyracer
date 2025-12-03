<template>
  <Navbar />
  <SpecialBanner />
  <HeroSection />
  <DogCarousel />
  <ProductCatalog />  <!-- hier werden die Produkte vom Backend geladen -->
  <TierheimSection />
  <IdentifySection />
  <Footer />
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import SpecialBanner from './components/SpecialBanner.vue'
import HeroSection from './components/HeroSection.vue'
import DogCarousel from './components/DogCarousel.vue'
import ProductCatalog from './views/ProductCatalog.vue'
import TierheimSection from './components/TierheimSection.vue'
import IdentifySection from './components/IdentifySection.vue'
import Footer from './components/Footer.vue'
</script>