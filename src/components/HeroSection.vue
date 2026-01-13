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
        <h1 class="text-light">Willkommen auf <span class="highlight">PuppyRacer!</span></h1>
        <h2 class="text-light">Die Webseite, wo du alles für deinen Hund findest!</h2>
      </div>
    </section>

    <section class="contact-section" aria-labelledby="contact-heading">
      <div class="contact-container">
        <h2 id="contact-heading">Kontaktieren Sie uns</h2>
        <p class="subtitle">Haben Sie Fragen zu unseren Produkten? Schreiben Sie uns!</p>
        
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
            >
            <div v-if="errors.name" id="name-error" class="error-message">{{ errors.name }}</div>
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
            <div v-if="errors.email" id="email-error" class="error-message">{{ errors.email }}</div>
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
            ></textarea>
            <div v-if="errors.message" id="message-error" class="error-message">{{ errors.message }}</div>
          </div>
          
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
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
  
  if (!contact.value.name.trim()) {
    errors.value.name = 'Bitte geben Sie Ihren Namen ein'
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!contact.value.email.trim()) {
    errors.value.email = 'Bitte geben Sie Ihre E-Mail ein'
  } else if (!emailRegex.test(contact.value.email)) {
    errors.value.email = 'Bitte geben Sie eine gültige E-Mail ein'
  }
  
  if (!contact.value.message.trim()) {
    errors.value.message = 'Bitte geben Sie eine Nachricht ein'
  }
  
  return Object.keys(errors.value).length === 0
}

const clearError = (field) => {
  delete errors.value[field]
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
    
    contact.value = { name: '', email: '', message: '' }
    
    setTimeout(() => {
      alert('Ihre Nachricht wird im E-Mail-Programm geöffnet.')
    }, 100)
    
  } catch (error) {
    console.error('Fehler:', error)
    alert('Leider konnte der E-Mail-Client nicht geöffnet werden.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.hero {
  position: relative;
  height: 70vh;
  min-height: 500px;
  max-height: 700px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* KORREKTUR: Hero-Overlay ohne Pink */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(45, 33, 33, 0.7) 0%,       /* Dunkles Braun mit Transparenz */
    rgba(180, 134, 101, 0.5) 100%   /* Mittleres Braun (#B48665) mit Transparenz */
  );
}

.hero-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  width: 90%;
  max-width: 800px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.hero-text h1 { 
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-text h2 { 
  font-size: clamp(1.25rem, 3vw, 1.75rem); 
  font-weight: 400;
}

.highlight {
  color: var(--color-accent-pink);
  font-weight: 800;
}

.contact-section {
  padding: 4rem 2rem;
  background-color: var(--color-background-light); /* #EFE1D6 */
  text-align: center;
}

.contact-container {
  max-width: 600px;
  margin: 0 auto;
}

.contact-container h2 {
  color: var(--color-primary-dark); /* #2D2121 */
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.subtitle {
  color: var(--color-accent-brown); /* #B48665 */
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  text-align: left;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

input, textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--color-accent-brown); /* #B48665 */
  border-radius: 8px;
  font-family: var(--font-roboto);
  font-size: 1rem;
  background: white;
  color: var(--color-primary-dark); /* #2D2121 */
  transition: border-color 0.3s;
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--color-accent-pink); /* #E26191 */
  box-shadow: 0 0 0 3px rgba(226, 97, 145, 0.1);
}

input.error, textarea.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

textarea { 
  min-height: 120px; 
  resize: vertical; 
}

.btn-primary {
  background: var(--color-accent-pink); /* #E26191 */
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-roboto);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.btn-primary:hover:not(:disabled) { 
  background: #d04a7c; /* Dunkleres Pink für Hover */
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .hero {
    height: 60vh;
    min-height: 400px;
  }
  
  .hero-text h1 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
  }
  
  .hero-text h2 {
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  }
  
  .contact-section {
    padding: 2rem 1rem;
  }
  
  .contact-container h2 {
    font-size: 1.5rem;
  }
}
</style>