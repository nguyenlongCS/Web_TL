<!-- frontend/views/CalendarView.vue -->
<!-- Trang quản lý lịch theo giờ - hiển thị chi tiết từng khoảng thời gian -->

<template>
  <section class="page-section">
    <div class="container">
      <h2>{{ canEdit ? 'Quản lý lịch' : 'Xem lịch' }}</h2>

      <div v-if="loading" style="text-align: center; padding: 50px;">
        <p style="color: #e63946;">Đang tải lịch...</p>
      </div>

      <div v-else-if="error" style="text-align: center; padding: 50px;">
        <p style="color: #ef4444;">{{ error }}</p>
      </div>

      <div v-else-if="!isLoggedIn" style="text-align: center; padding: 50px;">
        <p style="color: #6b7280;">⚠️ Vui lòng đăng nhập để xem lịch.</p>
        <div style="margin-top: 20px;">
          <router-link to="/dangnhap" class="btn-back">Đăng nhập</router-link>
        </div>
      </div>

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

        <div v-if="!canEdit" class="info-banner">
          ℹ️ Bạn đang xem lịch ở chế độ chỉ đọc
        </div>

        <!-- Grid lịch -->
        <CalendarGrid 
          :daysInMonth="calendarData"
          :year="selectedYear"
          :month="selectedMonth"
          @date-click="handleDateClick"
        />
      </div>

      <!-- Modal chi tiết ngày -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content modal-large" @click.stop>
          <h3>{{ canEdit ? 'Quản lý lịch' : 'Chi tiết' }} - {{ formatDate(selectedDay?.date) }}</h3>
          
          <!-- Hiển thị chi tiết time slots -->
          <div v-if="selectedDay?.timeSlots && selectedDay.timeSlots.length > 0" class="time-slots-list">
            <h4>Các khoảng thời gian:</h4>
            <div v-for="(slot, index) in selectedDay.timeSlots" :key="index" class="time-slot-item">
              <div class="slot-header">
                <span class="slot-time">⏰ {{ slot.startTime }} - {{ slot.endTime }}</span>
                <span :class="'slot-badge ' + slot.type">
                  {{ slot.type === 'busy' ? '📦 Đơn hàng' : '🚫 Kẹt lịch' }}
                </span>
              </div>
              <div v-if="slot.type === 'busy' && slot.orderNumber" class="slot-details">
                <p><strong>Đơn hàng:</strong> #{{ slot.orderNumber }}</p>
                <p><strong>Khách hàng:</strong> {{ slot.userName }}</p>
              </div>
              <div v-if="slot.type === 'blocked' && slot.note" class="slot-details">
                <p><strong>Ghi chú:</strong> {{ slot.note }}</p>
              </div>
              <!-- Nút xóa time slot (chỉ admin/employee và chỉ blocked) -->
              <button 
                v-if="canEdit && slot.type === 'blocked'"
                class="btn-remove-slot"
                @click="confirmRemoveSlot(slot)"
              >
                Xóa khoảng thời gian này
              </button>
            </div>
          </div>
          
          <div v-else class="no-slots">
            <p>📅 Ngày này hiện đang trống</p>
          </div>

          <!-- Form kẹt lịch (chỉ admin/employee) -->
          <div v-if="canEdit" class="block-form">
            <h4>Kẹt lịch khoảng thời gian mới</h4>
            <div class="time-inputs">
              <div class="input-group">
                <label>Từ giờ:</label>
                <input 
                  type="time" 
                  v-model="blockStartTime"
                  class="time-input"
                >
              </div>
              <div class="input-group">
                <label>Đến giờ:</label>
                <input 
                  type="time" 
                  v-model="blockEndTime"
                  class="time-input"
                >
              </div>
            </div>
            <div class="input-group">
              <label>Ghi chú (tùy chọn):</label>
              <textarea 
                v-model="blockNote"
                placeholder="Nhập lý do kẹt lịch..."
                rows="2"
              ></textarea>
            </div>
            <button 
              class="btn-add-block"
              @click="confirmBlock"
              :disabled="!blockStartTime || !blockEndTime"
            >
              ➕ Thêm khoảng thời gian kẹt lịch
            </button>
          </div>

          <div class="modal-actions">
            <button class="btn-modal-cancel" @click="closeModal">Đóng</button>
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
import { formatDate } from '../utils/formatters'

const { isLoggedIn, currentUser } = useAuth()
const { calendarData, loading, error, fetchCalendar, blockTimeSlot, unblockTimeSlot } = useCalendar()

