<template>
  <section class="product-reviews">
    <h3 class="reviews-title">Kundenbewertungen</h3>
    
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Bewertungen werden geladen...</span>
    </div>
    
    <div v-else-if="reviews.length > 0" class="reviews-list">
      <article 
        v-for="review in reviews" 
        :key="review.id" 
        class="review-item"
      >
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
          <time class="review-date" :datetime="review.createdAt">{{ formatDate(review.createdAt) }}</time>
        </div>
        <p class="review-text">{{ review.text }}</p>
      </article>
    </div>
    
    <div v-else class="no-reviews">
      <i class="bi bi-chat-square-text"></i>
      <p>Noch keine Bewertungen. Seien Sie der Erste!</p>
    </div>
    
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
              >
                ★
              </button>
            </div>
            <span class="rating-text">{{ newReview.rating }} von 5 Sternen</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="review-author" class="form-label">Ihr Name *</label>
          <input
            id="review-author"
            v-model.trim="newReview.author"
            type="text"
            placeholder="Ihr Name"
            required
            :disabled="submitting"
            maxlength="50"
          >
        </div>
        
        <div class="form-group">
          <label for="review-text" class="form-label">Ihr Kommentar *</label>
          <textarea
            id="review-text"
            v-model="newReview.text"
            placeholder="Teilen Sie Ihre Erfahrungen mit diesem Produkt..."
            rows="4"
            required
            :disabled="submitting"
            minlength="10"
            maxlength="1000"
          ></textarea>
          <div v-if="fieldErrors.text" class="field-error">{{ fieldErrors.text }}</div>
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
  </section>
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

const isFormValid = computed(() => {
  return newReview.value.text.trim().length >= 10 && 
         newReview.value.author.trim().length > 0
})

const validateForm = () => {
  fieldErrors.value = {}
  
  if (!newReview.value.text.trim()) {
    fieldErrors.value.text = 'Bitte geben Sie eine Bewertung ein'
  } else if (newReview.value.text.trim().length < 10) {
    fieldErrors.value.text = 'Bewertung muss mindestens 10 Zeichen lang sein'
  }
  
  if (!newReview.value.author.trim()) {
    fieldErrors.value.text = 'Bitte geben Sie Ihren Namen ein'
  }
  
  return Object.keys(fieldErrors.value).length === 0
}

const loadReviews = async () => {
  loading.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product/${props.productId}/reviews`)
    if (response.ok) {
      reviews.value = await response.json()
    }
  } catch (error) {
    submitError.value = 'Bewertungen konnten nicht geladen werden'
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
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product/${props.productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    })
    
    if (response.ok) {
      const createdReview = await response.json()
      reviews.value.unshift(createdReview)
      submitSuccess.value = true
      
      newReview.value = { text: '', author: '', rating: 5 }
      fieldErrors.value = {}
      
      setTimeout(() => {
        submitSuccess.value = false
      }, 5000)
    } else {
      throw new Error('Bewertung konnte nicht gespeichert werden')
    }
  } catch (error) {
    submitError.value = 'Ihre Bewertung konnte nicht gespeichert werden'
  } finally {
    submitting.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

onMounted(() => {
  loadReviews()
})
</script>

<style scoped>
.product-reviews {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.reviews-title, .form-title {
  color: white;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.reviews-title {
  font-size: 1.5rem;
  border-bottom: 2px solid #e26191;
  padding-bottom: 0.5rem;
}

.form-title {
  font-size: 1.25rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: white;
  opacity: 0.8;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #e26191;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

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

.reviews-list {
  margin-bottom: 2rem;
}

.review-item {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border-left: 3px solid #e26191;
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
  color: white;
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
  color: #ffd700;
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

.add-review {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  margin-top: 2rem;
}

.error-message, .success-message {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-weight: 500;
}

.error-message {
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
  border: 1px solid rgba(255, 71, 87, 0.3);
}

.success-message {
  background: rgba(46, 213, 115, 0.1);
  color: #2ed573;
  border: 1px solid rgba(46, 213, 115, 0.3);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  color: white;
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
  border-radius: 4px;
}

.star-btn.active {
  color: #ffd700;
}

.star-btn:hover:not(:disabled) {
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
  color: white;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s;
}

textarea:focus, input[type="text"]:focus {
  outline: none;
  border-color: #e26191;
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
  color: #ff4757;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.submit-btn {
  background: #e26191;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s;
  width: 100%;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: #d05583;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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