<template>
  <footer class="footer">
    <nav class="footer-links">
      <a href="#">&copy; 2025 PuppyRacer</a>
      <a href="#social">Social Media</a>
      <a href="#impressum">Impressum</a>
      <a href="#newsletter">Newsletter</a>
      <a href="#top">Back to the top</a>
    </nav>
  </footer>
</template>

<script setup>
// kein JS notwendig für einfachen Footer
</script>

<style scoped>
.footer {
  padding: 1.5rem 2rem;
  background-color: #B48665;
  display: flex;
  justify-content: center;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer a {
  color: #2D2121;
  text-decoration: none;
  font-weight: 500;
}

.footer a:hover {
  color: #E26191;
}
</style>