const canEdit = computed(() => {
  return currentUser.value && (
    currentUser.value.role === 'admin' || 
    currentUser.value.role === 'employee'
  )
})

const now = new Date()
const selectedMonth = ref(now.getMonth() + 1)
const selectedYear = ref(now.getFullYear())

const yearOptions = computed(() => {
  const current = new Date().getFullYear()
  return [current, current + 1, current + 2]
})

const showModal = ref(false)
const selectedDay = ref(null)
const blockStartTime = ref('07:00')
const blockEndTime = ref('17:00')
const blockNote = ref('')

const loadCalendar = async () => {
  await fetchCalendar(selectedYear.value, selectedMonth.value)
}

const previousMonth = () => {
  if (selectedMonth.value === 1) {
    selectedMonth.value = 12
    selectedYear.value--
  } else {
    selectedMonth.value--
  }
  loadCalendar()
}

const nextMonth = () => {
  if (selectedMonth.value === 12) {
    selectedMonth.value = 1
    selectedYear.value++
  } else {
    selectedMonth.value++
  }
  loadCalendar()
}

const handleDateClick = (day) => {
  selectedDay.value = day
  blockStartTime.value = '07:00'
  blockEndTime.value = '17:00'
  blockNote.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedDay.value = null
}

const confirmBlock = async () => {
  if (!blockStartTime.value || !blockEndTime.value) {
    alert('⚠️ Vui lòng chọn thời gian bắt đầu và kết thúc')
    return
  }

  if (blockStartTime.value >= blockEndTime.value) {
    alert('⚠️ Thời gian kết thúc phải sau thời gian bắt đầu')
    return
  }

  const result = await blockTimeSlot(
    selectedDay.value.date, 
    blockStartTime.value, 
    blockEndTime.value, 
    blockNote.value
  )
  
  if (result.success) {
    alert('✅ ' + result.message)
    loadCalendar()
    blockStartTime.value = '07:00'
    blockEndTime.value = '17:00'
    blockNote.value = ''
  } else {
    alert('❌ ' + result.message)
  }
}

const confirmRemoveSlot = async (slot) => {
  if (!confirm(`Xóa khoảng thời gian từ ${slot.startTime} đến ${slot.endTime}?`)) {
    return
  }

  const result = await unblockTimeSlot(
    selectedDay.value.date,
    slot.startTime,
    slot.endTime
  )
  
  if (result.success) {
    alert('✅ ' + result.message)
    loadCalendar()
    closeModal()
  } else {
    alert('❌ ' + result.message)
  }
}

onMounted(() => {
  if (isLoggedIn.value) {
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
  background: #1D3557;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-nav:hover {
  background: #4b5563;
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

.btn-back {
  display: inline-block;
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
  overflow-y: auto;
  padding: 20px;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-large {
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  color: #e63946;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.modal-content h4 {
  color: #1D3557;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.time-slots-list {
  margin-bottom: 25px;
}

.time-slot-item {
  background: #f8f9fa;
  border-left: 4px solid #3b82f6;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.slot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.slot-time {
  font-weight: 600;
  color: #1D3557;
  font-size: 1.05rem;
}

.slot-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.slot-badge.busy {
  background: #fee2e2;
  color: #991b1b;
}

.slot-badge.blocked {
  background: #fef3c7;
  color: #92400e;
}

.slot-details {
  font-size: 0.9rem;
  color: #4b5563;
}

.slot-details p {
  margin: 5px 0;
}

.btn-remove-slot {
  margin-top: 10px;
  padding: 6px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-remove-slot:hover {
  background: #dc2626;
}

.no-slots {
  text-align: center;
  padding: 30px;
  color: #6b7280;
  font-size: 1.05rem;
}

.block-form {
  padding: 20px;
  background: #f0fdf4;
  border-radius: 8px;
  border-left: 4px solid #10b981;
  margin-bottom: 20px;
}

.time-inputs {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-weight: 500;
  color: #1D3557;
  font-size: 0.9rem;
}

.time-input,
.input-group textarea {
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
}

.input-group textarea {
  resize: vertical;
}

.time-input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: #10b981;
}

.btn-add-block {
  width: 100%;
  padding: 10px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-add-block:hover {
  background: #059669;
}

.btn-add-block:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-modal-cancel {
  padding: 10px 24px;
  border: none;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  background: #6b7280;
  color: white;
  transition: background 0.3s;
}

.btn-modal-cancel:hover {
  background: #4b5563;
}
</style>