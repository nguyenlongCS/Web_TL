<template>
  <div>
    <div id="cart-total">
      <h3>
        Tổng cộng: 
        <span style="color:#e63946">{{ formatPrice(total) }}</span>
      </h3>
    </div>
    <div class="cart-actions">
      <router-link to="/sanpham" class="btn-back-cart">⬅ Trở về</router-link>
      <button class="btn-rent" @click="$emit('checkout')">
        đặt ngay
      </button>
    </div>
  </div>
</template>

<script setup>
import { formatPrice } from '../../utils/formatters'

defineProps({
  total: Number
})

defineEmits(['checkout'])
</script>