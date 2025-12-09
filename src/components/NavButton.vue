<script setup>
const props = defineProps({
  variant: { type: String, default: "accent" },
  to: { type: String, default: null }
});

// WICHTIG: Emits erlauben
const emit = defineEmits(["click"]);
</script>

<template>
  <button
    class="btn"
    :class="['btn-' + variant]"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  border: none;
  padding: 0.6rem 1.2rem;
  font-weight: bold;
  border-radius: 8px;
}

.btn-dark {
  background-color: #333;
  color: white;
}
</style>