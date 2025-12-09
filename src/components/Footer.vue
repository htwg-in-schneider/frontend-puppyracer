<template>
<footer>
  <div class="footer-section">
    <h4>Informationen</h4>
    <a href="#impressum">Impressum</a>
    <a href="#datenschutz">Datenschutz</a>
    <a href="#agb">AGB</a>
  </div>

  <div class="footer-section">
    <h4>Kundenservice</h4>
    <a href="#kontakt">Kontakt</a>
    <a href="#faq">FAQ</a>
    <a href="#versand">Versand & Rückgabe</a>
  </div>

  <div class="footer-section">
    <h4>Newsletter</h4>
    <p>Erhalte exklusive Angebote und Produktneuheiten.</p>
    <a href="#newsletter">Zum Newsletter anmelden</a>
  </div>

  <div class="footer-section">
    <h4>© 2025 PuppyRacer</h4>
    <p>Alle Rechte vorbehalten.</p>
  </div>
</footer>
</template>

<script setup>
</script>

<style scoped>
footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #B48665;
    color: white;
}

footer a {
    color: #2D2121;
    text-decoration: none;
    transition: color 0.2s ease;
}

footer a:hover {
    color: #E26191;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.footer-section h4 {
  margin: 0;
  font-size: 1.1rem;
  color: white;
}

.footer-section p {
  margin: 0;
  color: #2D2121;
  font-size: 0.9rem;
}
</style>