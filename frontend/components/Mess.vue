<!-- frontend/components/Cart.vue -->
<!-- Nút giỏ hàng floating -->

<template>
  <router-link to="/tinnhan" class="mess-button">
    <!-- <img src="/frontend/assets/icons/mess.png" alt="Tin Nhắn"> -->
    <span id="mess-count">{{ messCount }}</span>
  </router-link>
</template>

<script setup>
// import { useCart } from '../composables/useMess'

// Số tin nhắn chưa đọc
// const { messCount } = useMess()
</script>