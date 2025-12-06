// backend/controllers/calendarController.js
// Controller xử lý logic quản lý lịch
import Calendar from '../models/Calendar.js'
import Order from '../models/Order.js'

// @desc    Lấy trạng thái lịch theo tháng
// @route   GET /api/calendar?year=2025&month=12
// @access  Private/Admin/Employee
export const getCalendarByMonth = async (req, res) => {
  try {
    const { year, month } = req.query

    // Validate input
    if (!year || !month) {
      return res.status(400).json({ message: 'Thiếu year hoặc month' })
    }

    // Tính ngày đầu và cuối tháng
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    
    // Tạo danh sách ngày trong tháng
    const dates = []
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(formatDate(new Date(d)))
    }

    // Lấy trạng thái từ database
    const calendars = await Calendar.find({
      date: { $in: dates }
    })

    // Map trạng thái vào từng ngày
    const result = dates.map(date => {
      const calendar = calendars.find(c => c.date === date)
      return {
        date,
        status: calendar ? calendar.status : 'free',
        orderIds: calendar ? calendar.orderIds : [],
        note: calendar ? calendar.note : ''
      }
    })

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Cập nhật trạng thái blocked cho một ngày
// @route   PUT /api/calendar/block
// @access  Private/Admin/Employee
export const blockDate = async (req, res) => {
  try {
    const { date, note } = req.body

    if (!date) {
      return res.status(400).json({ message: 'Thiếu ngày' })
    }

    // Kiểm tra ngày có đơn hàng không
    const calendar = await Calendar.findOne({ date })
    if (calendar && calendar.orderIds.length > 0) {
      return res.status(400).json({ message: 'Ngày này đã có đơn hàng, không thể kẹt lịch' })
    }

    // Cập nhật hoặc tạo mới
    const updated = await Calendar.findOneAndUpdate(
      { date },
      { 
        status: 'blocked',
        note: note || 'Kẹt lịch'
      },
      { new: true, upsert: true }
    )

    res.json({
      success: true,
      message: 'Đã kẹt lịch ngày ' + date,
      data: updated
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Mở lại ngày bị blocked
// @route   PUT /api/calendar/unblock
// @access  Private/Admin/Employee
export const unblockDate = async (req, res) => {
  try {
    const { date } = req.body

    if (!date) {
      return res.status(400).json({ message: 'Thiếu ngày' })
    }

    // Cập nhật status về free
    const updated = await Calendar.findOneAndUpdate(
      { date },
      { 
        status: 'free',
        note: ''
      },
      { new: true }
    )

    res.json({
      success: true,
      message: 'Đã mở lại ngày ' + date,
      data: updated
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Helper: Format date thành YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Hàm helper: Cập nhật trạng thái lịch khi có đơn hàng mới
export const updateCalendarOnNewOrder = async (orderId, items) => {
  try {
    // Lấy tất cả ngày từ đơn hàng
    const dates = new Set()
    
    for (const item of items) {
      if (item.rentalStartDate && item.rentalEndDate) {
        const start = new Date(item.rentalStartDate)
        const end = new Date(item.rentalEndDate)
        
        // Thêm tất cả ngày từ start đến end
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.add(formatDate(new Date(d)))
        }
      }
    }

    // Cập nhật từng ngày
    for (const date of dates) {
      await Calendar.findOneAndUpdate(
        { date },
        { 
          $addToSet: { orderIds: orderId },
          $set: { status: 'busy' }
        },
        { upsert: true }
      )
    }
  } catch (error) {
    console.error('Lỗi cập nhật lịch:', error)
  }
}

// Hàm helper: Xóa đơn hàng khỏi lịch khi hủy/từ chối
export const removeOrderFromCalendar = async (orderId) => {
  try {
    // Tìm tất cả ngày có orderId này
    const calendars = await Calendar.find({ orderIds: orderId })
    
    for (const calendar of calendars) {
      // Xóa orderId
      calendar.orderIds = calendar.orderIds.filter(id => id.toString() !== orderId.toString())
      
      // Nếu không còn đơn nào, chuyển về free (trừ khi blocked)
      if (calendar.orderIds.length === 0 && calendar.status === 'busy') {
        calendar.status = 'free'
      }
      
      await calendar.save()
    }
  } catch (error) {
    console.error('Lỗi xóa đơn khỏi lịch:', error)
  }
}