<template>
<footer>
  <div class="footer-content">
    <div class="footer-links">
      <router-link to="/impressum">Impressum</router-link>
      <router-link to="/datenschutz">Datenschutz</router-link>
    </div>
    <div class="footer-copyright">
      <p>© 2025 PuppyRacer</p>
    </div>
  </div>
</footer>
</template>

<script setup>
// Kein Script nötig
</script>

<style scoped>
footer {
    background-color: #B48665;
    color: white;
    padding: 1.5rem 0;
    font-family: "Roboto", sans-serif;
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
    color: #2D2121;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;
}

.footer-links a:hover {
    color: #E26191;
    text-decoration: underline;
}

.footer-copyright p {
    color: #2D2121;
    font-size: 0.9rem;
    margin: 0;
}

/* Responsive Design */
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