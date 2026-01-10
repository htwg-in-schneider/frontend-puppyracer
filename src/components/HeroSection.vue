<!-- HeroSection.vue - Optimierte Version -->
<template>
  <div>
    <section class="hero" aria-label="Willkommensbereich">
      <img 
        src="../assets/dog_pics/young-couple-husky.jpg" 
        alt="Junges Paar mit Husky auf einem Spaziergang" 
        class="hero-image"
        loading="lazy"
        @error="handleImageError"
      >
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="hero-text">
        <h1 class="text-light">Willkommen auf <strong>PuppyRacer!</strong></h1>
        <h2 class="text-light">Die Webseite, wo du alles für deinen Hund findest!</h2>
      </div>
    </section>

    <section class="contact-section bg-light" aria-labelledby="contact-heading">
      <div class="contact-container">
        <h2 id="contact-heading" class="text-primary">Kontaktieren Sie uns</h2>
        <p class="text-secondary">Haben Sie Fragen zu unseren Produkten? Schreiben Sie uns!</p>
        
        <form @submit.prevent="sendContact" class="contact-form" novalidate>
          <div class="form-group">
            <label for="contact-name" class="sr-only">Ihr Name</label>
            <input 
              id="contact-name"
              v-model.trim="contact.name" 
              placeholder="Ihr Name" 
              required
              :class="{ 'error': errors.name }"
              @input="clearError('name')"
              aria-describedby="name-error"
              minlength="2"
              maxlength="50"
            >
            <div v-if="errors.name" id="name-error" class="error-message" role="alert">{{ errors.name }}</div>
          </div>
          
          <div class="form-group">
            <label for="contact-email" class="sr-only">Ihre E-Mail</label>
            <input 
              id="contact-email"
              v-model.trim="contact.email" 
              type="email" 
              placeholder="Ihre E-Mail" 
              required
              :class="{ 'error': errors.email }"
              @input="clearError('email')"
              aria-describedby="email-error"
            >
            <div v-if="errors.email" id="email-error" class="error-message" role="alert">{{ errors.email }}</div>
          </div>
          
          <div class="form-group">
            <label for="contact-message" class="sr-only">Ihre Nachricht</label>
            <textarea 
              id="contact-message"
              v-model.trim="contact.message" 
              placeholder="Ihre Nachricht..." 
              rows="5" 
              required
              :class="{ 'error': errors.message }"
              @input="clearError('message')"
              aria-describedby="message-error"
              minlength="10"
              maxlength="1000"
            ></textarea>
            <div v-if="errors.message" id="message-error" class="error-message" role="alert">{{ errors.message }}</div>
          </div>
          
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            <span v-if="isSubmitting">Wird gesendet...</span>
            <span v-else>Nachricht senden</span>
          </button>
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
const isSubmitting = ref(false)

const validateForm = () => {
  errors.value = {}
  
  // Name validation
  if (!contact.value.name.trim()) {
    errors.value.name = 'Bitte geben Sie Ihren Namen ein'
  } else if (contact.value.name.length < 2) {
    errors.value.name = 'Name muss mindestens 2 Zeichen lang sein'
  } else if (contact.value.name.length > 50) {
    errors.value.name = 'Name darf maximal 50 Zeichen lang sein'
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!contact.value.email.trim()) {
    errors.value.email = 'Bitte geben Sie Ihre E-Mail ein'
  } else if (!emailRegex.test(contact.value.email)) {
    errors.value.email = 'Bitte geben Sie eine gültige E-Mail ein'
  }
  
  // Message validation
  if (!contact.value.message.trim()) {
    errors.value.message = 'Bitte geben Sie eine Nachricht ein'
  } else if (contact.value.message.length < 10) {
    errors.value.message = 'Nachricht muss mindestens 10 Zeichen lang sein'
  } else if (contact.value.message.length > 1000) {
    errors.value.message = 'Nachricht darf maximal 1000 Zeichen lang sein'
  }
  
  return Object.keys(errors.value).length === 0
}

const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  console.warn('Hero-Bild konnte nicht geladen werden')
}

const sendContact = () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    const subject = `Kontaktanfrage von ${contact.value.name}`
    const body = `
Nachricht von: ${contact.value.name}
E-Mail: ${contact.value.email}

${contact.value.message}
------------------------
Gesendet von PuppyRacer Website
    `.trim()
    
    window.location.href = `mailto:info@puppyracer.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    // Reset form
    contact.value = { name: '', email: '', message: '' }
    
    // Show success message (optional)
    alert('Ihre Nachricht wird im E-Mail-Programm geöffnet.')
    
  } catch (error) {
    console.error('Fehler beim Öffnen des E-Mail-Clients:', error)
    alert('Leider konnte der E-Mail-Client nicht geöffnet werden. Bitte senden Sie Ihre Nachricht direkt an info@puppyracer.de')
  } finally {
    isSubmitting.value = false
  }
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
  inset: 0;
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

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

input, textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--color-accent-brown);
  border-radius: 8px;
  font-family: var(--font-roboto);
  font-size: 1rem;
  transition: border-color 0.3s;
  background: white;
  color: var(--color-primary-dark);
}

input.error, textarea.error {
  border-color: var(--color-danger);
}

.error-message {
  color: var(--color-danger);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-family: var(--font-opensans);
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--color-accent-pink);
  box-shadow: 0 0 0 3px rgba(226, 97, 145, 0.1);
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
  transition: background-color 0.3s, transform 0.2s;
  margin: 0 auto;
  width: 100%;
  max-width: 300px;
}

.btn-submit:hover:not(:disabled) { 
  background: #d04a7c; 
  transform: translateY(-1px);
}

.btn-submit:active:not(:disabled) { 
  transform: translateY(0); 
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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