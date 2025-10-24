<template>
  <div class="review-item">
    <div class="review-header">
      <img :src="avatar" class="review-avatar" :alt="author">
      <div>
        <p class="review-author">{{ author }}</p>
        <div class="review-stars">{{ stars }}</div>
      </div>
    </div>
    <p class="review-text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  avatar: String,
  author: String,
  stars: String,
  text: String
})
</script>