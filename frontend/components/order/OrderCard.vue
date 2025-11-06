<!-- frontend/components/order/OrderCard.vue -->
<!-- Component hiển thị một đơn hàng -->

<template>
  <div class="order-card">
    <div class="order-header">
      <div class="order-info-left">
        <h3>Đơn hàng #{{ order.orderNumber }}</h3>
        <p class="order-date">{{ order.createdAt }}</p>
      </div>
      <div class="order-status" :style="{ color: statusColor }">
        <span class="status-badge" :style="{ backgroundColor: statusColor }">
          {{ statusText }}
        </span>
      </div>
    </div>
    <div class="order-items">
      <OrderItem v-for="(item, index) in order.items" :key="index" :item="item" />
    </div>
    <div class="order-footer">
      <div class="order-total">
        <strong>Tổng cộng: </strong>
        <span style="color:#e63946">{{ formatPrice(order.totalAmount) }}</span>
      </div>
      <button 
        v-if="order.status === 'pending'"
        class="btn-cancel-order"
        @click="$emit('cancel', order.id)"
      >
        Hủy đơn hàng
      </button>
    </div>
  </div>
</template>

<script setup>
import OrderItem from './OrderItem.vue'
import { formatPrice } from '../../utils/formatters'

defineProps({
  order: Object,
  statusText: String,
  statusColor: String
})

defineEmits(['cancel'])
</script>

<style scoped>
.order-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 2px solid #f3f4f6;
  margin-bottom: 15px;
}

.order-info-left h3 {
  color: #1D3557;
  margin-bottom: 5px;
}

.order-date {
  color: #6b7280;
  font-size: 0.9rem;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}

.order-items {
  margin: 15px 0;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 2px solid #f3f4f6;
  margin-top: 15px;
}

.order-total {
  font-size: 1.2rem;
}

.btn-cancel-order {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-cancel-order:hover {
  background: #dc2626;
}
</style>