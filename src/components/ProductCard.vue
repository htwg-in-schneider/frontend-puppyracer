<template>
  <div>
    <section class="hero">
      <img 
        src="../assets/dog_pics/young-couple-husky.jpg" 
        alt="Junges Paar mit Husky auf einem Spaziergang" 
        class="hero-image"
        loading="lazy"
      >
      <div class="hero-overlay"></div>
      <div class="hero-text">
        <h1>Willkommen auf <span class="highlight">PuppyRacer!</span></h1>
        <h2>Die Webseite, wo du alles für deinen Hund findest!</h2>
      </div>
    </section>

    <section class="contact-section">
      <div class="contact-container">
        <h2>Kontaktieren Sie uns</h2>
        <p class="subtitle">Haben Sie Fragen zu unseren Produkten? Schreiben Sie uns!</p>
        
        <form @submit.prevent="sendContact" class="contact-form">
          <div class="form-group">
            <input 
              v-model.trim="contact.name" 
              placeholder="Ihr Name *" 
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
              placeholder="Ihre E-Mail *" 
              required
              :class="{ 'error': errors.email }"
              @input="clearError('email')"
            >
            <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
          </div>
          
          <div class="form-group">
            <textarea 
              v-model.trim="contact.message" 
              placeholder="Ihre Nachricht * (mindestens 10 Zeichen)" 
              rows="5" 
              required
              :class="{ 'error': errors.message }"
              @input="clearError('message')"
              minlength="10"
            ></textarea>
            <div v-if="errors.message" class="error-message">{{ errors.message }}</div>
            <div class="char-count">{{ contact.message.length }}/10 Zeichen</div>
          </div>
          
          <button type="submit" class="btn-primary" :disabled="isSubmitting || !isFormValid">
            <span v-if="isSubmitting">Wird gesendet...</span>
            <span v-else>Nachricht senden</span>
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const contact = ref({ 
  name: '', 
  email: '', 
  message: '' 
})

const errors = ref({})
const isSubmitting = ref(false)

const isFormValid = computed(() => {
  return contact.value.name.trim().length > 0 &&
         contact.value.email.trim().length > 0 &&
         contact.value.message.trim().length >= 10
})

const validateForm = () => {
  errors.value = {}
  
  if (!contact.value.name.trim()) {
    errors.value.name = 'Bitte geben Sie Ihren Namen ein'
  } else if (contact.value.name.trim().length < 2) {
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
  } else if (contact.value.message.trim().length < 10) {
    errors.value.message = 'Nachricht muss mindestens 10 Zeichen lang sein'
  }
  
  return Object.keys(errors.value).length === 0
}

const clearError = (field) => {
  delete errors.value[field]
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
    
    setTimeout(() => {
      contact.value = { name: '', email: '', message: '' }
      alert('Ihre Nachricht wird im E-Mail-Programm geöffnet.')
    }, 100)
    
  } catch (error) {
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

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(45, 33, 33, 0.7) 0%,
    rgba(180, 134, 101, 0.5) 100%
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
  color: #e26191;
  font-weight: 800;
}

.contact-section {
  padding: 4rem 2rem;
  background-color: #EFE1D6;
  text-align: center;
}

.contact-container {
  max-width: 600px;
  margin: 0 auto;
}

.contact-container h2 {
  color: #2D2121;
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.subtitle {
  color: #B48665;
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

input, textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #B48665;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #2D2121;
  transition: border-color 0.3s;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #e26191;
}

input.error, textarea.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.char-count {
  color: #B48665;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  text-align: right;
}

textarea { 
  min-height: 120px; 
  resize: vertical; 
}

.btn-primary {
  background: #e26191;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.btn-primary:hover:not(:disabled) { 
  background: #d05583;
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