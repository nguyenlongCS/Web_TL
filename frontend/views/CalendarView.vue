<!-- frontend/views/CalendarView.vue -->
<!-- Trang quản lý lịch - chỉ dành cho admin và employee -->

<template>
  <section class="page-section">
    <div class="container">
      <h2>Quản lý lịch</h2>

      <!-- Kiểm tra quyền truy cập -->
      <div v-if="!canAccess" style="text-align: center; padding: 50px;">
        <p style="color: #ef4444; font-size: 1.2rem;">
          ⚠️ Bạn không có quyền truy cập trang này
        </p>
        <router-link to="/" class="btn-back">Quay về trang chủ</router-link>
      </div>

      <!-- Hiển thị loading -->
      <div v-else-if="loading" style="text-align: center; padding: 50px;">
        <p style="color: #e63946;">Đang tải lịch...</p>
      </div>

      <!-- Hiển thị lỗi -->
      <div v-else-if="error" style="text-align: center; padding: 50px;">
        <p style="color: #ef4444;">{{ error }}</p>
      </div>

      <!-- Giao diện quản lý lịch -->
      <div v-else class="calendar-container">
        <!-- Header điều khiển tháng/năm -->
        <div class="calendar-controls">
          <button class="btn-nav" @click="previousMonth">◀ Tháng trước</button>
          
          <div class="month-year-selector">
            <select v-model.number="selectedMonth" @change="loadCalendar">
              <option v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
            </select>
            <select v-model.number="selectedYear" @change="loadCalendar">
              <option v-for="y in yearOptions" :key="y" :value="y">Năm {{ y }}</option>
            </select>
          </div>

          <button class="btn-nav" @click="nextMonth">Tháng sau ▶</button>
        </div>

        <!-- Grid lịch -->
        <CalendarGrid 
          :daysInMonth="calendarData"
          :year="selectedYear"
          :month="selectedMonth"
          @date-click="handleDateClick"
        />
      </div>

      <!-- Modal kẹt lịch -->
      <div v-if="showBlockModal" class="modal-overlay" @click="closeBlockModal">
        <div class="modal-content" @click.stop>
          <h3>{{ selectedDay?.status === 'blocked' ? 'Mở lại lịch' : 'Kẹt lịch' }}</h3>
          
          <p class="modal-date">Ngày: {{ formatDate(selectedDay?.date) }}</p>
          
          <!-- Hiển thị trạng thái hiện tại -->
          <div class="current-status">
            <strong>Trạng thái hiện tại:</strong>
            <span :class="'status-badge ' + selectedDay?.status">
              {{ getStatusText(selectedDay?.status) }}
            </span>
          </div>

          <!-- Nếu đang bận, hiển thị số đơn -->
          <div v-if="selectedDay?.status === 'busy'" class="busy-warning">
            ⚠️ Ngày này đang có {{ selectedDay.orderIds.length }} đơn hàng, không thể kẹt lịch
          </div>

          <!-- Nếu đang rảnh, cho phép kẹt lịch -->
          <div v-if="selectedDay?.status === 'free'" class="block-form">
            <label>Ghi chú (tùy chọn):</label>
            <textarea 
              v-model="blockNote"
              placeholder="Nhập lý do kẹt lịch..."
              rows="3"
            ></textarea>
          </div>

          <!-- Nếu đang blocked, hiển thị ghi chú -->
          <div v-if="selectedDay?.status === 'blocked' && selectedDay?.note" class="blocked-note">
            <strong>Ghi chú:</strong>
            <p>{{ selectedDay.note }}</p>
          </div>

          <div class="modal-actions">
            <button class="btn-modal-cancel" @click="closeBlockModal">
              Đóng
            </button>
            
            <button 
              v-if="selectedDay?.status === 'free'"
              class="btn-modal-confirm block"
              @click="confirmBlock"
            >
              Kẹt lịch
            </button>
            
            <button 
              v-if="selectedDay?.status === 'blocked'"
              class="btn-modal-confirm unblock"
              @click="confirmUnblock"
            >
              Mở lại
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CalendarGrid from '../components/calendar/CalendarGrid.vue'
import { useCalendar } from '../composables/useCalendar'
import { useAuth } from '../composables/useAuth'

const { currentUser } = useAuth()
const { calendarData, loading, error, fetchCalendar, blockDate, unblockDate } = useCalendar()

// Kiểm tra quyền truy cập (chỉ admin và employee)
const canAccess = computed(() => {
  return currentUser.value && (
    currentUser.value.role === 'admin' || 
    currentUser.value.role === 'employee'
  )
})

