<!-- frontend/views/ApproveOrdersView.vue -->
<!-- Trang duyệt đơn hàng - chỉ dành cho admin và employee -->

<template>
  <section class="page-section">
    <div class="container">
      <h2>Duyệt đơn hàng</h2>

      <!-- Kiểm tra quyền truy cập -->
      <div v-if="!canAccess" style="text-align: center; padding: 50px;">
        <p style="color: #ef4444; font-size: 1.2rem;">
          ⚠️ Bạn không có quyền truy cập trang này
        </p>
        <router-link to="/" class="btn-back-order">Quay về trang chủ</router-link>
      </div>

      <!-- Hiển thị loading -->
      <div v-else-if="loading" id="orders-container">
        <p style="text-align: center; color: #e63946;">Đang tải đơn hàng...</p>
      </div>
      
      <!-- Hiển thị lỗi -->
      <div v-else-if="error" id="orders-container">
        <p style="text-align: center; color: #ef4444;">{{ error }}</p>
      </div>
      
      <!-- Hiển thị khi chưa có đơn hàng -->
      <div v-else-if="allOrders.length === 0" id="orders-container">
        <p>📦 Chưa có đơn hàng nào trong hệ thống.</p>
      </div>

      <!-- Hiển thị danh sách tất cả đơn hàng -->
      <div v-else id="orders-container">
        <!-- Bộ lọc trạng thái -->
        <div class="filter-tabs">
          <button 
            :class="['filter-btn', { active: statusFilter === 'all' }]"
            @click="statusFilter = 'all'"
          >
            Tất cả ({{ allOrders.length }})
          </button>
          <button 
            :class="['filter-btn', { active: statusFilter === 'pending' }]"
            @click="statusFilter = 'pending'"
          >
            Chờ duyệt ({{ pendingCount }})
          </button>
          <button 
            :class="['filter-btn', { active: statusFilter === 'approved' }]"
            @click="statusFilter = 'approved'"
          >
            Đã duyệt ({{ approvedCount }})
          </button>
          <button 
            :class="['filter-btn', { active: statusFilter === 'rejected' }]"
            @click="statusFilter = 'rejected'"
          >
            Đã từ chối ({{ rejectedCount }})
          </button>
        </div>

        <!-- Danh sách đơn hàng -->
        <OrderCard 
          v-for="order in filteredOrders" 
          :key="order._id"
          :order="formatOrder(order)"
          :statusText="getStatusText(order.status)"
          :statusColor="getStatusColor(order.status)"
          :canApprove="true"
          @approve="handleApproveOrder"
          @reject="showRejectModal"
        />

        <!-- Hiển thị thông báo nếu không có đơn hàng theo filter -->
        <p v-if="filteredOrders.length === 0" style="text-align: center; color: #6b7280; margin-top: 30px;">
          Không có đơn hàng {{ getStatusFilterLabel() }}
        </p>
      </div>

      <div v-if="!loading && canAccess" class="order-actions">
        <router-link to="/" class="btn-back-order">⬅ Trở về</router-link>
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
  allOrders,
  allOrderCount,
  loading, 
  error, 
  fetchAllOrders,
  updateOrderStatus,
  getStatusText, 
  getStatusColor 
} = useOrders()

const { isLoggedIn, currentUser } = useAuth()

// State cho bộ lọc trạng thái
const statusFilter = ref('all')

// State cho modal từ chối
const rejectModalVisible = ref(false)
const selectedOrderId = ref(null)
const selectedOrderNumber = ref('')
const rejectionReason = ref('')

// Kiểm tra quyền truy cập (chỉ admin và employee)
const canAccess = computed(() => {
  return currentUser.value && (
    currentUser.value.role === 'admin' || 
    currentUser.value.role === 'employee'
  )
})

// Đếm số lượng đơn hàng theo trạng thái
const pendingCount = computed(() => allOrders.value.filter(o => o.status === 'pending').length)
const approvedCount = computed(() => allOrders.value.filter(o => o.status === 'approved').length)
const rejectedCount = computed(() => allOrders.value.filter(o => o.status === 'rejected').length)

// Lọc đơn hàng theo trạng thái
const filteredOrders = computed(() => {
  if (statusFilter.value === 'all') {
    return allOrders.value
  }
  return allOrders.value.filter(o => o.status === statusFilter.value)
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

// Lấy label cho status filter
const getStatusFilterLabel = () => {
  const labels = {
    pending: 'chờ duyệt',
    approved: 'đã duyệt',
    rejected: 'đã từ chối'
  }
  return labels[statusFilter.value] || ''
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
  if (newValue && canAccess.value) {
    await fetchAllOrders()
  }
})

// Load dữ liệu ban đầu khi component mount
onMounted(async () => {
  if (isLoggedIn.value && canAccess.value) {
    await fetchAllOrders()
  }
})
</script>

<style scoped>
.filter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e5e7eb;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.3s;
}

.filter-btn:hover {
  background: #e5e7eb;
  color: #1D3557;
}

.filter-btn.active {
  background: #e63946;
  color: white;
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