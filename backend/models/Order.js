// backend/models/Order.js
// Model đơn hàng - mỗi sản phẩm có ngày kết thúc riêng
import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userName: {
    type: String,
    required: true,
    default: 'Khách hàng'
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    price: Number,
    priceText: String,
    quantity: Number,
    days: Number,
    imgSrc: String,
    // Ngày bắt đầu thuê riêng cho từng sản phẩm
    rentalStartDate: Date,
    // Ngày kết thúc thuê riêng cho từng sản phẩm
    rentalEndDate: Date
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  // Ngày bắt đầu thuê chung cho cả đơn hàng
  rentalStartDate: {
    type: Date,
    default: null
  },
  // Thông tin người duyệt
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedByName: {
    type: String,
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  // Lý do từ chối
  rejectionReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
})

const Order = mongoose.model('Order', orderSchema)
export default Order