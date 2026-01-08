<!-- HeroSection.vue - Optimierte Version -->
<template>
  <div>
    <section class="hero">
      <img 
        src="../assets/dog_pics/young-couple-husky.jpg" 
        alt="Junges Paar mit Husky" 
        class="hero-image"
        loading="lazy"
      >
      <div class="hero-overlay"></div>
      <div class="hero-text">
        <h1 class="text-light">Willkommen auf <strong>PuppyRacer!</strong></h1>
        <h2 class="text-light">Die Webseite, wo du alles für deinen Hund findest!</h2>
      </div>
    </section>

    <section class="contact-section bg-light">
      <div class="contact-container">
        <h2 class="text-primary">Kontaktieren Sie uns</h2>
        <p class="text-secondary">Haben Sie Fragen zu unseren Produkten? Schreiben Sie uns!</p>
        
        <form @submit.prevent="sendContact" class="contact-form">
          <div class="form-group">
            <input 
              v-model.trim="contact.name" 
              placeholder="Ihr Name" 
              required
              :class="{ 'error': errors.name }"
              @input="clearError('name')"
            >
            <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
          </div>
          
          <div class="form-group">
            <input 
              v-model.trim="contact.email" 
              type="email" 
              placeholder="Ihre E-Mail" 
              required
              :class="{ 'error': errors.email }"
              @input="clearError('email')"
            >
            <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
          </div>
          
          <div class="form-group">
            <textarea 
              v-model.trim="contact.message" 
              placeholder="Ihre Nachricht..." 
              rows="5" 
              required
              :class="{ 'error': errors.message }"
              @input="clearError('message')"
            ></textarea>
            <div v-if="errors.message" class="error-message">{{ errors.message }}</div>
          </div>
          
          <button type="submit" class="btn-submit">Nachricht senden</button>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const contact = ref({ 
  name: '', 
  email: '', 
  message: '' 
})

const errors = ref({})

const validateForm = () => {
  errors.value = {}
  
  if (!contact.value.name.trim()) {
    errors.value.name = 'Bitte geben Sie Ihren Namen ein'
  } else if (contact.value.name.length < 2) {
    errors.value.name = 'Name muss mindestens 2 Zeichen lang sein'
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!contact.value.email.trim()) {
    errors.value.email = 'Bitte geben Sie Ihre E-Mail ein'
  } else if (!emailRegex.test(contact.value.email)) {
    errors.value.email = 'Bitte geben Sie eine gültige E-Mail ein'
  }
  
  if (!contact.value.message.trim()) {
    errors.value.message = 'Bitte geben Sie eine Nachricht ein'
  } else if (contact.value.message.length < 10) {
    errors.value.message = 'Nachricht muss mindestens 10 Zeichen lang sein'
  }
  
  return Object.keys(errors.value).length === 0
}

const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

const sendContact = () => {
  if (!validateForm()) return
  
  const subject = `Kontaktanfrage von ${contact.value.name}`
  const body = `
Nachricht von: ${contact.value.name}
E-Mail: ${contact.value.email}

${contact.value.message}
------------------------
Gesendet von PuppyRacer Website
  `.trim()
  
  window.location.href = `mailto:info@puppyracer.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  contact.value = { name: '', email: '', message: '' }
  alert('Ihre Nachricht wird im E-Mail-Programm geöffnet.')
}
</script>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  max-height: 800px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

.hero-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: var(--color-primary-dark);
  opacity: 0.4;
  mix-blend-mode: overlay;
}

.hero-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-background-light);
  text-align: center;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  width: 90%;
  max-width: 800px;
}

.hero-text h1 { 
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1rem;
}
.hero-text h2 { 
  font-size: clamp(1.25rem, 3vw, 2rem); 
}
.hero-text strong { color: var(--color-accent-pink); }

.contact-section {
  padding: 4rem 2rem;
  background: var(--color-background-light);
  text-align: center;
}

.contact-container {
  max-width: 600px;
  margin: 0 auto;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.form-group {
  text-align: left;
}

input, textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--color-accent-brown);
  border-radius: 8px;
  font-family: var(--font-roboto);
  font-size: 1rem;
  transition: border-color 0.3s;
}

input.error, textarea.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-family: var(--font-opensans);
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--color-accent-pink);
}

textarea { 
  min-height: 120px; 
  resize: vertical; 
}

.btn-submit {
  background: var(--color-accent-pink);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-roboto);
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 auto;
  width: 100%;
  max-width: 300px;
}

.btn-submit:hover { 
  background: #d04a7c; 
}
.btn-submit:active { 
  transform: translateY(1px); 
}

@media (max-width: 768px) {
  .hero {
    height: 70vh;
    min-height: 400px;
  }
  
  .contact-section {
    padding: 2rem 1rem;
  }
  
  input, textarea {
    padding: 0.875rem;
  }
}
</style>