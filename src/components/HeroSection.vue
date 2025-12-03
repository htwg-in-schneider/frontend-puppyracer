<template>
<section class="hero">
  <img src="../assets/young-couple-husky.jpg" alt="Background Image" class="hero-image">
  <div class="hero-overlay"></div>

  <div class="hero-text">
    <h1 class="custom-aligned">Welcome to <strong><em>PuppyRacer!</em></strong></h1>
    <h2 class="custom-aligned">The website that finds every breed you’re looking for!</h2>
    <h3 class="get-Started">Get Started</h3>
    <form class="hero-search">
      <input type="text" placeholder="Search for a breed…" name="breed" />
    </form>
  </div>

  <!-- LOGIN CARD -->
  <div class="login-card outline-pink">
    <div class="stack">
      <p class="pretitle italic">New here? Register with us!</p>
      <button class="pink-btn">Register</button>
    </div>

    <div class="stack">
      <p class="pretitle italic">Already a proud member?</p>
      <button class="white-btn">Sign In</button>
    </div>
  </div>
</section>
</template>

<script setup>
</script>

<style scoped>
.hero {
    position: relative;
    height: 100vh;
    overflow: hidden;
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

.hero-text {
    position: absolute;
    z-index: 3;
    color: #EFE1D6;
    top: 40%;
    left: 25%;
    transform: translateY(-50%);
}

.hero-search {
    width: 100%;
    max-width: 800px;
}

.hero-search input {
    width: 100%;
    max-width: 400px;
    padding: 0.7rem 1rem;
    border: 0.1rem solid #BB9580;
    font-size: 1rem;
    background-color: #EFE1D6;
    color: #2D2121;
    transition: box-shadow 0.2s ease;
}

.hero-search input::placeholder {
    color: #BB9580;
    opacity: 0.7;
}

/* LOGIN CARD */
.login-card {
    position: absolute;
    top: 60%;
    right: 20%;
    background: #ffffff;
    border: 2px solid #E26191;
    border-radius: 16px;
    padding: 40px;
    width: 100%;
    max-width: 460px;
    box-shadow: 0 10px 30px rgba(45, 33, 33, 0.6);
    display: grid;
    gap: 26px;
    z-index: 4;
}

.pretitle {
    margin: 0 0 8px 0;
    color: #E26191;
    font-weight: 300;
    font-size: 1.1rem;
    font-style: italic;
}

.stack {
    display: flex;
    flex-direction: column;
}

/* BUTTONS */
.pink-btn {
    background-color: #E26191;
    color: white;
    border: none;
    padding: 12px 18px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s ease;
}

.pink-btn:hover {
    background-color: #c8507f;
}

.white-btn {
    background-color: #fff;
    color: #E26191;
    border: 2px solid #E26191;
    padding: 12px 18px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s ease;
}

.white-btn:hover {
    background-color: #E26191;
    color: white;
}
</style>