// frontend/composables/useOrders.js
// Composable quản lý orders - thêm chức năng duyệt đơn
import { ref, computed, onMounted } from 'vue'
import { ORDER_STATUS, ORDER_STATUS_TEXT, ORDER_STATUS_COLOR } from '../utils/constants'
import api from '../utils/api'

const orders = ref([])
const allOrders = ref([])
const loading = ref(false)
const error = ref(null)

export function useOrders() {
  const orderCount = computed(() => orders.value.length)
  const allOrderCount = computed(() => allOrders.value.length)

  // Lấy danh sách đơn hàng của user
  const fetchMyOrders = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/orders')
      
      if (data.success) {
        orders.value = data.orders
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải đơn hàng'
      console.error('Lỗi khi tải orders:', err)
    } finally {
      loading.value = false
    }
  }

  // Lấy tất cả đơn hàng (admin và employee)
  const fetchAllOrders = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/orders/all')
      
      if (data.success) {
        allOrders.value = data.orders
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải đơn hàng'
      console.error('Lỗi khi tải all orders:', err)
    } finally {
      loading.value = false
    }
  }

  // Tạo đơn hàng mới
  const createOrder = async (cartItems, totalAmount) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post('/orders', {
        items: cartItems,
        totalAmount: totalAmount
      })
      
      if (data.success) {
        orders.value.unshift(data.order)
        return { success: true, order: data.order, message: data.message }
      }
      return { success: false, message: 'Không thể tạo đơn hàng' }
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tạo đơn hàng'
      console.error('Lỗi khi tạo order:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Hủy đơn hàng
  const cancelOrder = async (orderId) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.delete(`/orders/${orderId}`)
      
      if (data.success) {
        // Xóa đơn hàng khỏi danh sách local
        const index = orders.value.findIndex(o => o._id === orderId)
        if (index !== -1) {
          orders.value.splice(index, 1)
        }
        
        // Xóa khỏi allOrders nếu có
        const allIndex = allOrders.value.findIndex(o => o._id === orderId)
        if (allIndex !== -1) {
          allOrders.value.splice(allIndex, 1)
        }
        
        return { success: true, message: data.message }
      }
      return { success: false, message: 'Không thể hủy đơn hàng' }
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể hủy đơn hàng'
      console.error('Lỗi khi hủy order:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Cập nhật trạng thái đơn hàng (Duyệt/Từ chối)
  const updateOrderStatus = async (orderId, newStatus) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, {
        status: newStatus
      })
      
      if (data.success) {
        // Cập nhật đơn hàng trong allOrders
        const order = allOrders.value.find(o => o._id === orderId)
        if (order) {
          order.status = newStatus
          order.approvedBy = data.order.approvedBy
          order.approvedByName = data.order.approvedByName
          order.approvedAt = data.order.approvedAt
          order.updatedAt = data.order.updatedAt
        }
        
        // Cập nhật trong orders nếu có
        const myOrder = orders.value.find(o => o._id === orderId)
        if (myOrder) {
          myOrder.status = newStatus
          myOrder.approvedBy = data.order.approvedBy
          myOrder.approvedByName = data.order.approvedByName
          myOrder.approvedAt = data.order.approvedAt
          myOrder.updatedAt = data.order.updatedAt
        }
        
        return { success: true, message: data.message }
      }
      return { success: false, message: 'Không thể cập nhật trạng thái' }
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể cập nhật trạng thái'
      console.error('Lỗi khi cập nhật order status:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Lấy chi tiết một đơn hàng
  const fetchOrderById = async (orderId) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get(`/orders/${orderId}`)
      
      if (data.success) {
        return data.order
      }
      return null
    } catch (err) {
      error.value = err.response?.data?.message || 'Không tìm thấy đơn hàng'
      console.error('Lỗi khi tải order detail:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const getStatusText = (status) => ORDER_STATUS_TEXT[status] || 'Không xác định'
  const getStatusColor = (status) => ORDER_STATUS_COLOR[status] || '#6b7280'

  // Load orders khi component mount (nếu user đã đăng nhập)
  onMounted(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchMyOrders()
    }
  })

  return {
    orders,
    allOrders,
    orderCount,
    allOrderCount,
    loading,
    error,
    fetchMyOrders,
    fetchAllOrders,
    createOrder,
    cancelOrder,
    updateOrderStatus,
    fetchOrderById,
    getStatusText,
    getStatusColor
  }
}