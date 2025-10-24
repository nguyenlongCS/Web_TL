<template>
  <div class="project-item">
    <img :src="imgSrc" :alt="name">
    <h3>{{ name }}</h3>
    <a href="#">Chi tiết</a>
  </div>
</template>

<script setup>
defineProps({
  imgSrc: String,
  name: String
})
</script>