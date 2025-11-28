// backend/controllers/orderController.js
// Controller xử lý đơn hàng - mỗi sản phẩm có ngày bắt đầu và kết thúc riêng
import Order from '../models/Order.js'

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body

    // Validate giỏ hàng
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' })
    }

    // Validate mỗi sản phẩm phải có ngày bắt đầu thuê
    const missingDate = items.find(item => !item.rentalStartDate)
    if (missingDate) {
      return res.status(400).json({ message: 'Vui lòng chọn ngày bắt đầu thuê cho tất cả sản phẩm' })
    }

    const now = new Date()

    // Validate và tính ngày kết thúc cho từng sản phẩm
    const itemsWithEndDate = items.map(item => {
      const startDate = new Date(item.rentalStartDate)
      
      // Kiểm tra ngày bắt đầu phải từ hiện tại trở đi
      if (startDate < now) {
        throw new Error(`Ngày bắt đầu thuê "${item.name}" phải từ hiện tại trở đi`)
      }
      
      // Tính ngày kết thúc
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + item.days)
      
      return {
        ...item,
        rentalEndDate: endDate
      }
    })

    // Lấy ngày bắt đầu sớm nhất làm ngày bắt đầu của đơn hàng
    const earliestStartDate = new Date(
      Math.min(...itemsWithEndDate.map(item => new Date(item.rentalStartDate)))
    )

    // Tạo mã đơn hàng
    const orderNumber = `DH${Date.now()}`

    // Tạo đơn hàng
    const order = await Order.create({
      orderNumber,
      userId: req.user ? req.user._id : null,
      userName: req.user ? req.user.name : 'Khách hàng',
      items: itemsWithEndDate,
      totalAmount,
      rentalStartDate: earliestStartDate,
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
      .populate('approvedBy', 'name')
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
// @access  Private/Admin/Employee
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .populate('approvedBy', 'name')
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
      .populate('approvedBy', 'name')

    if (order) {
      // Kiểm tra quyền
      if (
        order.userId && 
        order.userId.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && 
        req.user.role !== 'employee'
      ) {
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
      if (
        order.userId && 
        order.userId.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin'
      ) {
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

// @desc    Cập nhật trạng thái đơn hàng (Duyệt/Từ chối)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Employee
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body
    const order = await Order.findById(req.params.id)

    if (order) {
      // Validate lý do từ chối nếu từ chối đơn
      if (status === 'rejected' && (!rejectionReason || rejectionReason.trim() === '')) {
        return res.status(400).json({ message: 'Vui lòng nhập lý do từ chối' })
      }

      // Cập nhật trạng thái
      order.status = status
      order.approvedBy = req.user._id
      order.approvedByName = req.user.name
      order.approvedAt = new Date()

      // Lưu lý do từ chối nếu có
      if (status === 'rejected') {
        order.rejectionReason = rejectionReason
      }

      const updatedOrder = await order.save()

      // Populate thông tin người duyệt
      await updatedOrder.populate('approvedBy', 'name')
      await updatedOrder.populate('userId', 'name')

      res.json({
        success: true,
        message: status === 'approved' ? 'Đã chấp nhận đơn hàng' : 'Đã từ chối đơn hàng',
        order: updatedOrder
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}