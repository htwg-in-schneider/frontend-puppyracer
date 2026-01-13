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
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  font-family: var(--font-roboto);
  font-size: 0.95rem;
}

.btn-primary {
  background: var(--color-accent-pink); /* #E26191 */
  color: white;
}

.btn-primary:hover {
  background: #d04a7c; /* Dunkleres Pink */
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(226, 97, 145, 0.3);
}

.btn-secondary {
  background: var(--color-accent-brown); /* #B48665 */
  color: var(--color-primary-dark); /* #2D2121 */
}

.btn-secondary:hover {
  background: #a37854; /* Dunkleres Braun */
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(180, 134, 101, 0.3);
}

.nav-btn:active {
  transform: translateY(0);
}
</style>