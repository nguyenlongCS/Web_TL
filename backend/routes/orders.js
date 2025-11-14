// backend/routes/orders.js
// Routes cho đơn hàng - cập nhật quyền truy cập
import express from 'express'
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus
} from '../controllers/orderController.js'
import { protect, admin, employeeOrAdmin } from '../middleware/auth.js'

const router = express.Router()

// Tạo đơn hàng mới
router.post('/', protect, createOrder)

// Lấy đơn hàng của user hiện tại
router.get('/', protect, getMyOrders)

// Lấy tất cả đơn hàng (admin và employee)
router.get('/all', protect, employeeOrAdmin, getAllOrders)

// Lấy chi tiết đơn hàng
router.get('/:id', protect, getOrderById)

// Hủy đơn hàng
router.delete('/:id', protect, cancelOrder)

// Cập nhật trạng thái đơn hàng (admin và employee)
router.put('/:id/status', protect, employeeOrAdmin, updateOrderStatus)

export default router