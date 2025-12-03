<template>
<section class="identify">
  <div class="text-side">
    <h1>Not sure what you are looking for in your brand new Companion?</h1>
    <h3>
      Don’t sweat it, dogs certainly won’t!
      <br><br>
      Just put in a few characteristics like:
    </h3>
    <ul class="text-list">
      <li>Allergyfriendly</li>
      <li>Familyfriendly</li>
      <li>Energetic or lazy</li>
      <li>Big or small</li>
      <li>and more!</li>
    </ul>
  </div>
  <div class="image-side">
    <div class="id-search">
      <input type="text" placeholder="Enter Characteristics..." />
    </div>
    <img src="../assets/Puppy_Racer_Logo.jpg" alt="logo" class="corner-logo" />
  </div>
</section>
</template>

<script setup></script>

<style scoped>
.identify {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 60vh;
    background: #BB9580;
}

.identify .image-side {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.id-search {
    width: 100%;
    max-width: 800px;
}

.id-search input {
    width: 100%;
    max-width: 400px;
    padding: 0.7rem 1rem;
    border: 0.1rem solid #BB9580;
    font-size: 1rem;
    background-color: #EFE1D6;
    color: #2D2121;
    transition: box-shadow 0.2s ease;
}

.corner-logo {
    position: absolute;
    bottom: 100px;
    right: 150px;
    width: 400px;
    height: auto;
    opacity: 0.9;
    transform: rotate(-20deg);
    transition: transform 0.9s ease;
}

.corner-logo:hover {
    transform: rotate(0deg) scale(1.05);
}

.identify .text-side {
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.identify h1 {
    margin-bottom: 20px;
    font-weight: 300;
    color: #EFE1D6;
    font-style: italic;
}

.identify h3 {
    margin-bottom: 20px;
    font-weight: 300;
    color: #EFE1D6;
    max-width: 90%;
}

.text-list {
    font-family: "Roboto", sans-serif;
    font-weight: 350;
    font-size: 1.75rem;
    margin-left: 40px;
    color: #EFE1D6;
}
</style>