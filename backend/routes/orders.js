// backend/routes/orders.js
import express from 'express'
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, createOrder)
router.get('/', protect, getMyOrders)
router.get('/all', protect, admin, getAllOrders)
router.get('/:id', protect, getOrderById)
router.delete('/:id', protect, cancelOrder)
router.put('/:id/status', protect, admin, updateOrderStatus)

export default router