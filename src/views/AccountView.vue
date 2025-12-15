<template>
  <div class="account-container">
    <!-- Dekorative Elemente -->
    <div class="decorative-elements">
      <div class="bg-paw bg-paw-1"></div>
      <div class="bg-paw bg-paw-2"></div>
    </div>

    <div class="account-spacer"></div>
    
    <div class="account-wrapper">
      <!-- Header -->
      <div class="account-header-section">
        <div class="header-content">
          <div class="avatar-container">
            <div class="avatar-circle">
              <i class="bi bi-person-circle avatar-icon"></i>
            </div>
          </div>
          <h1 class="account-title">Mein Konto</h1>
          <p class="account-subtitle">Verwalten Sie Ihre persönlichen Daten</p>
        </div>
      </div>

      <!-- Hauptinhalt -->
      <div class="account-main-content">
        <div class="form-container">
          <!-- Loading State -->
          <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
            <p>Lade Ihre persönlichen Daten...</p>
          </div>

          <!-- Account Form -->
          <div v-else class="form-content">
            <!-- Persönliche Daten Card -->
            <div class="form-card">
              <div class="card-header">
                <i class="bi bi-person-badge header-icon"></i>
                <div class="header-text">
                  <h2>Persönliche Daten</h2>
                  <p>Ihre Kontaktinformationen und Adresse</p>
                </div>
              </div>

              <form @submit.prevent="updateUser">
                <!-- Name -->
                <div class="form-group">
                  <label for="name">
                    <i class="bi bi-person-fill"></i>
                    Vollständiger Name
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="currentUser.name"
                    placeholder="Max Mustermann"
                    required
                  >
                </div>

                <!-- Email und Telefon -->
                <div class="form-row">
                  <div class="form-group">
                    <label for="email">
                      <i class="bi bi-envelope-fill"></i>
                      E-Mail Adresse
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      v-model="currentUser.email"
                      placeholder="max@mustermann.de"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label for="phone">
                      <i class="bi bi-telephone-fill"></i>
                      Telefonnummer
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      v-model="currentUser.phone"
                      placeholder="+49 123 456789"
                    >
                  </div>
                </div>

                <!-- Adresse -->
                <div class="form-group">
                  <label for="address">
                    <i class="bi bi-house-door-fill"></i>
                    Lieferadresse
                  </label>
                  <textarea 
                    id="address" 
                    v-model="currentUser.address"
                    placeholder="Musterstraße 123, 12345 Musterstadt"
                    rows="3"
                  ></textarea>
                </div>

                <!-- Submit Buttons -->
                <div class="form-actions">
                  <button type="button" class="btn-secondary" @click="resetForm">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    Zurücksetzen
                  </button>
                  <button type="submit" class="btn-primary">
                    <i class="bi bi-floppy-fill"></i>
                    Änderungen speichern
                  </button>
                </div>
              </form>
            </div>

            <!-- Schnellzugriffe -->
            <div class="quick-actions">
              <h3><i class="bi bi-lightning-fill"></i> Schnellzugriff</h3>
              <div class="quick-buttons">
                <router-link to="/warenkorb" class="quick-btn">
                  <i class="bi bi-cart-check-fill"></i>
                  <span>Warenkorb</span>
                </router-link>
                <router-link to="/" class="quick-btn">
                  <i class="bi bi-house-door-fill"></i>
                  <span>Startseite</span>
                </router-link>
                <button class="quick-btn" @click="logout">
                  <i class="bi bi-box-arrow-right"></i>
                  <span>Abmelden</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountView',
  data() {
    return {
      loading: true,
      currentUser: {
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      originalUser: {}
    };
  },
  mounted() {
    // Simuliere API-Call
    setTimeout(() => {
      this.currentUser = {
        name: 'Max Mustermann',
        email: 'max.mustermann@example.com',
        phone: '+49 123 456789',
        address: 'Hauptstraße 42\n12345 Berlin'
      };
      this.originalUser = { ...this.currentUser };
      this.loading = false;
    }, 800);
  },
  methods: {
    updateUser() {
      this.loading = true;
      setTimeout(() => {
        alert('Ihre Daten wurden erfolgreich aktualisiert!');
        this.originalUser = { ...this.currentUser };
        this.loading = false;
      }, 600);
    },
    resetForm() {
      this.currentUser = { ...this.originalUser };
    },
    logout() {
      if (confirm('Möchten Sie sich wirklich abmelden?')) {
        alert('Sie wurden erfolgreich abgemeldet.');
        // Hier würde normalerweise die Logout-Logik stehen
      }
    }
  }
};
</script>

<style scoped>
/* Grundlayout */
.account-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #8b7355 0%, #a8916d 30%, #cbbf9b 100%);
  padding-top: 160px;
  position: relative;
  overflow-x: hidden;
}

.account-spacer {
  height: 40px;
}

.decorative-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}

.bg-paw {
  position: absolute;
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.07);
  font-family: "Bootstrap Icons";
  opacity: 0.5;
}

.bg-paw-1 {
  top: 15%;
  left: 8%;
  content: "\f6b7";
  transform: rotate(20deg);
}

.bg-paw-2 {
  top: 50%;
  right: 12%;
  content: "\f6b7";
  transform: rotate(-30deg);
}

.account-wrapper {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.account-header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.header-content {
  padding: 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.avatar-circle {
  display: inline-block;
}

.avatar-icon {
  font-size: 4rem;
  color: white;
  background: linear-gradient(135deg, #e26191, #ff8fab);
  width: 100px;
  height: 100px;
  line-height: 100px;
  border-radius: 50%;
  display: block;
  box-shadow: 0 10px 25px rgba(226, 97, 145, 0.4);
  margin: 0 auto 1.5rem;
}

.account-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.account-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 3rem;
}

.loading-container p {
  color: white;
  margin-top: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #e26191;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Form Card */
.form-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  text-align: left;
}

.header-icon {
  font-size: 2rem;
  color: #e26191;
  margin-right: 1rem;
}

.header-text h2 {
  color: white;
  font-size: 1.5rem;
  margin: 0;
}

.header-text p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.9rem;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-group label i {
  color: #e26191;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #e26191;
  background: white;
  box-shadow: 0 0 0 3px rgba(226, 97, 145, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

/* Buttons */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: rgba(226, 97, 145, 0.8);
  color: white;
}

.btn-primary:hover {
  background: #e26191;
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Quick Actions */
.quick-actions {
  text-align: center;
}

.quick-actions h3 {
  color: white;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.quick-actions h3 i {
  color: #e26191;
}

.quick-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  background: rgba(203, 191, 155, 0.25);
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.quick-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .account-container {
    padding-top: 140px;
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .account-title {
    font-size: 2rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .quick-buttons {
    flex-direction: column;
  }
  
  .quick-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>