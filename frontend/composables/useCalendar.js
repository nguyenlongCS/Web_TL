// frontend/composables/useCalendar.js
// Composable quản lý lịch theo thời gian cụ thể
import { ref } from 'vue'
import api from '../utils/api'

const calendarData = ref([])
const loading = ref(false)
const error = ref(null)

export function useCalendar() {
  // Lấy lịch theo tháng
  const fetchCalendar = async (year, month) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get(`/calendar?year=${year}&month=${month}`)
      
      if (data.success) {
        calendarData.value = data.data
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải lịch'
      console.error('Lỗi khi tải calendar:', err)
    } finally {
      loading.value = false
    }
  }

  // Kẹt lịch một khoảng thời gian
  const blockTimeSlot = async (date, startTime, endTime, note) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.put('/calendar/block', { 
        date, 
        startTime, 
        endTime, 
        note 
      })
      
      if (data.success) {
        return { success: true, message: data.message }
      }
      return { success: false, message: 'Không thể kẹt lịch' }
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể kẹt lịch'
      console.error('Lỗi khi kẹt lịch:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Xóa một time slot kẹt lịch
  const unblockTimeSlot = async (date, startTime, endTime) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.put('/calendar/unblock', { 
        date, 
        startTime, 
        endTime 
      })
      
      if (data.success) {
        return { success: true, message: data.message }
      }
      return { success: false, message: 'Không thể mở lại lịch' }
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể mở lại lịch'
      console.error('Lỗi khi mở lại lịch:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    calendarData,
    loading,
    error,
    fetchCalendar,
    blockTimeSlot,
    unblockTimeSlot
  }
}