<!-- frontend/components/Orders.vue -->
<!-- Nút đơn hàng floating -->

<template>
  <router-link to="/donhang" class="orders-button">
    <img src="/frontend/assets/icons/orders.png" alt="Đơn hàng">
    <span id="orders-count">{{ orderCount }}</span>
  </router-link>
</template>

<script setup>
import { useOrders } from '../composables/useOrders'

// Lấy số lượng đơn hàng
const { orderCount } = useOrders()
</script>