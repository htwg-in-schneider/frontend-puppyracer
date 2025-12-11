<template>
  <div class="account-container">
    <!-- Dekorative Elemente -->
    <div class="decorative-elements">
      <div class="deco-circle deco-1"></div>
      <div class="deco-circle deco-2"></div>
      <div class="deco-circle deco-3"></div>
      <div class="deco-paw deco-4"></div>
      <div class="deco-paw deco-5"></div>
    </div>

    <!-- Header mit Abstand -->
    <div class="account-spacer"></div>
    
    <div class="account-wrapper">
      <!-- Header Bereich mit mehr Abstand -->
      <div class="account-header-section">
        <div class="header-content">
          <div class="avatar-container">
            <div class="avatar-circle">
              <i class="bi bi-person-circle avatar-icon"></i>
              <div class="avatar-glow"></div>
            </div>
          </div>
          <h1 class="account-title">Mein Konto</h1>
          <p class="account-subtitle">Verwalten Sie Ihre persönlichen Daten und Einstellungen</p>
        </div>
      </div>

      <!-- Hauptinhalt -->
      <div class="account-main-content">
        <div class="form-container">
          <!-- Loading State -->
          <div v-if="loading" class="loading-container">
            <div class="spinner-wrapper">
              <div class="spinner"></div>
            </div>
            <p class="loading-text">Lade Ihre persönlichen Daten...</p>
          </div>

          <!-- Account Form -->
          <div v-else class="form-content">
            <!-- Persönliche Daten Card -->
            <div class="form-card personal-data-card">
              <div class="card-header">
                <div class="header-icon">
                  <i class="bi bi-person-badge"></i>
                </div>
                <div class="header-text">
                  <h2>Persönliche Daten</h2>
                  <p>Ihre Kontaktinformationen und Adresse</p>
                </div>
              </div>

              <form @submit.prevent="updateUser" class="centered-form">
                <!-- Name -->
                <div class="form-row">
                  <div class="input-group centered-input">
                    <label for="name" class="input-label">
                      <i class="bi bi-person-fill"></i>
                      Vollständiger Name
                    </label>
                    <div class="input-wrapper">
                      <input 
                        type="text" 
                        id="name" 
                        v-model="currentUser.name"
                        placeholder="Max Mustermann"
                        required
                        class="form-input"
                      >
                      <div class="input-underline"></div>
                    </div>
                    <div class="input-hint">Wie wir Sie ansprechen dürfen</div>
                  </div>
                </div>

                <!-- Email und Telefon -->
                <div class="form-row double-row">
                  <div class="input-group centered-input">
                    <label for="email" class="input-label">
                      <i class="bi bi-envelope-fill"></i>
                      E-Mail Adresse
                    </label>
                    <div class="input-wrapper">
                      <input 
                        type="email" 
                        id="email" 
                        v-model="currentUser.email"
                        placeholder="max@mustermann.de"
                        required
                        class="form-input"
                      >
                      <div class="input-underline"></div>
                    </div>
                    <div class="input-hint">Für Benachrichtigungen und Login</div>
                  </div>

                  <div class="input-group centered-input">
                    <label for="phone" class="input-label">
                      <i class="bi bi-telephone-fill"></i>
                      Telefonnummer
                    </label>
                    <div class="input-wrapper">
                      <input 
                        type="tel" 
                        id="phone" 
                        v-model="currentUser.phone"
                        placeholder="+49 123 456789"
                        class="form-input"
                      >
                      <div class="input-underline"></div>
                    </div>
                    <div class="input-hint">Optional für Rückfragen</div>
                  </div>
                </div>

                <!-- Adresse -->
                <div class="form-row">
                  <div class="input-group centered-input">
                    <label for="address" class="input-label">
                      <i class="bi bi-house-door-fill"></i>
                      Lieferadresse
                    </label>
                    <div class="input-wrapper">
                      <textarea 
                        id="address" 
                        v-model="currentUser.address"
                        placeholder="Musterstraße 123, 12345 Musterstadt"
                        rows="3"
                        class="form-textarea"
                      ></textarea>
                      <div class="textarea-underline"></div>
                    </div>
                    <div class="input-hint">Für Ihre Bestellungen</div>
                  </div>
                </div>

                <!-- Submit Buttons im Navbar-Stil -->
                <div class="form-actions">
                  <div class="button-group">
                    <button type="button" class="btn-navbar-secondary" @click="resetForm">
                      <i class="bi bi-arrow-counterclockwise me-2"></i>
                      Zurücksetzen
                    </button>
                    <button type="submit" class="btn-navbar-primary">
                      <i class="bi bi-floppy-fill me-2"></i>
                      Änderungen speichern
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <!-- Account Übersicht -->
            <div class="stats-container">
              <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #e26191, #ff8fab);">
                  <i class="bi bi-calendar-heart"></i>
                </div>
                <div class="stat-content">
                  <h3>Mitglied seit</h3>
                  <p class="stat-value">{{ memberSince }}</p>
                  <p class="stat-desc">{{ membershipDuration }}</p>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #cbbf9b, #e0d6b2);">
                  <i class="bi bi-bag-check"></i>
                </div>
                <div class="stat-content">
                  <h3>Bestellungen</h3>
                  <p class="stat-value">{{ orderCount }}</p>
                  <p class="stat-desc">Aktive Bestellungen: 1</p>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #a8e6cf, #dcedc1);">
                  <i class="bi bi-star-fill"></i>
                </div>
                <div class="stat-content">
                  <h3>Treuepunkte</h3>
                  <p class="stat-value">{{ loyaltyPoints }}</p>
                  <p class="stat-desc">Punkte gesammelt</p>
                </div>
              </div>
            </div>

            <!-- Schnellzugriffe mit Navbar-Button-Stil -->
            <div class="quick-actions">
              <h3 class="quick-actions-title">
                <i class="bi bi-lightning-fill me-2"></i>
                Schnellzugriff
              </h3>
              <div class="quick-buttons">
                <router-link to="/warenkorb" class="quick-btn-navbar">
                  <i class="bi bi-cart-check-fill me-2"></i>
                  <span>Warenkorb</span>
                </router-link>
                <router-link to="/" class="quick-btn-navbar">
                  <i class="bi bi-house-door-fill me-2"></i>
                  <span>Startseite</span>
                </router-link>
                <a href="#" class="quick-btn-navbar" @click.prevent="showOrderHistory">
                  <i class="bi bi-clock-history me-2"></i>
                  <span>Bestellverlauf</span>
                </a>
                <a href="#" class="quick-btn-navbar" @click.prevent="logout">
                  <i class="bi bi-box-arrow-right me-2"></i>
                  <span>Abmelden</span>
                </a>
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
      originalUser: {},
      memberSince: '15.03.2024',
      orderCount: 5,
      loyaltyPoints: 1250
    };
  },
  computed: {
    membershipDuration() {
      return '3 Monate Mitglied';
    }
  },
  mounted() {
    setTimeout(() => {
      this.currentUser = {
        name: 'Max Mustermann',
        email: 'max.mustermann@example.com',
        phone: '+49 123 456789',
        address: 'Hauptstraße 42\n12345 Berlin'
      };
      this.originalUser = { ...this.currentUser };
      this.loading = false;
    }, 1000);
  },
  methods: {
    updateUser() {
      this.loading = true;
      setTimeout(() => {
        alert('Ihre Daten wurden erfolgreich aktualisiert!');
        this.originalUser = { ...this.currentUser };
        this.loading = false;
      }, 800);
    },
    resetForm() {
      this.currentUser = { ...this.originalUser };
    },
    showOrderHistory() {
      alert('Hier würde Ihr Bestellverlauf angezeigt werden.');
    },
    logout() {
      if (confirm('Möchten Sie sich wirklich abmelden?')) {
        alert('Sie wurden erfolgreich abgemeldet.');
      }
    }
  }
};
</script>

