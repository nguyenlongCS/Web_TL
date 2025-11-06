// frontend/composables/useOrders.js
// Composable quản lý orders từ API thay vì local state

import { ref, computed, onMounted } from 'vue'
import { ORDER_STATUS, ORDER_STATUS_TEXT, ORDER_STATUS_COLOR } from '../utils/constants'
import api from '../utils/api'

const orders = ref([])
const loading = ref(false)
const error = ref(null)

export function useOrders() {
  const orderCount = computed(() => orders.value.length)

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
        // Thêm đơn hàng mới vào đầu danh sách
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

  // Cập nhật trạng thái đơn hàng (Admin only)
  const updateOrderStatus = async (orderId, newStatus) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, {
        status: newStatus
      })
      
      if (data.success) {
        // Cập nhật đơn hàng trong danh sách local
        const order = orders.value.find(o => o._id === orderId)
        if (order) {
          order.status = newStatus
          order.updatedAt = data.order.updatedAt
        }
        return { success: true, message: data.message }
      }
      return { success: false }
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể cập nhật trạng thái'
      console.error('Lỗi khi cập nhật order status:', err)
      return { success: false }
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
    orderCount,
    loading,
    error,
    fetchMyOrders,
    createOrder,
    cancelOrder,
    updateOrderStatus,
    fetchOrderById,
    getStatusText,
    getStatusColor
  }
}