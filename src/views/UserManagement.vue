<template>
  <div class="admin-container">
    <div class="admin-header">
      <h1 class="admin-title">Benutzerverwaltung</h1>
    </div>

    <div class="control-bar">
      <div class="control-left">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input v-model="searchQuery" placeholder="Benutzer suchen..." />
        </div>
        <select v-model="roleFilter">
          <option value="">Alle Rollen</option>
          <option value="ADMIN">Administratoren</option>
          <option value="BUYER">Kunden</option>
        </select>
      </div>
      <button @click="loadUsers" class="btn-refresh" :disabled="loading">
        <i class="bi bi-arrow-clockwise"></i>
        <span>Aktualisieren</span>
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Benutzer werden geladen...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon"><i class="bi bi-shield-exclamation"></i></div>
      <div>
        <h3>Zugriff verweigert</h3>
        <p>{{ error }}</p>
      </div>
    </div>

    <div v-else class="user-table-container">
      <div class="table-responsive">
        <table class="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Rolle</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td><span class="id-badge">#{{ user.id }}</span></td>
              <td>
                <input 
                  v-model="user.name" 
                  :disabled="savingUserId === user.id"
                  @blur="saveUser(user)"
                  placeholder="Name"
                />
              </td>
              <td>
                <input 
                  v-model="user.email" 
                  type="email"
                  :disabled="savingUserId === user.id"
                  @blur="saveUser(user)"
                  placeholder="E-Mail"
                />
              </td>
              <td>
                <select 
                  v-model="user.role" 
                  :disabled="savingUserId === user.id"
                  @change="saveUser(user)"
                  :class="getRoleClass(user.role)"
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="SELLER">Verkäufer</option>
                  <option value="BUYER">Kunde</option>
                </select>
              </td>
              <td>
                <button 
                  @click="saveUser(user)" 
                  class="btn-save"
                  :disabled="savingUserId === user.id || !isUserChanged(user)"
                >
                  <span v-if="savingUserId === user.id" class="save-spinner"></span>
                  <i v-else class="bi bi-check-lg"></i>
                  <span>Speichern</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredUsers.length === 0 && !loading" class="empty-state">
        <i class="bi bi-person-slash"></i>
        <h3>Keine Benutzer gefunden</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

const { getAccessTokenSilently, isAuthenticated } = useAuth0()
const users = ref([])
const loading = ref(true)
const error = ref('')
const savingUserId = ref(null)
const searchQuery = ref('')
const roleFilter = ref('')
const originalUsers = ref(new Map())

const filteredUsers = computed(() => {
  let filtered = users.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      (user.name?.toLowerCase().includes(query)) ||
      (user.email?.toLowerCase().includes(query))
    )
  }
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }
  return filtered
})

const getRoleClass = (role) => role.toLowerCase()

const isUserChanged = (user) => {
  const original = originalUsers.value.get(user.id)
  if (!original) return false
  return user.name !== original.name || 
         user.email !== original.email || 
         user.role !== original.role
}

async function loadUsers() {
  if (!isAuthenticated.value) {
    error.value = 'Bitte anmelden'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    const token = await getAccessTokenSilently()
    
    // Profil prüfen
    const profileRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    const profileData = await profileRes.json()
    const isAdmin = profileData.role === 'ADMIN'
    
    if (!isAdmin) {
      throw new Error('Zugriff verweigert: Nur Administratoren')
    }
    
    // Benutzer laden
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    const data = await response.json()
    
    users.value = data
    originalUsers.value = new Map(data.map(user => [user.id, { ...user }]))
    
  } catch (err) {
    error.value = err.message.includes('Zugriff') ? err.message : `Fehler: ${err.message}`
    users.value = []
  } finally {
    loading.value = false
  }
}

async function saveUser(user) {
  if (!user?.id || !isUserChanged(user)) return
  
  savingUserId.value = user.id
  try {
    const token = await getAccessTokenSilently()
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        name: user.name?.trim(), 
        email: user.email?.trim(), 
        role: user.role 
      })
    })
    originalUsers.value.set(user.id, { ...user })
  } catch (err) {
    alert(`Speichern fehlgeschlagen: ${err.message}`)
    const original = originalUsers.value.get(user.id)
    if (original) Object.assign(user, original)
  } finally {
    savingUserId.value = null
  }
}

watch(isAuthenticated, (newVal) => {
  if (newVal) loadUsers()
  else {
    users.value = []
    error.value = ''
    loading.value = false
  }
}, { immediate: true })
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #EFE1D6;
  font-family: 'Segoe UI', sans-serif;
  color: #5D4037;
}

.admin-header {
  padding: 2rem;
  background: linear-gradient(135deg, #E26191, #B48665);
  color: white;
}

.admin-title {
  font-size: 2rem;
  margin: 0;
  font-weight: 600;
}

.control-bar {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  margin: 1rem;
  border-radius: 12px;
  align-items: center;
}

.control-left {
  display: flex;
  flex: 1;
  gap: 1rem;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #BB9580;
}

.search-box input, select {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #F5F0EB;
  border-radius: 8px;
  background: #F5F0EB;
  font-size: 1rem;
  color: #5D4037;
}

.btn-refresh {
  padding: 0.75rem 1.5rem;
  background: #BB9580;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-refresh:hover:not(:disabled) {
  background: #B48665;
}

.btn-refresh:disabled {
  opacity: 0.5;
}

.loading-state, .error-state, .empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background: white;
  margin: 1rem;
  border-radius: 12px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #F5F0EB;
  border-top-color: #E26191;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.save-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

.error-state {
  background: #FFF5F7;
}

.error-icon {
  font-size: 2.5rem;
  color: #E26191;
  margin-bottom: 1rem;
}

.user-table-container {
  flex: 1;
  background: white;
  margin: 0 1rem 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

.table-responsive {
  overflow-x: auto;
}

.user-table {
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
}

.user-table thead {
  background: linear-gradient(135deg, #B48665, #BB9580);
}

.user-table th {
  padding: 1rem;
  color: white;
  text-align: left;
  font-weight: 600;
}

.user-table td {
  padding: 1rem;
  border-bottom: 1px solid #F5F0EB;
}

.id-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(180, 134, 101, 0.1);
  border-radius: 6px;
  color: #B48665;
  font-weight: 600;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #F5F0EB;
  border-radius: 8px;
  background: #F5F0EB;
  font-size: 1rem;
  color: #5D4037;
}

input:focus, select:focus {
  outline: none;
  border-color: #E26191;
  background: white;
}

select {
  cursor: pointer;
}

.role-select.admin { color: #E26191; }
.role-select.seller { color: #B48665; }
.role-select.buyer { color: #BB9580; }

.btn-save {
  padding: 0.6rem 1.2rem;
  background: #E26191;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-save:hover:not(:disabled) {
  background: #D45A87;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-state {
  color: #BB9580;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #5D4037;
  margin: 0;
}

@media (max-width: 768px) {
  .admin-header { padding: 1.5rem 1rem; }
  .admin-title { font-size: 1.5rem; }
  .control-bar { margin: 0.5rem; padding: 1rem; flex-direction: column; }
  .control-left { width: 100%; margin-bottom: 1rem; }
}
</style>