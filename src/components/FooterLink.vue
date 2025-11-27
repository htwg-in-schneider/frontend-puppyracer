<template>
  <a :href="href" class="footer-link"><slot /></a>
</template>

<script setup>
defineProps({ href: String })
</script>

<style scoped>
.footer-link { color: #666; text-decoration: none; }
</style>