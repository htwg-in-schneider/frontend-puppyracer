<template>
  <Navbar />
  
  <!-- SpecialBanner NUR auf Startseite -->
  <SpecialBanner v-if="route.path === '/'" />
  

  <router-view />
  
  <ProductCarousel v-if="route.path === '/'" />
  
  <Footer />
</template>

<script setup>
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import SpecialBanner from './components/SpecialBanner.vue'
import ProductCarousel from './components/ProductCarousel.vue'

const route = useRoute()
</script>