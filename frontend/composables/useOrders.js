import { ref, computed } from 'vue'
import { ORDER_STATUS, ORDER_STATUS_TEXT, ORDER_STATUS_COLOR } from '../utils/constants'

const orders = ref([])
const loading = ref(false)

export function useOrders() {
  const orderCount = computed(() => orders.value.length)

  const createOrder = (cartItems, totalAmount, userName) => {
    loading.value = true
    const newOrder = {
      id: Date.now(),
      orderNumber: `DH${Date.now()}`,
      userName: userName || 'Khách hàng',
      items: cartItems.map(item => ({ ...item })),
      totalAmount: totalAmount,
      status: ORDER_STATUS.PENDING,
      createdAt: new Date().toLocaleString('vi-VN'),
      updatedAt: new Date().toLocaleString('vi-VN')
    }
    
    orders.value.unshift(newOrder)
    loading.value = false
    return newOrder
  }

  const cancelOrder = (orderId) => {
    loading.value = true
    const index = orders.value.findIndex(o => o.id === orderId)
    if (index !== -1) {
      orders.value.splice(index, 1)
      loading.value = false
      return { success: true, message: 'Đã hủy đơn hàng thành công' }
    }
    loading.value = false
    return { success: false, message: 'Không tìm thấy đơn hàng' }
  }

  const updateOrderStatus = (orderId, newStatus) => {
    loading.value = true
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = newStatus
      order.updatedAt = new Date().toLocaleString('vi-VN')
      loading.value = false
      return { success: true }
    }
    loading.value = false
    return { success: false }
  }

  const getStatusText = (status) => ORDER_STATUS_TEXT[status] || 'Không xác định'
  const getStatusColor = (status) => ORDER_STATUS_COLOR[status] || '#6b7280'

  return {
    orders,
    orderCount,
    createOrder,
    cancelOrder,
    updateOrderStatus,
    getStatusText,
    getStatusColor,
    loading
  }
}