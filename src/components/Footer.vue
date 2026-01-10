<template>
<footer>
  <div class="footer-content">
    <div class="footer-links">
      <router-link to="/impressum" aria-label="Impressum">Impressum</router-link>
      <router-link to="/datenschutz" aria-label="Datenschutzerklärung">Datenschutz</router-link>
    </div>
    <div class="footer-copyright">
      <p>© 2025 PuppyRacer</p>
    </div>
  </div>
</footer>
</template>

<script setup>
// Footer benötigt keine Logik
</script>

<style scoped>
footer {
    background-color: var(--color-accent-brown);
    color: white;
    padding: 1.5rem 0;
    font-family: var(--font-roboto);
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.footer-links {
    display: flex;
    gap: 2rem;
}

.footer-links a {
    color: var(--color-primary-dark);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;
}

.footer-links a:hover {
    color: var(--color-accent-pink);
    text-decoration: underline;
}

.footer-copyright p {
    color: var(--color-primary-dark);
    font-size: 0.9rem;
    margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .footer-content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }
    
    .footer-links {
        flex-direction: column;
        gap: 0.75rem;
    }
}
</style>