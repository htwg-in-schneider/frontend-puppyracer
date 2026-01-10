<template>
  <aside class="filter" aria-label="Produktfilter">
    <div class="filter-box">
      <h3 id="filter-heading"><i class="bi bi-funnel"></i> Sortierung</h3>
      
      <button 
        class="sort-btn" 
        @click="toggleDropdown" 
        :aria-expanded="showDropdown"
        :aria-controls="dropdownId"
        :aria-labelledby="filter-heading"
      >
        {{ getSortLabel(selectedSort) }} 
        <i class="arrow" :class="{ open: showDropdown }">▼</i>
      </button>
      
      <div 
        v-if="showDropdown" 
        :id="dropdownId"
        class="dropdown"
        role="listbox"
        :aria-labelledby="filter-heading"
      >
        <button 
          v-for="opt in options" 
          :key="opt.value" 
          :class="['option', { active: selectedSort === opt.value }]"
          @click="selectOption(opt.value)"
          role="option"
          :aria-selected="selectedSort === opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
      
      <button 
        class="reset-btn" 
        @click="reset"
        :disabled="selectedSort === 'default'"
        aria-label="Filter zurücksetzen"
      >
        <i class="bi bi-arrow-counterclockwise"></i> Zurücksetzen
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['filterChange'])
const showDropdown = ref(false)
const selectedSort = ref('default')

const dropdownId = computed(() => `filter-dropdown-${Math.random().toString(36).substr(2, 9)}`)

const options = [
  { value: 'default', label: 'Standard' },
  { value: 'newest', label: 'Neueste' },
  { value: 'price-low', label: 'Preis aufsteigend' },
  { value: 'price-high', label: 'Preis absteigend' }
]

const getSortLabel = (value) => {
  return options.find(o => o.value === value)?.label || 'Standard'
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectOption = (value) => {
  selectedSort.value = value
  showDropdown.value = false
  emit('filterChange', { sort: value })
}

const reset = () => {
  selectedSort.value = 'default'
  showDropdown.value = false
  emit('filterChange', {})
}
</script>

<style scoped>
.filter {
  position: sticky;
  top: 120px;
}

.filter-box {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.filter-box h3 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-btn {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.sort-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sort-btn:focus {
  outline: 2px solid var(--color-accent-pink);
  outline-offset: 2px;
}

.arrow {
  font-size: 0.8rem;
  transition: transform 0.3s;
}

.arrow.open {
  transform: rotate(180deg);
}

.dropdown {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  margin-top: 0.5rem;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border: 1px solid rgba(0,0,0,0.1);
}

.option {
  width: 100%;
  padding: 0.75rem;
  border: none;
  background: none;
  color: var(--color-primary-dark);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: var(--font-roboto);
}

.option:hover {
  background: rgba(226, 97, 145, 0.1);
}

.option.active {
  background: rgba(226, 97, 145, 0.2);
  color: var(--color-accent-pink);
  font-weight: 600;
}

.reset-btn {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  font-family: var(--font-roboto);
}

.reset-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .filter {
    position: static;
    margin-bottom: 1rem;
  }
}
</style>