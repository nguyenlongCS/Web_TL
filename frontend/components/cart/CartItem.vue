<!-- frontend/components/cart/CartItem.vue -->
<!-- Component item giỏ hàng - chọn ngày và giờ bắt đầu thuê (mặc định 7:00 sáng) -->

<template>
  <div class="cart-item">
    <img :src="item.imgSrc" :alt="item.name">
    <div class="cart-info">
      <h3>{{ item.name }}</h3>
      <p>{{ item.priceText }}</p>
      <div class="cart-controls">
        <div class="quantity-control">
          <button class="qty-btn minus" @click="$emit('decrease')">−</button>
          <span>{{ item.quantity }}</span>
          <button class="qty-btn plus" @click="$emit('increase')">+</button>
        </div>
        <div class="days-control">
          <label :for="'days-' + index">Số ngày:</label>
          <input 
            type="number" 
            :id="'days-' + index"
            class="days-input"
            min="1"
            :value="item.days"
            @input="$emit('update-days', $event.target.value)"
          >
        </div>
        <button class="btn-remove" @click="$emit('remove')">Xóa</button>
      </div>
      
      <!-- Input chọn ngày và giờ bắt đầu thuê -->
      <div class="rental-date-control">
        <label :for="'rental-start-' + index">📅 Ngày bắt đầu thuê:</label>
        <div class="datetime-inputs">
          <input 
            type="date" 
            :id="'rental-start-' + index"
            class="rental-date-input"
            :value="item.rentalStartDate || ''"
            :min="minDate"
            @input="handleDateChange"
            required
          >
          <input 
            type="time" 
            :id="'rental-time-' + index"
            class="rental-time-input"
            :value="item.rentalStartTime || '07:00'"
            @input="handleTimeChange"
            required
          >
        </div>
      </div>
      
      <!-- Hiển thị ngày giờ bắt đầu và kết thúc dự kiến theo định dạng yêu cầu -->
      <div v-if="item.rentalStartDate && item.days" class="rental-preview">
        <div class="preview-item">
          <span class="preview-label">🕐 Ngày bắt đầu thuê:</span>
          <span class="preview-value">{{ formatFullDateTime(item.rentalStartDate, item.rentalStartTime || '07:00') }}</span>
        </div>
        <div class="preview-item">
          <span class="preview-label">⏰ Ngày kết thúc dự kiến:</span>
          <span class="preview-value">{{ calculateEndDateTime(item.rentalStartDate, item.rentalStartTime || '07:00', item.days) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDateForInput } from '../../utils/formatters'

const props = defineProps({
  item: Object,
  index: Number
})

const emit = defineEmits(['increase', 'decrease', 'update-days', 'update-rental-start', 'update-rental-time', 'remove'])

// Ngày tối thiểu là ngày hôm nay
const minDate = computed(() => {
  return formatDateForInput(new Date())
})

// Xử lý khi thay đổi ngày
const handleDateChange = (event) => {
  emit('update-rental-start', event.target.value)
}

// Xử lý khi thay đổi giờ
const handleTimeChange = (event) => {
  emit('update-rental-time', event.target.value)
}

// Format ngày giờ đầy đủ: "ngày 30 tháng 12 năm 2025 - 13:00 Chiều"
const formatFullDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return ''
  
  // Parse date (yyyy-mm-dd)
  const [year, month, day] = dateStr.split('-')
  
  // Parse time (HH:mm)
  const [hours, minutes] = timeStr.split(':')
  const hour = parseInt(hours)
  
  // Xác định buổi trong ngày
  let period = ''
  if (hour >= 5 && hour < 11) {
    period = 'Sáng'
  } else if (hour >= 11 && hour < 13) {
    period = 'Trưa'
  } else if (hour >= 13 && hour < 18) {
    period = 'Chiều'
  } else {
    period = 'Tối'
  }
  
  return `ngày ${parseInt(day)} tháng ${parseInt(month)} năm ${year} - ${hours}:${minutes} ${period}`
}

// Tính ngày giờ kết thúc dự kiến
const calculateEndDateTime = (dateStr, timeStr, days) => {
  if (!dateStr || !timeStr || !days) return ''
  
  // Tạo datetime từ date và time
  const startDateTime = new Date(dateStr + 'T' + timeStr + ':00')
  
  // Cộng thêm số ngày
  const endDateTime = new Date(startDateTime)
  endDateTime.setDate(endDateTime.getDate() + parseInt(days))
  
  // Format lại
  const year = endDateTime.getFullYear()
  const month = endDateTime.getMonth() + 1
  const day = endDateTime.getDate()
  const hours = String(endDateTime.getHours()).padStart(2, '0')
  const minutes = String(endDateTime.getMinutes()).padStart(2, '0')
  const hour = endDateTime.getHours()
  
  // Xác định buổi trong ngày
  let period = ''
  if (hour >= 5 && hour < 11) {
    period = 'Sáng'
  } else if (hour >= 11 && hour < 13) {
    period = 'Trưa'
  } else if (hour >= 13 && hour < 18) {
    period = 'Chiều'
  } else {
    period = 'Tối'
  }
  
  return `ngày ${day} tháng ${month} năm ${year} - ${hours}:${minutes} ${period}`
}
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
}

.cart-item img {
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.cart-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-info h3 {
  color: #e63946;
  margin: 0;
}

.cart-info > p {
  margin: 0;
  color: #6b7280;
}

.cart-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.quantity-control,
.days-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background-color: #1D3557;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s;
}

.qty-btn:hover {
  background-color: #457b9d;
}

.days-control label {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.days-input {
  width: 60px;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
}

.btn-remove {
  background: #e63946;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background 0.3s;
  margin-left: auto;
}

.btn-remove:hover {
  background: #d00000;
}

.rental-date-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

.rental-date-control label {
  color: #1D3557;
  font-weight: 500;
  font-size: 0.95rem;
}

.datetime-inputs {
  display: flex;
  gap: 10px;
}

.rental-date-input,
.rental-time-input {
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  background: white;
}

.rental-date-input {
  flex: 2;
}

.rental-time-input {
  flex: 1;
}

.rental-date-input:focus,
.rental-time-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.rental-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #e8f5e9;
  border-radius: 6px;
  border-left: 3px solid #10b981;
}

.preview-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-label {
  color: #059669;
  font-weight: 500;
  font-size: 0.85rem;
}

.preview-value {
  color: #047857;
  font-size: 0.95rem;
  font-weight: 600;
}
</style>