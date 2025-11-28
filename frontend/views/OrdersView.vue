<!-- frontend/views/OrdersView.vue -->
<!-- Trang đơn hàng - thêm modal nhập lý do từ chối -->

<template>
  <section class="page-section">
    <div class="container">
      <h2>Quản lý đơn hàng</h2>
      
      <!-- Tab chuyển đổi giữa đơn của mình và tất cả đơn -->
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
          @reject="showRejectModal"
        />
      </div>

      <div v-if="!loading && isLoggedIn" class="order-actions">
        <router-link to="/sanpham" class="btn-back-order">⬅ Trở về</router-link>
      </div>
    </div>

    <!-- Modal nhập lý do từ chối -->
    <div v-if="rejectModalVisible" class="modal-overlay" @click="closeRejectModal">
      <div class="modal-content" @click.stop>
        <h3>Từ chối đơn hàng</h3>
        <p>Vui lòng nhập lý do từ chối đơn hàng #{{ selectedOrderNumber }}</p>
        
        <textarea 
          v-model="rejectionReason"
          placeholder="Nhập lý do từ chối..."
          rows="5"
          class="rejection-textarea"
        ></textarea>
        
        <div class="modal-actions">
          <button class="btn-modal-cancel" @click="closeRejectModal">
            Hủy
          </button>
          <button 
            class="btn-modal-confirm" 
            @click="confirmRejectOrder"
            :disabled="!rejectionReason.trim()"
          >
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import OrderCard from '../components/order/OrderCard.vue'
import { useOrders } from '../composables/useOrders'
import { useAuth } from '../composables/useAuth'
import { formatDateTime } from '../utils/formatters'

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

// State cho modal từ chối
const rejectModalVisible = ref(false)
const selectedOrderId = ref(null)
const selectedOrderNumber = ref('')
const rejectionReason = ref('')

// Kiểm tra quyền quản lý đơn hàng
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
    createdAt: formatDateTime(order.createdAt),
    userName: order.userId?.name || order.userName
  }
}

// Chuyển tab
const switchTab = async (tab) => {
  currentTab.value = tab
  
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

// Hiển thị modal từ chối
const showRejectModal = (orderId) => {
  const order = allOrders.value.find(o => o._id === orderId)
  if (order) {
    selectedOrderId.value = orderId
    selectedOrderNumber.value = order.orderNumber
    rejectionReason.value = ''
    rejectModalVisible.value = true
  }
}

// Đóng modal
const closeRejectModal = () => {
  rejectModalVisible.value = false
  selectedOrderId.value = null
  selectedOrderNumber.value = ''
  rejectionReason.value = ''
}

// Xác nhận từ chối đơn hàng
const confirmRejectOrder = async () => {
  if (!rejectionReason.value.trim()) {
    alert('⚠️ Vui lòng nhập lý do từ chối!')
    return
  }

  const result = await updateOrderStatus(
    selectedOrderId.value, 
    'rejected', 
    rejectionReason.value.trim()
  )
  
  if (result.success) {
    alert('✅ ' + result.message)
    closeRejectModal()
  } else {
    alert('❌ ' + result.message)
  }
}

// Load dữ liệu khi user đăng nhập
watch(isLoggedIn, async (newValue) => {
  if (newValue) {
    await fetchMyOrders()
    
    if (canManageOrders.value) {
      await fetchAllOrders()
    }
  }
})

// Load dữ liệu ban đầu khi component mount nếu đã đăng nhập
onMounted(async () => {
  if (isLoggedIn.value) {
    await fetchMyOrders()
    
    if (canManageOrders.value) {
      await fetchAllOrders()
    }
  }
})
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  color: #e63946;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.modal-content p {
  color: #4b5563;
  margin-bottom: 20px;
}

.rejection-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 20px;
}

.rejection-textarea:focus {
  outline: none;
  border-color: #e63946;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-modal-cancel,
.btn-modal-confirm {
  padding: 10px 24px;
  border: none;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-modal-cancel {
  background: #6b7280;
  color: white;
}

.btn-modal-cancel:hover {
  background: #4b5563;
}

.btn-modal-confirm {
  background: #ef4444;
  color: white;
}

.btn-modal-confirm:hover {
  background: #dc2626;
}

.btn-modal-confirm:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>