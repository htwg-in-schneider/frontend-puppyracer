<template>
<section class="tierheim">
  <div class="image-side"></div>
  <div class="text-side">
    <h1>Want to adopt?</h1>
    <h3 class="tierheim_text">
      Two thirds of every animal shelter in Germany are permanently filled to the brim...
      <br><br>
      You can help us and we can help you find a suitable animal shelter to adopt your perfect companion.
    </h3>
    <Button variant="secondary">Animal Shelters this way -></Button>
  </div>
</section>
</template>

<script setup>
</script>

<style scoped>
.tierheim {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 60vh;
    background: #E26191;            
}

.tierheim .image-side {
    background: url('./dog_pics/Tierheim_image.jpg') center/cover no-repeat;
}

.tierheim .text-side {
    background-color: #E26191;
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.tierheim h1 {
    margin-bottom: 20px;
    font-weight: 300;
    color: #EFE1D6;
    font-style: italic;
}

.tierheim h3 {
    margin-bottom: 20px;
    font-weight: 300;
    color: #EFE1D6;
    max-width: 90%;
}
</style>