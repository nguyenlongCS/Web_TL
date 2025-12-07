// backend/controllers/calendarController.js
// Controller quản lý lịch theo thời gian cụ thể - FIX: Không tạo duplicate slots
import Calendar from '../models/Calendar.js'
import Order from '../models/Order.js'

// Helper: Format date thành YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Helper: Chuyển time string thành số phút từ 00:00
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

// Helper: Kiểm tra 2 khoảng thời gian có trùng nhau không
const isTimeOverlap = (start1, end1, start2, end2) => {
  const s1 = timeToMinutes(start1)
  const e1 = timeToMinutes(end1)
  const s2 = timeToMinutes(start2)
  const e2 = timeToMinutes(end2)
  
  return s1 < e2 && s2 < e1
}

// @desc    Lấy trạng thái lịch theo tháng
// @route   GET /api/calendar?year=2025&month=12
// @access  Private
export const getCalendarByMonth = async (req, res) => {
  try {
    const { year, month } = req.query

    if (!year || !month) {
      return res.status(400).json({ message: 'Thiếu year hoặc month' })
    }

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    
    const dates = []
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(formatDate(new Date(d)))
    }

    const calendars = await Calendar.find({
      date: { $in: dates }
    }).populate('timeSlots.orderId', 'orderNumber userName')

    const result = dates.map(date => {
      const calendar = calendars.find(c => c.date === date)
      
      if (!calendar || calendar.timeSlots.length === 0) {
        return {
          date,
          status: 'free',
          timeSlots: []
        }
      }
      
      return {
        date,
        status: 'busy',
        timeSlots: calendar.timeSlots.map(slot => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          type: slot.type,
          orderId: slot.orderId?._id,
          orderNumber: slot.orderId?.orderNumber,
          userName: slot.orderId?.userName,
          note: slot.note
        }))
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

// @desc    Kẹt lịch với khoảng thời gian cụ thể
// @route   PUT /api/calendar/block
// @access  Private/Admin/Employee
export const blockDate = async (req, res) => {
  try {
    const { date, startTime, endTime, note } = req.body

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Thiếu ngày hoặc thời gian' })
    }

    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      return res.status(400).json({ message: 'Thời gian kết thúc phải sau thời gian bắt đầu' })
    }

    const calendar = await Calendar.findOne({ date })
    
    if (calendar) {
      for (const slot of calendar.timeSlots) {
        if (isTimeOverlap(startTime, endTime, slot.startTime, slot.endTime)) {
          return res.status(400).json({ 
            message: `Khoảng thời gian này trùng với ${slot.type === 'busy' ? 'đơn hàng' : 'lịch kẹt'} từ ${slot.startTime} đến ${slot.endTime}` 
          })
        }
      }
      
      calendar.timeSlots.push({
        startTime,
        endTime,
        type: 'blocked',
        note: note || 'Kẹt lịch'
      })
      
      await calendar.save()
      
      res.json({
        success: true,
        message: `Đã kẹt lịch ngày ${date} từ ${startTime} đến ${endTime}`,
        data: calendar
      })
    } else {
      const newCalendar = await Calendar.create({
        date,
        timeSlots: [{
          startTime,
          endTime,
          type: 'blocked',
          note: note || 'Kẹt lịch'
        }]
      })
      
      res.json({
        success: true,
        message: `Đã kẹt lịch ngày ${date} từ ${startTime} đến ${endTime}`,
        data: newCalendar
      })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Xóa một time slot kẹt lịch
// @route   PUT /api/calendar/unblock
// @access  Private/Admin/Employee
export const unblockTimeSlot = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Thiếu thông tin' })
    }

    const calendar = await Calendar.findOne({ date })
    
    if (!calendar) {
      return res.status(404).json({ message: 'Không tìm thấy lịch' })
    }

    const index = calendar.timeSlots.findIndex(slot => 
      slot.type === 'blocked' && 
      slot.startTime === startTime && 
      slot.endTime === endTime
    )

    if (index === -1) {
      return res.status(404).json({ message: 'Không tìm thấy time slot' })
    }

    calendar.timeSlots.splice(index, 1)
    await calendar.save()

    res.json({
      success: true,
      message: `Đã mở lại thời gian từ ${startTime} đến ${endTime}`,
      data: calendar
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Helper: Cập nhật lịch khi có đơn hàng mới
export const updateCalendarOnNewOrder = async (orderId, items) => {
  try {
    // Collect tất cả các time slots theo ngày
    const slotsByDate = new Map() // Map<dateStr, Array<{startTime, endTime}>>
    
    for (const item of items) {
      if (!item.rentalStartDate || !item.rentalEndDate) continue
      
      const startDateTime = new Date(item.rentalStartDate)
      const endDateTime = new Date(item.rentalEndDate)
      
      // Lặp qua từng ngày
      let currentDate = new Date(startDateTime)
      
      while (currentDate < endDateTime) {
        const dateStr = formatDate(currentDate)
        
        let startTime, endTime
        
        if (formatDate(currentDate) === formatDate(startDateTime)) {
          startTime = `${String(startDateTime.getHours()).padStart(2, '0')}:${String(startDateTime.getMinutes()).padStart(2, '0')}`
          
          if (formatDate(endDateTime) === formatDate(startDateTime)) {
            endTime = `${String(endDateTime.getHours()).padStart(2, '0')}:${String(endDateTime.getMinutes()).padStart(2, '0')}`
          } else {
            endTime = '23:59'
          }
        }
        else if (formatDate(currentDate) === formatDate(endDateTime)) {
          startTime = '00:00'
          endTime = `${String(endDateTime.getHours()).padStart(2, '0')}:${String(endDateTime.getMinutes()).padStart(2, '0')}`
        }
        else {
          startTime = '00:00'
          endTime = '23:59'
        }
        
        // Thêm vào map
        if (!slotsByDate.has(dateStr)) {
          slotsByDate.set(dateStr, [])
        }
        slotsByDate.get(dateStr).push({ startTime, endTime })
        
        currentDate.setDate(currentDate.getDate() + 1)
        currentDate.setHours(0, 0, 0, 0)
      }
    }
    
    // Merge các time slots trùng lặp và lưu vào database
    for (const [dateStr, slots] of slotsByDate.entries()) {
      // Merge các khoảng thời gian overlap thành 1
      const mergedSlots = mergeTimeSlots(slots)
      
      let calendar = await Calendar.findOne({ date: dateStr })
      
      if (!calendar) {
        calendar = new Calendar({
          date: dateStr,
          timeSlots: []
        })
      }
      
      // Thêm các merged slots
      for (const slot of mergedSlots) {
        calendar.timeSlots.push({
          startTime: slot.startTime,
          endTime: slot.endTime,
          type: 'busy',
          orderId: orderId
        })
      }
      
      await calendar.save()
    }
  } catch (error) {
    console.error('Lỗi cập nhật lịch:', error)
  }
}

// Helper: Merge các time slots overlap thành 1
function mergeTimeSlots(slots) {
  if (slots.length === 0) return []
  
  // Sort theo startTime
  slots.sort((a, b) => {
    const timeA = timeToMinutes(a.startTime)
    const timeB = timeToMinutes(b.startTime)
    return timeA - timeB
  })
  
  const merged = [slots[0]]
  
  for (let i = 1; i < slots.length; i++) {
    const current = slots[i]
    const last = merged[merged.length - 1]
    
    const lastEnd = timeToMinutes(last.endTime)
    const currentStart = timeToMinutes(current.startTime)
    const currentEnd = timeToMinutes(current.endTime)
    
    // Nếu overlap hoặc kề nhau → merge
    if (currentStart <= lastEnd) {
      // Extend endTime nếu cần
      if (currentEnd > lastEnd) {
        last.endTime = current.endTime
      }
    } else {
      // Không overlap → thêm mới
      merged.push(current)
    }
  }
  
  return merged
}

// Helper: Xóa đơn hàng khỏi lịch
export const removeOrderFromCalendar = async (orderId) => {
  try {
    const calendars = await Calendar.find({ 'timeSlots.orderId': orderId })
    
    for (const calendar of calendars) {
      calendar.timeSlots = calendar.timeSlots.filter(
        slot => slot.orderId?.toString() !== orderId.toString()
      )
      
      if (calendar.timeSlots.length === 0) {
        await Calendar.deleteOne({ _id: calendar._id })
      } else {
        await calendar.save()
      }
    }
  } catch (error) {
    console.error('Lỗi xóa đơn khỏi lịch:', error)
  }
}

// Helper: Kiểm tra lịch có trống trong khoảng thời gian không
export const checkCalendarAvailability = async (dateTime, items) => {
  try {
    const conflicts = []
    
    for (const item of items) {
      if (!item.rentalStartDate || !item.rentalEndDate) continue
      
      const startDateTime = new Date(item.rentalStartDate)
      const endDateTime = new Date(item.rentalEndDate)
      
      let currentDate = new Date(startDateTime)
      
      while (currentDate < endDateTime) {
        const dateStr = formatDate(currentDate)
        
        let checkStartTime, checkEndTime
        
        if (formatDate(currentDate) === formatDate(startDateTime)) {
          checkStartTime = `${String(startDateTime.getHours()).padStart(2, '0')}:${String(startDateTime.getMinutes()).padStart(2, '0')}`
          
          if (formatDate(endDateTime) === formatDate(startDateTime)) {
            checkEndTime = `${String(endDateTime.getHours()).padStart(2, '0')}:${String(endDateTime.getMinutes()).padStart(2, '0')}`
          } else {
            checkEndTime = '23:59'
          }
        } else if (formatDate(currentDate) === formatDate(endDateTime)) {
          checkStartTime = '00:00'
          checkEndTime = `${String(endDateTime.getHours()).padStart(2, '0')}:${String(endDateTime.getMinutes()).padStart(2, '0')}`
        } else {
          checkStartTime = '00:00'
          checkEndTime = '23:59'
        }
        
        const calendar = await Calendar.findOne({ date: dateStr })
        
        if (calendar) {
          for (const slot of calendar.timeSlots) {
            if (isTimeOverlap(checkStartTime, checkEndTime, slot.startTime, slot.endTime)) {
              const [year, month, day] = dateStr.split('-')
              conflicts.push({
                date: `${day}/${month}/${year}`,
                startTime: slot.startTime,
                endTime: slot.endTime,
                type: slot.type
              })
            }
          }
        }
        
        currentDate.setDate(currentDate.getDate() + 1)
        currentDate.setHours(0, 0, 0, 0)
      }
    }
    
    return {
      available: conflicts.length === 0,
      conflicts
    }
  } catch (error) {
    console.error('Lỗi kiểm tra lịch:', error)
    throw error
  }
}