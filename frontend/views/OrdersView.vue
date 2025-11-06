<!-- frontend/views/OrdersView.vue -->
<!-- Trang đơn hàng - lấy dữ liệu từ API -->

<template>
  <section class="page-section">
    <div class="container">
      <h2>Đơn hàng của bạn</h2>
      
      <!-- Hiển thị loading -->
      <div v-if="loading" id="orders-container">
        <p style="text-align: center; color: #e63946;">Đang tải đơn hàng...</p>
      </div>
      
      <!-- Hiển thị lỗi -->
      <div v-else-if="error" id="orders-container">
        <p style="text-align: center; color: #ef4444;">{{ error }}</p>
      </div>
      
      <!-- Hiển thị khi chưa đăng nhập -->
      <div v-else-if="!isLoggedIn" id="orders-container">
        <p style="text-align: center;">⚠️ Vui lòng đăng nhập để xem đơn hàng.</p>
        <div style="text-align: center; margin-top: 20px;">
          <router-link to="/dangnhap" class="btn-back-order">Đăng nhập</router-link>
        </div>
      </div>
      
      <!-- Hiển thị khi chưa có đơn hàng -->
      <div v-else-if="orders.length === 0" id="orders-container">
        <p>📦 Bạn chưa có đơn hàng nào.</p>
      </div>

      <!-- Hiển thị danh sách đơn hàng -->
      <div v-else id="orders-container">
        <OrderCard 
          v-for="order in orders" 
          :key="order._id"
          :order="formatOrder(order)"
          :statusText="getStatusText(order.status)"
          :statusColor="getStatusColor(order.status)"
          @cancel="handleCancelOrder"
        />
      </div>

      <div v-if="!loading && isLoggedIn" class="order-actions">
        <router-link to="/sanpham" class="btn-back-order">⬅ Trở về</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, watch } from 'vue'
import OrderCard from '../components/order/OrderCard.vue'
import { useOrders } from '../composables/useOrders'
import { useAuth } from '../composables/useAuth'
import { formatDate } from '../utils/formatters'

const { orders, loading, error, fetchMyOrders, cancelOrder, getStatusText, getStatusColor } = useOrders()
const { isLoggedIn } = useAuth()

// Format order để hiển thị
const formatOrder = (order) => {
  return {
    ...order,
    id: order._id,
    createdAt: formatDate(order.createdAt)
  }
}

// Hàm hủy đơn hàng
const handleCancelOrder = async (orderId) => {
  if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
    const result = await cancelOrder(orderId)
    if (result.success) {
      alert('✅ ' + result.message)
    } else {
      alert('❌ ' + result.message)
    }
  }
}

// Load lại đơn hàng khi user đăng nhập
watch(isLoggedIn, (newValue) => {
  if (newValue) {
    fetchMyOrders()
  }
})
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