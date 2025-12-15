<template>
  <section class="hero">
    <img src="../assets/dog_pics/young-couple-husky.jpg" alt="Background Image" class="hero-image">
    <div class="hero-overlay"></div>

    <div class="hero-text">
      <h1 class="custom-aligned">Willkommen auf <strong><em>PuppyRacer!</em></strong></h1>
      <h2 class="custom-aligned">Die Webseite, wo du alles für deinen Hund findest!</h2>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
/* Hero section */
.hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.hero-text {
  position: absolute;
  z-index: 3;
  color: #EFE1D6;
  top: 40%;
  left: 25%;
  transform: translateY(-50%);
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.8;
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #2D2121;
  opacity: 0.4;
  mix-blend-mode: overlay;
  z-index: 2;
}

.custom-aligned {
  text-align: left;
}

/* Spezifische Styles für die Hero-Texte */
.hero-text h1 {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: 3rem;
  color: #EFE1D6;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-text h2 {
  font-family: "Roboto", sans-serif;
  font-style: italic;
  font-weight: 300;
  font-size: 2rem;
  color: #EFE1D6;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-text strong em {
  font-weight: 700;
  font-style: normal;
  color: #E26191;
}

/* Responsive */
@media (max-width: 992px) {
  .hero-text {
    left: 15%;
    right: 15%;
    text-align: center;
  }
  
  .hero-text h1 {
    font-size: 2.5rem;
  }
  
  .hero-text h2 {
    font-size: 1.75rem;
  }
  
  .custom-aligned {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .hero-text {
    left: 10%;
    right: 10%;
  }
  
  .hero-text h1 {
    font-size: 2rem;
  }
  
  .hero-text h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .hero {
    height: 80vh;
  }
  
  .hero-text {
    left: 5%;
    right: 5%;
  }
  
  .hero-text h1 {
    font-size: 1.8rem;
  }
  
  .hero-text h2 {
    font-size: 1.3rem;
  }
}
</style>