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

const props = defineProps({
  order: Object,
  statusText: String,
  statusColor: String
})

defineEmits(['cancel'])
</script>