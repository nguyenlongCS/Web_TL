// backend/models/Message.js
// Model quản lý tin nhắn chat
import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  // ID phòng chat (userId hoặc guestId)
  roomId: {
    type: String,
    required: true,
    index: true
  },
  // Người gửi
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  senderName: {
    type: String,
    required: true
  },
  senderRole: {
    type: String,
    enum: ['user', 'admin', 'employee', 'guest'],
    required: true
  },
  // Nội dung tin nhắn
  messageType: {
    type: String,
    enum: ['text', 'image', 'video'],
    default: 'text'
  },
  content: {
    type: String,
    required: true
  },
  // Đánh dấu đã đọc
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const Message = mongoose.model('Message', messageSchema)
export default Message