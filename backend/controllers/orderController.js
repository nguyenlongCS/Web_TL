// backend/controllers/orderController.js
import Order from '../models/Order.js'

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private (hoặc Public nếu cho phép guest checkout)
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' })
    }

    const orderNumber = `DH${Date.now()}`

    const order = await Order.create({
      orderNumber,
      userId: req.user ? req.user._id : null,
      userName: req.user ? req.user.name : 'Khách hàng',
      items,
      totalAmount,
      status: 'pending'
    })

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      order
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Lấy danh sách đơn hàng của user
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: orders.length,
      orders
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Lấy tất cả đơn hàng
// @route   GET /api/orders/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: orders.length,
      orders
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Lấy chi tiết đơn hàng
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')

    if (order) {
      // Kiểm tra quyền: chỉ user sở hữu hoặc admin mới xem được
      if (order.userId && order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền xem đơn hàng này' })
      }

      res.json({
        success: true,
        order
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Hủy đơn hàng
// @route   DELETE /api/orders/:id
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (order) {
      // Kiểm tra quyền
      if (order.userId && order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền hủy đơn hàng này' })
      }

      // Chỉ cho phép hủy đơn pending
      if (order.status !== 'pending') {
        return res.status(400).json({ message: 'Không thể hủy đơn hàng đã được xử lý' })
      }

      await Order.findByIdAndDelete(req.params.id)

      res.json({
        success: true,
        message: 'Đã hủy đơn hàng thành công'
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Cập nhật trạng thái đơn hàng
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findById(req.params.id)

    if (order) {
      order.status = status
      const updatedOrder = await order.save()

      res.json({
        success: true,
        message: 'Cập nhật trạng thái thành công',
        order: updatedOrder
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}