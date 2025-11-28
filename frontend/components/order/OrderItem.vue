<!-- frontend/components/order/OrderItem.vue -->
<!-- Component hiển thị một item trong đơn hàng - hiển thị ngày bắt đầu và kết thúc -->

<template>
  <div class="order-item">
    <img :src="item.imgSrc" :alt="item.name">
    <div class="order-item-info">
      <h4>{{ item.name }}</h4>
      <p>{{ item.priceText }}</p>
      <p>Số lượng: {{ item.quantity }} | Số ngày: {{ item.days }}</p>
      
      <!-- Hiển thị ngày bắt đầu và kết thúc thuê nếu có -->
      <div v-if="showRentalDate && item.rentalStartDate" class="rental-dates">
        <p class="rental-start-date">
          📅 Ngày bắt đầu: <strong>{{ formatDateTime(item.rentalStartDate) }}</strong>
        </p>
        <p v-if="item.rentalEndDate" class="rental-end-date">
          ⏰ Ngày kết thúc: <strong>{{ formatDateTime(item.rentalEndDate) }}</strong>
        </p>
      </div>
    </div>
    <div class="order-item-total">
      {{ formatPrice(item.price * item.quantity * item.days) }}
    </div>
  </div>
</template>

<script setup>
import { formatPrice, formatDateTime } from '../../utils/formatters'

defineProps({
  item: Object,
  showRentalDate: {
    type: Boolean,
    default: false
  }
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

.rental-dates {
  margin-top: 8px;
  padding: 10px;
  background: #f0f9ff;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

.rental-dates p {
  margin: 3px 0;
  font-size: 0.88rem;
}

.rental-start-date {
  color: #1e40af !important;
}

.rental-start-date strong {
  color: #1e3a8a;
}

.rental-end-date {
  color: #059669 !important;
}

.rental-end-date strong {
  color: #047857;
}

.order-item-total {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e63946;
  min-width: 120px;
  text-align: right;
}
</style>