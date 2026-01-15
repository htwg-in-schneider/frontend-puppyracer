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

<style scoped>
footer {
    background-color: var(--color-accent-brown); /* #B48665 - HELLBRAUN */
    color: var(--color-primary-dark); /* #2D2121 */
    padding: 1.5rem 0;
    font-family: var(--font-roboto);
    border-top: 3px solid var(--color-accent-pink); /* #E26191 */
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
    text-align: center;
}

.footer-links {
    display: flex;
    gap: 2rem;
}

.footer-links a {
    color: var(--color-primary-dark); /* #2D2121 */
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.2s ease;
    padding: 0.5rem;
    border-radius: 4px;
}

.footer-links a:hover {
    color: var(--color-accent-pink); /* #E26191 */
    background-color: rgba(45, 33, 33, 0.1);
    text-decoration: none;
}

.footer-copyright p {
    color: var(--color-primary-dark); /* #2D2121 */
    font-size: 0.9rem;
    margin: 0;
    opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
    .footer-content {
        flex-direction: column;
        gap: 1rem;
    }
    
    .footer-links {
        flex-direction: column;
        gap: 0.75rem;
    }
}
</style>