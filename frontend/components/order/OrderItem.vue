<!-- frontend/components/order/OrderItem.vue -->
<!-- Component hiển thị một item trong đơn hàng -->

<template>
  <div class="order-item">
    <img :src="item.imgSrc" :alt="item.name">
    <div class="order-item-info">
      <h4>{{ item.name }}</h4>
      <p>{{ item.priceText }}</p>
      <p>Số lượng: {{ item.quantity }} | Số ngày: {{ item.days }}</p>
    </div>
    <div class="order-item-total">
      {{ formatPrice(item.price * item.quantity * item.days) }}
    </div>
  </div>
</template>

<script setup>
import { formatPrice } from '../../utils/formatters'

defineProps({
  item: Object
})
</script>

<style scoped>
.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.order-item-info {
  flex: 1;
}

.order-item-info h4 {
  color: #1D3557;
  margin-bottom: 5px;
}

.order-item-info p {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 3px 0;
}

.order-item-total {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e63946;
  min-width: 120px;
  text-align: right;
}
</style>