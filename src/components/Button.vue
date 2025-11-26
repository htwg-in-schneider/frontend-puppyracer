<template>
  <button :class="['btn', variant]" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup>
defineProps({ variant: { type: String, default: 'accent' } })
</script>

<style scoped>
.btn { padding:.6rem 1rem; border-radius:8px; }
.btn.accent { background:#e26191; color:white; border:none; }
.btn.secondary { background:white; color:#e26191; border:2px solid #e26191; }
</style>