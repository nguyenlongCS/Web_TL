<template>
  <section class="home-slider">
    <div class="slider-images" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
      <img src="/frontend/assets/img/slide1.jpg">
      <img src="/frontend/assets/img/slide2.jpg">
      <img src="/frontend/assets/img/slide3.jpg">
    </div>
    <div class="slider-tabs">
      <button 
        v-for="(_, index) in 3" 
        :key="index"
        :class="{ active: currentSlide === index }"
        @click="currentSlide = index"
      >
        {{ index + 1 }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentSlide = ref(0)
let slideInterval = null

onMounted(() => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % 3
  }, 5000)
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
})
</script>