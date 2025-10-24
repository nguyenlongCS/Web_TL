<template>
  <div class="service-item">
    <img :src="imgSrc" :alt="title">
    <h3>{{ title }}</h3>
    <a href="#">Chi tiết</a>
  </div>
</template>

<script setup>
defineProps({
  imgSrc: String,
  title: String
})
</script>