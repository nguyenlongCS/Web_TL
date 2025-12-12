// backend/routes/chat.js
// Routes cho chat
import express from 'express'
import {
  getMessages,
  sendMessage,
  markAsRead,
  getChatRooms
} from '../controllers/chatController.js'
import { protect, employeeOrAdmin } from '../middleware/auth.js'

const router = express.Router()

// Lấy tin nhắn trong phòng (public - để guest chat)
router.get('/messages/:roomId', getMessages)

// Gửi tin nhắn (public - để guest chat)
router.post('/messages', sendMessage)

// Đánh dấu đã đọc (admin/employee)
router.put('/messages/:roomId/read', protect, employeeOrAdmin, markAsRead)

// Lấy danh sách phòng chat (admin/employee)
router.get('/rooms', protect, employeeOrAdmin, getChatRooms)

export default router