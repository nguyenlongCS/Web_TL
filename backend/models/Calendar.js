// backend/models/Calendar.js
// Model quản lý lịch theo thời gian cụ thể (từ giờ đến giờ)
import mongoose from 'mongoose'

const calendarSchema = new mongoose.Schema({
  // Ngày (định dạng YYYY-MM-DD)
  date: {
    type: String,
    required: true,
    index: true
  },
  // Các khoảng thời gian bận/kẹt trong ngày
  timeSlots: [{
    // Thời gian bắt đầu (HH:mm)
    startTime: {
      type: String,
      required: true
    },
    // Thời gian kết thúc (HH:mm)
    endTime: {
      type: String,
      required: true
    },
    // Loại: 'busy' (có đơn hàng) hoặc 'blocked' (kẹt lịch)
    type: {
      type: String,
      enum: ['busy', 'blocked'],
      required: true
    },
    // ID đơn hàng (nếu type = 'busy')
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },
    // Ghi chú (nếu type = 'blocked')
    note: {
      type: String,
      default: ''
    }
  }]
}, {
  timestamps: true
})

const Calendar = mongoose.model('Calendar', calendarSchema)
export default Calendar