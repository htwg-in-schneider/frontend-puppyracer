<template>
  <Navbar />
  <SpecialBanner />
  <router-view />
  <Footer />
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import SpecialBanner from './components/SpecialBanner.vue'
import Footer from './components/Footer.vue'
</script>