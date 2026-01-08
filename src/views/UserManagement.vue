<template>
  <div class="admin-container">
    <!-- Header -->
    <div class="admin-header">
      <h1 class="admin-title">Benutzerverwaltung</h1>
    </div>

    <!-- Control Bar -->
    <div class="control-bar">
      <div class="control-left">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input 
            v-model="searchQuery" 
            placeholder="Benutzer suchen..." 
            class="search-input"
          />
        </div>
        <select v-model="roleFilter" class="filter-select">
          <option value="">Alle Rollen</option>
          <option value="ADMIN">Administratoren</option>
          <option value="SELLER">Verkäufer</option>
          <option value="BUYER">Kunden</option>
        </select>
      </div>
      <button @click="loadUsers" class="btn-refresh" :disabled="loading">
        <i class="bi bi-arrow-clockwise"></i>
        <span>Aktualisieren</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Benutzer werden geladen...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon"><i class="bi bi-shield-exclamation"></i></div>
      <div class="error-content">
        <h3>Zugriff verweigert</h3>
        <p>{{ error }}</p>
        <button v-if="error.includes('Admin')" @click="loginWithRedirect" class="btn-login">
          Mit Admin-Account anmelden
        </button>
      </div>
    </div>

    <!-- User Table -->
    <div v-else class="user-table-container">
      <div class="table-responsive">
        <table class="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>E-Mail</th>
              <th class="hide-mobile">Auth0 ID</th>
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
                  class="form-input"
                  :disabled="savingUserId === user.id"
                  @blur="saveUser(user)"
                  placeholder="Name"
                />
              </td>
              <td>
                <input 
                  v-model="user.email" 
                  type="email"
                  class="form-input"
                  :disabled="savingUserId === user.id"
                  @blur="saveUser(user)"
                  placeholder="E-Mail"
                />
              </td>
              <td class="hide-mobile">
                <div class="auth-id-container">
                  <code>{{ truncateOauthId(user.oauthId) }}</code>
                </div>
              </td>
              <td>
                <select 
                  v-model="user.role" 
                  class="role-select"
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
                  :disabled="savingUserId === user.id"
                >
                  <span v-if="savingUserId === user.id" class="save-spinner"></span>
                  <i v-else class="bi bi-check-lg"></i>
                  <span class="hide-mobile">Speichern</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0 && !loading" class="empty-state">
        <i class="bi bi-person-slash"></i>
        <h3>Keine Benutzer gefunden</h3>
        <p v-if="searchQuery || roleFilter">Filter anpassen</p>
        <p v-else>Keine Benutzer registriert</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="admin-footer">
      <span>Benutzerverwaltung</span>
      <span>{{ filteredUsers.length }}/{{ users.length }} Benutzer</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

const { getAccessTokenSilently, loginWithRedirect } = useAuth0()
const users = ref([])
const loading = ref(true)
const error = ref('')
const savingUserId = ref(null)
const searchQuery = ref('')
const roleFilter = ref('')

const filteredUsers = computed(() => {
  let filtered = users.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      (user.name?.toLowerCase().includes(query)) ||
      (user.email?.toLowerCase().includes(query))
    )
  }
  if (roleFilter.value) filtered = filtered.filter(user => user.role === roleFilter.value)
  return filtered
})

const truncateOauthId = (oauthId) => oauthId ? `${oauthId.substring(0, 8)}...${oauthId.substring(oauthId.length - 4)}` : ''
const getRoleClass = (role) => role.toLowerCase()

async function loadUsers() {
  loading.value = true
  error.value = ''
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch('http://localhost:8081/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.status === 403) error.value = 'Zugriff verweigert! Nur Administratoren.'
    else if (response.status === 401) error.value = 'Bitte anmelden.'
    else if (!response.ok) throw new Error(`Server-Fehler: ${response.status}`)
    else users.value = await response.json()
  } catch (err) {
    error.value = err.message.includes('login_required') 
      ? 'Sitzung abgelaufen. Bitte neu anmelden.'
      : `Fehler: ${err.message}`
  } finally {
    loading.value = false
  }
}

