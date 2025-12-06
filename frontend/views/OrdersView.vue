<!-- frontend/views/OrdersView.vue -->
<!-- Trang đơn hàng của tôi - chỉ hiển thị đơn hàng của user đã đăng nhập -->

<template>
  <section class="page-section">
    <div class="container">
      <h2>Đơn hàng của tôi</h2>
      
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

      <!-- Hiển thị danh sách đơn hàng của tôi -->
      <div v-else id="orders-container">
        <OrderCard 
          v-for="order in orders" 
          :key="order._id"
          :order="formatOrder(order)"
          :statusText="getStatusText(order.status)"
          :statusColor="getStatusColor(order.status)"
          :canApprove="false"
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
import { computed, watch, onMounted } from 'vue'
import OrderCard from '../components/order/OrderCard.vue'
import { useOrders } from '../composables/useOrders'
import { useAuth } from '../composables/useAuth'
import { formatDateTime } from '../utils/formatters'

const { 
  orders, 
  orderCount,
  loading, 
  error, 
  fetchMyOrders, 
  cancelOrder, 
  getStatusText, 
  getStatusColor 
} = useOrders()

const { isLoggedIn } = useAuth()

// Format order để hiển thị
const formatOrder = (order) => {
  return {
    ...order,
    id: order._id,
    createdAt: formatDateTime(order.createdAt),
    userName: order.userId?.name || order.userName
  }
}

// Hàm hủy đơn hàng (chỉ đơn pending)
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

// Load dữ liệu khi user đăng nhập
watch(isLoggedIn, async (newValue) => {
  if (newValue) {
    await fetchMyOrders()
  }
})

// Load dữ liệu ban đầu khi component mount nếu đã đăng nhập
onMounted(async () => {
  if (isLoggedIn.value) {
    await fetchMyOrders()
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