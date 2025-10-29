<template>
  <div>
    <router-link to="/donhang" class="orders-button">
      <img src="/frontend/assets/icons/orders.png" alt="Đơn hàng">
      <span id="orders-count">{{ orderCount }}</span>
    </router-link>
    
    <router-link to="/giohang" class="cart-button">
      <img src="/frontend/assets/icons/cart.png" alt="Giỏ hàng">
      <span id="cart-count">{{ cartCount }}</span>
    </router-link>
  </div>
</template>

<script setup>
import { useCart } from '../../composables/useCart'
import { useOrders } from '../../composables/useOrders'

const { cartCount } = useCart()
const { orderCount } = useOrders()
</script>