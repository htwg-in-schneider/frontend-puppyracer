<template>
  <div v-if="banner.isVisible" class="banner">
    <span>Special Offer!</span>
    <button @click="banner.hideBanner()">Close</button>
  </div>
</template>

<script setup>
import { useBannerStore } from '../stores/banner.js'

const banner = useBannerStore()
</script>

<style scoped>
.banner { background: yellow; padding: 1rem; display: flex; justify-content: space-between; }
</style>