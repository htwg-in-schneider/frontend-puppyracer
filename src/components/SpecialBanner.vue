<template>
  <div v-if="bannerVisible" id="specialbanner" class="text-center py-3">
    Viele Sonderangebote heute!&nbsp;&nbsp;
    <NavButton variant="dark" @click="hideBanner">OK!</NavButton>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NavButton from './NavButton.vue'; // Button ersetzen!

const bannerVisible = ref(true);

function hideBanner() {
  bannerVisible.value = false;
}
</script>

<style scoped>
#specialbanner {
  background-color: #ff6600;
  color: white;
  text-align: center;
  padding: 1rem 0;
}
</style>