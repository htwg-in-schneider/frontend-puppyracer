 <template>
  <div class="filter">
    <div class="filter-box">
      <h3><i class="bi bi-funnel"></i> Sortierung</h3>
      
      <button class="sort-btn" @click="toggleDropdown">
        {{ getSortLabel(selectedSort) }} <i class="arrow">▼</i>
      </button>
      
      <div v-if="showDropdown" class="dropdown">
        <button v-for="opt in options" :key="opt.value" 
                :class="['option', { active: selectedSort === opt.value }]"
                @click="selectOption(opt.value)">
          {{ opt.label }}
        </button>
      </div>
      
      <button class="reset-btn" @click="reset">
        <i class="bi bi-arrow-counterclockwise"></i> Zurücksetzen
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['filterChange']);
const showDropdown = ref(false);
const selectedSort = ref('default');

const options = [
  { value: 'default', label: 'Standard' },
  { value: 'newest', label: 'Neueste' },
  { value: 'price-low', label: 'Preis ↑' },
  { value: 'price-high', label: 'Preis ↓' }
];

function getSortLabel(value) {
  return options.find(o => o.value === value)?.label || 'Standard';
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function selectOption(value) {
  selectedSort.value = value;
  showDropdown.value = false;
  emit('filterChange', { sort: value });
}

function reset() {
  selectedSort.value = 'default';
  showDropdown.value = false;
  emit('filterChange', {});
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
}

.option {
  width: 100%;
  padding: 0.75rem;
  border: none;
  background: none;
  color: #333;
  text-align: left;
  cursor: pointer;
}

.option:hover {
  background: rgba(226, 97, 145, 0.1);
}

.option.active {
  background: rgba(226, 97, 145, 0.2);
  color: #e26191;
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
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>