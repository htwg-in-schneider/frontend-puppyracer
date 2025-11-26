<script setup>
</script>

<template>
  <Navbar />
  <SpecialBanner />
  <router-view /> <!-- später für Router -->
  <AppFooter />
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import SpecialBanner from '@/components/SpecialBanner.vue'
import AppFooter from '@/components/Footer.vue'
</script>
