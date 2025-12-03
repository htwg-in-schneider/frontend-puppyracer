<template>
<section class="dog-carousel">
  <div class="dog-profiles">
    <div class="dog-card" v-for="dog in dogs" :key="dog.id">
      <img :src="dog.image" :alt="dog.name">
      <h6 class="dog-name">{{ dog.name }}</h6>
    </div>
  </div>
</section>
</template>

<script setup>
const dogs = [
  { id: 1, name: 'Afghan Hound', image: '/src/assets/dog_pics/dog1.jpg' },
  { id: 2, name: 'Finnish Laphund', image: '/src/assets/dog_pics/dog2.jpg' },
  { id: 3, name: 'Shetland Sheepdog', image: '/src/assets/dog_pics/dog3.jpg' },
  { id: 4, name: 'Pomeranian', image: '/src/assets/dog_pics/dog4.jpg' },
  { id: 5, name: 'Bernese Mountain Dog', image: '/src/assets/dog_pics/dog5.jpg' },
  { id: 6, name: 'Chow Chow', image: '/src/assets/dog_pics/dog6.jpg' },
  { id: 7, name: 'Pekingese', image: '/src/assets/dog_pics/dog7.jpg' },
  { id: 8, name: 'Husky', image: '/src/assets/dog_pics/dog9.webp' },
  { id: 9, name: 'Mops', image: '/src/assets/dog_pics/dog10.webp' },
];
</script>

<style scoped>
.dog-carousel {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 1.5rem 0;
    padding-top: 5rem;
    background: #2D2121;
}

.dog-profiles {
    display: flex;
    gap: 1.5rem;
    padding: 0 1.5rem 1rem;
    scroll-snap-type: x mandatory;
}

.dog-card {
    min-width: 400px;
    min-height: 300px;
    background: #2D2121;
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    overflow: hidden;
    text-align: center;
    scroll-snap-align: start;
}

.dog-card img {
    width: 100%;
    height: 300px;
    object-fit: cover;
}

.dog-name {
    margin: 0.75rem 0 1rem;
    font-weight: 300;
    font-size: 1rem;
    color: #EFE1D6;
}
</style>