<template>
  <div class="product-reviews">
    <h3 class="reviews-title">Kundenbewertungen</h3>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Bewertungen werden geladen...</span>
    </div>
    
    <!-- Reviews List -->
    <div v-else-if="reviews.length > 0" class="reviews-list">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-header">
          <div class="review-author-rating">
            <span class="review-author">{{ review.author || 'Anonym' }}</span>
            <div class="review-stars">
              <span 
                v-for="n in 5" 
                :key="n"
                class="star"
                :class="{ filled: n <= review.rating }"
              >
                ★
              </span>
              <span class="rating-value">{{ review.rating.toFixed(1) }}/5</span>
            </div>
          </div>
          <span class="review-date">{{ formatDate(review.createdAt) }}</span>
        </div>
        <p class="review-text">{{ review.text }}</p>
      </div>
    </div>
    
    <!-- No Reviews -->
    <div v-else class="no-reviews">
      <i class="bi bi-chat-square-text"></i>
      <p>Noch keine Bewertungen. Seien Sie der Erste!</p>
    </div>
    
    <!-- Add Review Form -->
    <div class="add-review">
      <h4 class="form-title">Bewertung schreiben</h4>
      
      <div v-if="submitError" class="error-message">
        {{ submitError }}
      </div>
      
      <div v-if="submitSuccess" class="success-message">
        Vielen Dank für Ihre Bewertung!
      </div>
      
      <form @submit.prevent="submitReview" class="review-form">
        <div class="form-group">
          <label class="form-label">Ihre Bewertung:</label>
          <div class="rating-input">
            <div class="stars">
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                class="star-btn"
                :class="{ active: newReview.rating >= n }"
                @click="newReview.rating = n"
                :aria-label="`${n} von 5 Sternen`"
              >
                ★
              </button>
            </div>
            <span class="rating-text">{{ newReview.rating }} von 5 Sternen</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="review-text" class="form-label">Ihre Bewertung:</label>
          <textarea
            id="review-text"
            v-model="newReview.text"
            placeholder="Teilen Sie Ihre Erfahrungen mit diesem Produkt..."
            rows="4"
            required
            :disabled="submitting"
            :class="{ error: fieldErrors.text }"
          ></textarea>
          <div v-if="fieldErrors.text" class="field-error">{{ fieldErrors.text }}</div>
        </div>
        
        <div class="form-group">
          <label for="review-author" class="form-label">Ihr Name (optional):</label>
          <input
            id="review-author"
            v-model.trim="newReview.author"
            type="text"
            placeholder="Ihr Name"
            :disabled="submitting"
          >
        </div>
        
        <button 
          type="submit" 
          class="submit-btn"
          :disabled="submitting || !isFormValid"
        >
          <span v-if="submitting">Wird gesendet...</span>
          <span v-else>Bewertung absenden</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({ 
  productId: { type: Number, required: true }
})

const reviews = ref([])
const loading = ref(true)
const submitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)

const newReview = ref({
  text: '',
  author: '',
  rating: 5
})

const fieldErrors = ref({})

// Computed
const isFormValid = computed(() => {
  return newReview.value.text.trim().length >= 10
})

// Methods
const validateForm = () => {
  fieldErrors.value = {}
  
  if (!newReview.value.text.trim()) {
    fieldErrors.value.text = 'Bitte geben Sie eine Bewertung ein'
  } else if (newReview.value.text.trim().length < 10) {
    fieldErrors.value.text = 'Bewertung muss mindestens 10 Zeichen lang sein'
  }
  
  return Object.keys(fieldErrors.value).length === 0
}

const loadReviews = async () => {
  loading.value = true
  try {
    const response = await fetch(`http://localhost:8081/api/product/${props.productId}/reviews`)
    if (response.ok) {
      reviews.value = await response.json()
    } else {
      console.error('Fehler beim Laden der Bewertungen')
    }
  } catch (error) {
    console.error('Netzwerkfehler:', error)
  } finally {
    loading.value = false
  }
}

