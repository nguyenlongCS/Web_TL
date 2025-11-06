<!-- frontend/components/cart/CartSummary.vue -->
<!-- Component hiển thị tổng giỏ hàng và nút checkout -->

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
      <button 
        class="btn-rent" 
        :disabled="loading"
        @click="$emit('checkout')"
      >
        {{ loading ? 'Đang xử lý...' : 'Đặt ngay' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { formatPrice } from '../../utils/formatters'

defineProps({
  total: Number,
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['checkout'])
</script>

<style scoped>
.btn-rent:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>