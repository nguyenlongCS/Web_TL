// backend/models/Calendar.js
// Model quản lý trạng thái lịch cho từng ngày
import mongoose from 'mongoose'

const calendarSchema = new mongoose.Schema({
  // Ngày (định dạng YYYY-MM-DD)
  date: {
    type: String,
    required: true,
    unique: true
  },
  // Trạng thái: 'free' (rảnh), 'busy' (bận), 'blocked' (kẹt lịch)
  status: {
    type: String,
    enum: ['free', 'busy', 'blocked'],
    default: 'free'
  },
  // Danh sách đơn hàng trong ngày
  orderIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  // Ghi chú (nếu blocked)
  note: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

const Calendar = mongoose.model('Calendar', calendarSchema)
export default Calendar