const submitReview = async () => {
  if (!validateForm()) return
  
  submitting.value = true
  submitError.value = ''
  submitSuccess.value = false
  
  try {
    const reviewData = {
      ...newReview.value,
      productId: props.productId,
      createdAt: new Date().toISOString()
    }
    
    const response = await fetch(`http://localhost:8081/api/product/${props.productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    })
    
    if (response.ok) {
      const createdReview = await response.json()
      reviews.value.unshift(createdReview)
      submitSuccess.value = true
      
      // Formular zurücksetzen
      newReview.value = { text: '', author: '', rating: 5 }
      fieldErrors.value = {}
      
      // Erfolgsmeldung nach 3 Sekunden ausblenden
      setTimeout(() => {
        submitSuccess.value = false
      }, 3000)
    } else {
      throw new Error('Serverfehler beim Speichern der Bewertung')
    }
  } catch (error) {
    submitError.value = 'Entschuldigung, Ihre Bewertung konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.'
    console.error('Fehler beim Absenden:', error)
  } finally {
    submitting.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

onMounted(loadReviews)
</script>

<style scoped>
.product-reviews {
  --reviews-bg: rgba(255, 255, 255, 0.05);
  --reviews-text: white;
  --reviews-accent: #e26191;
  --reviews-star: #ffd700;
  --reviews-error: #ff4757;
  --reviews-success: #2ed573;
  
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--reviews-bg);
  border-radius: 12px;
}

/* Typography */
.reviews-title, .form-title {
  color: var(--reviews-text);
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.reviews-title {
  font-size: 1.5rem;
  border-bottom: 2px solid var(--reviews-accent);
  padding-bottom: 0.5rem;
}

.form-title {
  font-size: 1.25rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: var(--reviews-text);
  opacity: 0.8;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--reviews-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* No Reviews */
.no-reviews {
  text-align: center;
  padding: 2rem 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.no-reviews i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
  opacity: 0.5;
}

/* Reviews List */
.reviews-list {
  margin-bottom: 2rem;
}

.review-item {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border-left: 3px solid var(--reviews-accent);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.review-author-rating {
  flex: 1;
}

.review-author {
  font-weight: 600;
  color: var(--reviews-text);
  display: block;
  margin-bottom: 0.25rem;
}

.review-stars {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.star {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.3);
}

.star.filled {
  color: var(--reviews-star);
}

.rating-value {
  color: rgba(255, 255, 255, 0.7);
  margin-left: 0.75rem;
  font-size: 0.9rem;
}

.review-date {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
}

.review-text {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
}

/* Add Review Form */
.add-review {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  margin-top: 2rem;
}

/* Messages */
.error-message, .success-message {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-weight: 500;
}

.error-message {
  background: rgba(var(--reviews-error), 0.1);
  color: var(--reviews-error);
  border: 1px solid rgba(var(--reviews-error), 0.3);
}

.success-message {
  background: rgba(var(--reviews-success), 0.1);
  color: var(--reviews-success);
  border: 1px solid rgba(var(--reviews-success), 0.3);
}

/* Form Elements */
.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  color: var(--reviews-text);
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.stars {
  display: flex;
  gap: 0.5rem;
}

.star-btn {
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.3);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
  padding: 0;
  line-height: 1;
}

.star-btn.active {
  color: var(--reviews-star);
}

.star-btn:hover {
  transform: scale(1.2);
}

.rating-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

textarea, input[type="text"] {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: var(--reviews-text);
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s;
}

textarea:focus, input[type="text"]:focus {
  outline: none;
  border-color: var(--reviews-accent);
}

textarea.error {
  border-color: var(--reviews-error);
}

textarea::placeholder,
input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

textarea:disabled,
input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.field-error {
  color: var(--reviews-error);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* Submit Button */
.submit-btn {
  background: var(--reviews-accent);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s, transform 0.2s;
  width: 100%;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: #d05583;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .product-reviews {
    padding: 1rem;
  }
  
  .review-header {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .review-date {
    align-self: flex-end;
  }
  
  .star-btn {
    font-size: 1.5rem;
  }
  
  .add-review {
    padding: 1rem;
  }
}
</style>