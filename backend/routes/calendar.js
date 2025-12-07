// backend/routes/calendar.js
// Routes cho quản lý lịch theo thời gian cụ thể
import express from 'express'
import {
  getCalendarByMonth,
  blockDate,
  unblockTimeSlot
} from '../controllers/calendarController.js'
import { protect, employeeOrAdmin } from '../middleware/auth.js'

const router = express.Router()

// Lấy lịch theo tháng - tất cả user đã đăng nhập
router.get('/', protect, getCalendarByMonth)

// Kẹt lịch một khoảng thời gian - chỉ admin/employee
router.put('/block', protect, employeeOrAdmin, blockDate)

// Xóa một time slot kẹt lịch - chỉ admin/employee
router.put('/unblock', protect, employeeOrAdmin, unblockTimeSlot)

export default router