<style scoped>
/* Haupt-Container mit braunem Hintergrund */
.account-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #8b7355 0%, #a8916d 30%, #cbbf9b 100%);
  padding-top: 160px; /* Abstand wegen fixed Navbar */
  position: relative;
  overflow-x: hidden;
}

/* Spacer für mehr Abstand unter der Navbar */
.account-spacer {
  height: 60px; /* Zusätzlicher Abstand */
}

/* Dekorative Elemente */
.decorative-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
}

.deco-1 {
  width: 150px;
  height: 150px;
  top: 15%;
  left: 5%;
  background: rgba(226, 97, 145, 0.1);
}

.deco-2 {
  width: 200px;
  height: 200px;
  top: 40%;
  right: 8%;
  background: rgba(203, 191, 155, 0.15);
}

.deco-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 15%;
  background: rgba(255, 255, 255, 0.08);
}

.deco-paw {
  position: absolute;
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.07);
  font-family: "Bootstrap Icons";
}

.deco-4 {
  top: 25%;
  right: 15%;
  content: "\f6b7";
}

.deco-5 {
  bottom: 30%;
  left: 8%;
  content: "\f6b7";
  transform: rotate(45deg);
}

.account-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header Section mit mehr Abstand */
.account-header-section {
  text-align: center;
  margin-bottom: 4rem; /* Mehr Abstand nach unten */
  padding-top: 2rem; /* Zusätzlicher Abstand oben */
}

