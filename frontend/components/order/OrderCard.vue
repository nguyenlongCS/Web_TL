<!-- frontend/components/order/OrderCard.vue -->
<!-- Component hiển thị một đơn hàng - thêm nút duyệt đơn -->

<template>
  <div class="order-card">
    <div class="order-header">
      <div class="order-info-left">
        <h3>Đơn hàng #{{ order.orderNumber }}</h3>
        <p class="order-date">{{ order.createdAt }}</p>
        <p v-if="order.userId" class="order-customer">
          Khách hàng: <strong>{{ order.userName }}</strong>
        </p>
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
      
      <!-- Hiển thị thông tin người duyệt nếu có -->
      <div v-if="order.approvedByName" class="order-approver">
        <p>
          <strong>Người duyệt:</strong> {{ order.approvedByName }}
        </p>
        <p class="approved-date">{{ formatDate(order.approvedAt) }}</p>
      </div>
      
      <div class="order-actions">
        <!-- Nút hủy đơn (chỉ cho user và đơn pending) -->
        <button 
          v-if="order.status === 'pending' && !canApprove"
          class="btn-cancel-order"
          @click="$emit('cancel', order.id)"
        >
          Hủy đơn hàng
        </button>
        
        <!-- Nút duyệt đơn (chỉ cho admin và employee) -->
        <template v-if="canApprove && order.status === 'pending'">
          <button 
            class="btn-approve-order"
            @click="$emit('approve', order.id)"
          >
            ✓ Chấp nhận
          </button>
          <button 
            class="btn-reject-order"
            @click="$emit('reject', order.id)"
          >
            ✕ Từ chối
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import OrderItem from './OrderItem.vue'
import { formatPrice, formatDate } from '../../utils/formatters'

defineProps({
  order: Object,
  statusText: String,
  statusColor: String,
  canApprove: {
    type: Boolean,
    default: false
  }
})

defineEmits(['cancel', 'approve', 'reject'])
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
  margin-bottom: 5px;
}

.order-customer {
  color: #4b5563;
  font-size: 0.95rem;
  margin-top: 5px;
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
  padding-top: 15px;
  border-top: 2px solid #f3f4f6;
  margin-top: 15px;
}

.order-total {
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.order-approver {
  background: #f8f9fa;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.order-approver p {
  margin: 3px 0;
  color: #4b5563;
  font-size: 0.9rem;
}

.order-approver strong {
  color: #1D3557;
}

.approved-date {
  font-size: 0.85rem;
  color: #6b7280;
}

.order-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-cancel-order,
.btn-approve-order,
.btn-reject-order {
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-cancel-order {
  background: #ef4444;
  color: white;
}

.btn-cancel-order:hover {
  background: #dc2626;
}

.btn-approve-order {
  background: #10b981;
  color: white;
}

.btn-approve-order:hover {
  background: #059669;
}

.btn-reject-order {
  background: #f59e0b;
  color: white;
}

.btn-reject-order:hover {
  background: #d97706;
}
</style>