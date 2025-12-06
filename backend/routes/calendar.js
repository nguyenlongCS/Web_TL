// backend/routes/calendar.js
// Routes cho quản lý lịch
import express from 'express'
import {
  getCalendarByMonth,
  blockDate,
  unblockDate
} from '../controllers/calendarController.js'
import { protect, employeeOrAdmin } from '../middleware/auth.js'

const router = express.Router()

// Lấy lịch theo tháng
router.get('/', protect, employeeOrAdmin, getCalendarByMonth)

// Kẹt lịch một ngày
router.put('/block', protect, employeeOrAdmin, blockDate)

// Mở lại ngày bị kẹt
router.put('/unblock', protect, employeeOrAdmin, unblockDate)

export default router