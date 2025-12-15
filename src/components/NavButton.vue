<template>
  <button 
    :class="['nav-btn', `btn-${variant}`]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }
})
defineEmits(['click'])
</script>

<style scoped>
.nav-btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.btn-primary {
  background: rgba(203, 191, 155, 0.25);
  color: white;
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #e26191;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  color: #e26191;
}
</style>