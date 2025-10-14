<!-- frontend/components/Cart.vue -->
<!-- Nút giỏ hàng floating -->

<template>
  <router-link to="/giohang" class="cart-button">
    <img src="/frontend/assets/icons/cart.png" alt="Giỏ hàng">
    <span id="cart-count">{{ cartCount }}</span>
  </router-link>
</template>

<script setup>
import { useCart } from '../composables/useCart'

// Lấy số lượng sản phẩm trong giỏ
const { cartCount } = useCart()
</script>