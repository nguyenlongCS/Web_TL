<!-- frontend/views/OrdersView.vue -->
<!-- Trang đơn hàng - thêm chức năng duyệt đơn cho admin và employee -->

<template>
  <section class="page-section">
    <div class="container">
      <h2>Quản lý đơn hàng</h2>
      
      <!-- Tab chuyển đổi giữa đơn của mình và tất cả đơn (nếu là admin/employee) -->
      <div v-if="canManageOrders" class="order-tabs">
        <button 
          :class="['tab-btn', { active: currentTab === 'my' }]"
          @click="switchTab('my')"
        >
          Đơn hàng của tôi ({{ orderCount }})
        </button>
        <button 
          :class="['tab-btn', { active: currentTab === 'all' }]"
          @click="switchTab('all')"
        >
          Tất cả đơn hàng ({{ allOrderCount }})
        </button>
      </div>
      
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
      <div v-else-if="displayOrders.length === 0" id="orders-container">
        <p>📦 {{ currentTab === 'my' ? 'Bạn chưa có đơn hàng nào.' : 'Chưa có đơn hàng nào trong hệ thống.' }}</p>
      </div>

      <!-- Hiển thị danh sách đơn hàng -->
      <div v-else id="orders-container">
        <OrderCard 
          v-for="order in displayOrders" 
          :key="order._id"
          :order="formatOrder(order)"
          :statusText="getStatusText(order.status)"
          :statusColor="getStatusColor(order.status)"
          :canApprove="canManageOrders && currentTab === 'all'"
          @cancel="handleCancelOrder"
          @approve="handleApproveOrder"
          @reject="handleRejectOrder"
        />
      </div>

      <div v-if="!loading && isLoggedIn" class="order-actions">
        <router-link to="/sanpham" class="btn-back-order">⬅ Trở về</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import OrderCard from '../components/order/OrderCard.vue'
import { useOrders } from '../composables/useOrders'
import { useAuth } from '../composables/useAuth'
import { formatDate } from '../utils/formatters'

const { 
  orders, 
  allOrders,
  orderCount,
  allOrderCount,
  loading, 
  error, 
  fetchMyOrders, 
  fetchAllOrders,
  cancelOrder, 
  updateOrderStatus,
  getStatusText, 
  getStatusColor 
} = useOrders()

const { isLoggedIn, currentUser } = useAuth()

// Tab hiện tại
const currentTab = ref('my')

// Kiểm tra quyền quản lý đơn hàng (admin hoặc employee)
const canManageOrders = computed(() => {
  return currentUser.value && (
    currentUser.value.role === 'admin' || 
    currentUser.value.role === 'employee'
  )
})

// Danh sách đơn hàng hiển thị tùy theo tab
const displayOrders = computed(() => {
  return currentTab.value === 'my' ? orders.value : allOrders.value
})

// Format order để hiển thị
const formatOrder = (order) => {
  return {
    ...order,
    id: order._id,
    createdAt: formatDate(order.createdAt),
    userName: order.userId?.name || order.userName
  }
}

// Chuyển tab
const switchTab = async (tab) => {
  currentTab.value = tab
  
  // Load dữ liệu tương ứng nếu chưa có
  if (tab === 'all' && allOrders.value.length === 0) {
    await fetchAllOrders()
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

// Hàm duyệt đơn hàng
const handleApproveOrder = async (orderId) => {
  if (confirm('Bạn có chắc chắn muốn chấp nhận đơn hàng này?')) {
    const result = await updateOrderStatus(orderId, 'approved')
    if (result.success) {
      alert('✅ ' + result.message)
    } else {
      alert('❌ ' + result.message)
    }
  }
}

// Hàm từ chối đơn hàng
const handleRejectOrder = async (orderId) => {
  if (confirm('Bạn có chắc chắn muốn từ chối đơn hàng này?')) {
    const result = await updateOrderStatus(orderId, 'rejected')
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
    
    // Nếu là admin/employee, load luôn tất cả đơn hàng
    if (canManageOrders.value) {
      await fetchAllOrders()
    }
  }
})

// Load dữ liệu ban đầu nếu đã đăng nhập
if (isLoggedIn.value && canManageOrders.value) {
  fetchAllOrders()
}
</script>

<style scoped>
.order-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #e5e7eb;
}

.tab-btn {
  padding: 12px 24px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
}

.tab-btn:hover {
  color: #e63946;
}

.tab-btn.active {
  color: #e63946;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e63946;
}

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