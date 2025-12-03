<template>
<div id="specialbanner" class="text-center py-3">
  Viele Sonderangebote heute!&nbsp;&nbsp;
  <Button variant="dark" @click="hideBanner">OK!</Button>
</div>
</template>

<script setup>
import { ref } from 'vue';

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
