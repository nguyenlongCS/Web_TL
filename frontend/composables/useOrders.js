// frontend/composables/useOrders.js
// Quản lý logic đơn hàng

import { ref, computed } from 'vue'

// Danh sách đơn hàng (lưu trong memory)
const orders = ref([])

export function useOrders() {
  // Tính tổng số đơn hàng
  const orderCount = computed(() => orders.value.length)

  // Tạo đơn hàng mới từ giỏ hàng
  const createOrder = (cartItems, totalAmount, userName) => {
    const newOrder = {
      id: Date.now(),
      orderNumber: `DH${Date.now()}`,
      userName: userName || 'Khách hàng',
      items: cartItems.map(item => ({ ...item })),
      totalAmount: totalAmount,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toLocaleString('vi-VN'),
      updatedAt: new Date().toLocaleString('vi-VN')
    }
    
    orders.value.unshift(newOrder) // Thêm vào đầu danh sách
    return newOrder
  }

  // Hủy đơn hàng
  const cancelOrder = (orderId) => {
    const index = orders.value.findIndex(o => o.id === orderId)
    if (index !== -1) {
      orders.value.splice(index, 1)
      return { success: true, message: 'Đã hủy đơn hàng thành công' }
    }
    return { success: false, message: 'Không tìm thấy đơn hàng' }
  }

  // Cập nhật trạng thái đơn hàng (admin dùng)
  const updateOrderStatus = (orderId, newStatus) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = newStatus
      order.updatedAt = new Date().toLocaleString('vi-VN')
      return { success: true }
    }
    return { success: false }
  }

  // Lấy text trạng thái
  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Chờ duyệt',
      approved: 'Đã chấp nhận',
      rejected: 'Bị từ chối'
    }
    return statusMap[status] || 'Không xác định'
  }

  // Lấy màu trạng thái
  const getStatusColor = (status) => {
    const colorMap = {
      pending: '#f59e0b',
      approved: '#10b981',
      rejected: '#ef4444'
    }
    return colorMap[status] || '#6b7280'
  }

  return {
    orders,
    orderCount,
    createOrder,
    cancelOrder,
    updateOrderStatus,
    getStatusText,
    getStatusColor
  }
}