// State cho tháng/năm hiện tại
const now = new Date()
const selectedMonth = ref(now.getMonth() + 1)
const selectedYear = ref(now.getFullYear())

// Danh sách năm (từ năm hiện tại đến 2 năm sau)
const yearOptions = computed(() => {
  const current = new Date().getFullYear()
  return [current, current + 1, current + 2]
})

// State cho modal
const showBlockModal = ref(false)
const selectedDay = ref(null)
const blockNote = ref('')

// Load lịch theo tháng/năm
const loadCalendar = async () => {
  await fetchCalendar(selectedYear.value, selectedMonth.value)
}

// Chuyển tháng trước
const previousMonth = () => {
  if (selectedMonth.value === 1) {
    selectedMonth.value = 12
    selectedYear.value--
  } else {
    selectedMonth.value--
  }
  loadCalendar()
}

// Chuyển tháng sau
const nextMonth = () => {
  if (selectedMonth.value === 12) {
    selectedMonth.value = 1
    selectedYear.value++
  } else {
    selectedMonth.value++
  }
  loadCalendar()
}

// Xử lý click vào ngày
const handleDateClick = (day) => {
  selectedDay.value = day
  blockNote.value = day.note || ''
  showBlockModal.value = true
}

// Đóng modal
const closeBlockModal = () => {
  showBlockModal.value = false
  selectedDay.value = null
  blockNote.value = ''
}

// Xác nhận kẹt lịch
const confirmBlock = async () => {
  const result = await blockDate(selectedDay.value.date, blockNote.value)
  
  if (result.success) {
    alert('✅ ' + result.message)
    closeBlockModal()
  } else {
    alert('❌ ' + result.message)
  }
}

// Xác nhận mở lại lịch
const confirmUnblock = async () => {
  const result = await unblockDate(selectedDay.value.date)
  
  if (result.success) {
    alert('✅ ' + result.message)
    closeBlockModal()
  } else {
    alert('❌ ' + result.message)
  }
}

// Format ngày hiển thị
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Lấy text trạng thái
const getStatusText = (status) => {
  const statusMap = {
    'free': 'Rảnh',
    'busy': 'Bận',
    'blocked': 'Kẹt lịch'
  }
  return statusMap[status] || status
}

// Load lịch khi component mount
onMounted(() => {
  if (canAccess.value) {
    loadCalendar()
  }
})
</script>

<style scoped>
.calendar-container {
  max-width: 1000px;
  margin: 0 auto;
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-nav {
  padding: 10px 20px;
  background: #e63946;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-nav:hover {
  background: #d00000;
}

.month-year-selector {
  display: flex;
  gap: 15px;
}

.month-year-selector select {
  padding: 10px 15px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  background: white;
}

.month-year-selector select:focus {
  outline: none;
  border-color: #e63946;
}

.btn-back {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #e63946;
  color: white;
  border-radius: 20px;
  text-decoration: none;
  transition: background 0.3s;
}

.btn-back:hover {
  background: #d00000;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  color: #e63946;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.modal-date {
  color: #4b5563;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.current-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-badge.free {
  background: #d1fae5;
  color: #047857;
}

.status-badge.busy {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.blocked {
  background: #fef3c7;
  color: #92400e;
}

.busy-warning {
  padding: 15px;
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 6px;
  color: #92400e;
  margin-bottom: 15px;
}

.block-form {
  margin-bottom: 20px;
}

.block-form label {
  display: block;
  margin-bottom: 8px;
  color: #1D3557;
  font-weight: 500;
}

.block-form textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-family: inherit;
  resize: vertical;
}

.block-form textarea:focus {
  outline: none;
  border-color: #e63946;
}

.blocked-note {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 15px;
}

.blocked-note strong {
  color: #1D3557;
  display: block;
  margin-bottom: 8px;
}

.blocked-note p {
  color: #4b5563;
  margin: 0;
  font-style: italic;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-modal-cancel,
.btn-modal-confirm {
  padding: 10px 24px;
  border: none;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-modal-cancel {
  background: #6b7280;
  color: white;
}

.btn-modal-cancel:hover {
  background: #4b5563;
}

.btn-modal-confirm.block {
  background: #f59e0b;
  color: white;
}

.btn-modal-confirm.block:hover {
  background: #d97706;
}

.btn-modal-confirm.unblock {
  background: #10b981;
  color: white;
}

.btn-modal-confirm.unblock:hover {
  background: #059669;
}
</style>