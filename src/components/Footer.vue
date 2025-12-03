<template>
<footer>
  <FooterLink text="© 2025 MySite. All rights reserved." href="#"/>
  <FooterLink text="Social Media" href="#social"/>
  <FooterLink text="Impressum" href="#impressum"/>
  <FooterLink text="Newsletter" href="#newsletter"/>
  <FooterLink text="Back to the top" href="#top"/>
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
</style>