.header-content {
  display: inline-block;
  padding: 2.5rem 3rem;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.avatar-container {
  margin-bottom: 2rem;
}

.avatar-circle {
  position: relative;
  display: inline-block;
}

.avatar-icon {
  font-size: 5rem;
  color: white;
  background: linear-gradient(135deg, #e26191, #ff8fab);
  width: 140px;
  height: 140px;
  line-height: 140px;
  border-radius: 50%;
  display: block;
  box-shadow: 
    0 15px 35px rgba(226, 97, 145, 0.4),
    0 0 0 8px rgba(255, 255, 255, 0.2);
  z-index: 1;
  position: relative;
}

.avatar-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, rgba(226, 97, 145, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.account-title {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(255, 255, 255, 0.2);
}

.account-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  max-width: 500px;
  margin: 0 auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* Form Container */
.account-main-content {
  background: transparent;
}

.form-container {
  max-width: 1000px;
  margin: 0 auto;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 4rem;
}

.spinner-wrapper {
  display: inline-block;
  padding: 2rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #e26191;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* Form Content */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* Personal Data Card */
.personal-data-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 25px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 2.5rem;
  text-align: center;
  justify-content: center;
}

.header-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #e26191, #ff8fab);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  color: white;
  font-size: 2rem;
  box-shadow: 0 10px 20px rgba(226, 97, 145, 0.3);
}

.header-text h2 {
  color: white;
  font-weight: 700;
  margin-bottom: 0.25rem;
  font-size: 1.8rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.header-text p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/* Centered Form */
.centered-form {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.form-row {
  margin-bottom: 2rem;
}

.double-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.centered-input {
  text-align: center;
}

.input-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.input-label i {
  color: #e26191;
  font-size: 1.2rem;
}

.input-wrapper {
  position: relative;
  margin: 0 auto;
  max-width: 500px;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 1.25rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  font-family: inherit;
  color: #333;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #e26191;
  background: white;
  box-shadow: 
    0 5px 20px rgba(226, 97, 145, 0.3),
    0 0 0 3px rgba(226, 97, 145, 0.1);
}

.input-underline, .textarea-underline {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #e26191, #ff8fab);
  transition: width 0.3s ease;
}

.form-input:focus ~ .input-underline,
.form-textarea:focus ~ .textarea-underline {
  width: 80%;
}

.input-hint {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
}

/* Buttons im Navbar-Stil */
.form-actions {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

/* Primärer Button wie in der Navbar */
.btn-navbar-primary {
  padding: 1rem 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  background: rgba(203, 191, 155, 0.25);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: 48px;
  text-decoration: none !important;
  outline: none !important;
}

.btn-navbar-primary:hover {
  color: #e26191;
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.btn-navbar-primary:active {
  transform: translateY(-1px);
}

/* Sekundärer Button wie in der Navbar */
.btn-navbar-secondary {
  padding: 1rem 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: 48px;
  text-decoration: none !important;
  outline: none !important;
}

.btn-navbar-secondary:hover {
  color: #e26191;
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Stats Container */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.stat-content h3 {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
}

.stat-value {
  color: #e26191;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.stat-desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin: 0;
}

/* Quick Actions mit Navbar-Buttons */
.quick-actions {
  margin-top: 3rem;
  text-align: center;
  padding-top: 2rem;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
}

.quick-actions-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.quick-actions-title i {
  color: #e26191;
}

.quick-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Quick Buttons im Navbar-Stil */
.quick-btn-navbar {
  display: inline-flex;
  align-items: center;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  background: rgba(203, 191, 155, 0.25);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: 48px;
  text-decoration: none !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  outline: none !important;
}

.quick-btn-navbar:hover {
  color: #e26191;
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  text-decoration: none !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .account-container {
    padding-top: 140px;
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .account-spacer {
    height: 40px;
  }
  
  .account-title {
    font-size: 2.2rem;
  }
  
  .header-content {
    padding: 2rem;
  }
  
  .personal-data-card {
    padding: 1.5rem;
  }
  
  .double-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .btn-navbar-primary, .btn-navbar-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .quick-buttons {
    flex-direction: column;
  }
  
  .quick-btn-navbar {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .account-title {
    font-size: 1.8rem;
  }
  
  .header-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    margin-right: 1rem;
  }
  
  .header-text h2 {
    font-size: 1.4rem;
  }
  
  .card-header {
    flex-direction: column;
    text-align: center;
  }
  
  .header-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .avatar-icon {
    width: 100px;
    height: 100px;
    line-height: 100px;
    font-size: 4rem;
  }
}

/* Animationen */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.personal-data-card {
  animation: fadeInUp 0.6s ease-out;
}

.stat-card {
  animation: fadeInUp 0.8s ease-out;
}

.quick-btn-navbar {
  animation: fadeInUp 1s ease-out;
}

.form-row {
  animation: fadeInUp 0.7s ease-out;
}
</style>