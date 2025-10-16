<!-- frontend/views/OrdersView.vue -->
<!-- View trang đơn hàng -->

<template>
  <section class="page-section">
    <div class="container">
      <h2>Đơn hàng của bạn</h2>
      
      <!-- Danh sách đơn hàng trống -->
      <div v-if="orders.length === 0" id="orders-container">
        <p>📦 Bạn chưa có đơn hàng nào.</p>
      </div>

      <!-- Danh sách đơn hàng -->
      <div v-else id="orders-container">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="order-card"
        >
          <!-- Header đơn hàng -->
          <div class="order-header">
            <div class="order-info-left">
              <h3>Đơn hàng #{{ order.orderNumber }}</h3>
              <p class="order-date">{{ order.createdAt }}</p>
            </div>
            <div class="order-status" :style="{ color: getStatusColor(order.status) }">
              <span class="status-badge" :style="{ backgroundColor: getStatusColor(order.status) }">
                {{ getStatusText(order.status) }}
              </span>
            </div>
          </div>

          <!-- Danh sách sản phẩm trong đơn -->
          <div class="order-items">
            <div 
              v-for="(item, index) in order.items" 
              :key="index"
              class="order-item"
            >
              <img :src="item.imgSrc" :alt="item.name">
              <div class="order-item-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.priceText }}</p>
                <p>Số lượng: {{ item.quantity }} | Số ngày: {{ item.days }}</p>
              </div>
              <div class="order-item-total">
                {{ (item.price * item.quantity * item.days).toLocaleString() }}đ
              </div>
            </div>
          </div>

          <!-- Footer đơn hàng -->
          <div class="order-footer">
            <div class="order-total">
              <strong>Tổng cộng: </strong>
              <span style="color:#e63946">{{ order.totalAmount.toLocaleString() }}đ</span>
            </div>
            <button 
              v-if="order.status === 'pending'"
              class="btn-cancel-order"
              @click="handleCancelOrder(order.id)"
            >
              Hủy đơn hàng
            </button>
          </div>
        </div>
      </div>

      <!-- Nút quay lại -->
      <div class="order-actions">
        <router-link to="/sanpham" class="btn-back-order">⬅ Trở về</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useOrders } from '../composables/useOrders'

// Lấy các hàm và dữ liệu từ composable
const { 
  orders,
  cancelOrder,
  getStatusText,
  getStatusColor
} = useOrders()

// Xử lý hủy đơn hàng
const handleCancelOrder = (orderId) => {
  if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
    const result = cancelOrder(orderId)
    alert(result.message)
  }
}
</script>

<style scoped>
#orders-container {
  min-height: 200px;
}

#orders-container > p {
  text-align: center;
  color: #6b7280;
  font-size: 1.1rem;
  margin-top: 50px;
}

.order-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 2px solid #e5e7eb;
}

.order-info-left h3 {
  color: #1D3557;
  margin-bottom: 5px;
  font-size: 1.2rem;
}

.order-date {
  color: #6b7280;
  font-size: 0.9rem;
}

.status-badge {
  padding: 6px 15px;
  border-radius: 20px;
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
}

.order-items {
  padding: 20px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #e5e7eb;
  padding: 15px 0;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item img {
  width: 80px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
}

.order-item-info {
  flex: 1;
}

.order-item-info h4 {
  color: #e63946;
  margin-bottom: 5px;
  font-size: 1rem;
}

.order-item-info p {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 3px 0;
}

.order-item-total {
  font-weight: 600;
  color: #1D3557;
  font-size: 1.1rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-top: 2px solid #e5e7eb;
}

.order-total {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.btn-cancel-order {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-cancel-order:hover {
  background: #dc2626;
}

.order-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 30px;
}

.btn-back-order {
  display: inline-block;
  background-color: #e63946;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.3s;
}

.btn-back-order:hover {
  background-color: #d00000;
}
</style>