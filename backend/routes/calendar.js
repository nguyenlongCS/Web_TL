// backend/routes/calendar.js
// Routes cho quản lý lịch - user có thể xem, admin/employee có thể chỉnh sửa
import express from 'express'
import {
  getCalendarByMonth,
  blockDate,
  unblockDate
} from '../controllers/calendarController.js'
import { protect, employeeOrAdmin } from '../middleware/auth.js'

const router = express.Router()

// Lấy lịch theo tháng - tất cả user đã đăng nhập có thể xem
router.get('/', protect, getCalendarByMonth)

// Kẹt lịch một ngày - chỉ admin/employee
router.put('/block', protect, employeeOrAdmin, blockDate)

// Mở lại ngày bị kẹt - chỉ admin/employee
router.put('/unblock', protect, employeeOrAdmin, unblockDate)

export default router