async function saveUser(user) {
  if (!user?.id) return
  savingUserId.value = user.id
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`http://localhost:8081/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: user.name, email: user.email, role: user.role })
    })
    if (!response.ok) alert(response.status === 403 
      ? 'Fehlende Berechtigung! Nur Administratoren.'
      : 'Speichern fehlgeschlagen.')
  } catch (err) {
    alert('Netzwerkfehler.')
  } finally {
    savingUserId.value = null
  }
}

onMounted(loadUsers)
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.admin-title {
  font-size: 2rem;
  margin: 0;
  font-weight: 600;
}

.control-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  margin: 1rem;
  border-radius: 12px;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid rgba(180, 134, 101, 0.1);
}

.control-left {
  display: flex;
  flex: 1;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #BB9580;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #F5F0EB;
  border-radius: 8px;
  background: #F5F0EB;
  font-size: 1rem;
  color: #5D4037;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #E26191;
  background: white;
  box-shadow: 0 0 0 3px rgba(226, 97, 145, 0.1);
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #F5F0EB;
  border-radius: 8px;
  background: #F5F0EB;
  min-width: 180px;
  font-size: 1rem;
  color: #5D4037;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #E26191;
  background: white;
}

.btn-refresh {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #BB9580, #B48665);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-refresh:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(187, 149, 128, 0.3);
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  border-left: 4px solid #E26191;
}

.error-icon {
  font-size: 2.5rem;
  color: #E26191;
  margin-bottom: 1rem;
}

.btn-login {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #BB9580;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-login:hover {
  background: #B48665;
  transform: translateY(-2px);
}

.user-table-container {
  flex: 1;
  background: white;
  margin: 0 1rem 1rem;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.table-responsive {
  flex: 1;
  overflow-x: auto;
}

.user-table {
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;
}

.user-table thead {
  background: linear-gradient(135deg, #B48665, #BB9580);
}

.user-table th {
  padding: 1.25rem 1rem;
  color: white;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-table td {
  padding: 1rem;
  border-bottom: 1px solid #F5F0EB;
}

.user-table tbody tr:hover {
  background-color: rgba(239, 225, 214, 0.3);
}

.id-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(180, 134, 101, 0.1);
  border-radius: 6px;
  color: #B48665;
  font-weight: 600;
  font-size: 0.85rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #F5F0EB;
  border-radius: 8px;
  background: #F5F0EB;
  font-size: 1rem;
  color: #5D4037;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #E26191;
  background: white;
  box-shadow: 0 0 0 3px rgba(226, 97, 145, 0.1);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.role-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #F5F0EB;
  border-radius: 8px;
  background: #F5F0EB;
  font-size: 1rem;
  color: #5D4037;
  cursor: pointer;
  transition: all 0.2s;
}

.role-select:focus {
  outline: none;
  border-color: #E26191;
  background: white;
  box-shadow: 0 0 0 3px rgba(226, 97, 145, 0.1);
}

.role-select.admin { 
  color: #E26191;
  border-color: rgba(226, 97, 145, 0.3);
}

.role-select.seller { 
  color: #B48665;
  border-color: rgba(180, 134, 101, 0.3);
}

.role-select.buyer { 
  color: #BB9580;
  border-color: rgba(187, 149, 128, 0.3);
}

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
  transition: all 0.2s;
}

.btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #E26191, #D45A87);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(226, 97, 145, 0.2);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.admin-footer {
  padding: 1.25rem;
  background: white;
  border-top: 1px solid #F5F0EB;
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #B48665;
  font-size: 0.9rem;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
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
  margin: 0 0 0.5rem 0;
}

@media (max-width: 768px) {
  .admin-header { 
    padding: 1.5rem 1rem; 
    text-align: center;
  }
  
  .admin-title { 
    font-size: 1.5rem; 
  }
  
  .control-bar { 
    margin: 0.5rem; 
    padding: 1rem; 
    flex-direction: column;
    align-items: stretch;
  }
  
  .control-left { 
    width: 100%; 
    margin-bottom: 1rem;
  }
  
  .search-box, .filter-select { 
    min-width: 100%; 
  }
  
  .user-table-container { 
    margin: 0 0.5rem 0.5rem; 
  }
  
  .hide-mobile { 
    display: none; 
  }
  
  .admin-footer { 
    flex-direction: column; 
    gap: 0.5rem; 
    text-align: center; 
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .btn-refresh span, .btn-save span { 
    display: none; 
  }
  
  .btn-refresh, .btn-save { 
    padding: 0.75rem; 
    justify-content: center;
  }
  
  .user-table th, .user-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>