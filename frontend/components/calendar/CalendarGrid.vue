<!-- frontend/components/calendar/CalendarGrid.vue -->
<!-- Component hiển thị lưới lịch theo tháng - xử lý an toàn timeSlots -->

<template>
  <div class="calendar-grid">
    <!-- Header ngày trong tuần -->
    <div class="calendar-header">
      <div class="day-name">CN</div>
      <div class="day-name">T2</div>
      <div class="day-name">T3</div>
      <div class="day-name">T4</div>
      <div class="day-name">T5</div>
      <div class="day-name">T6</div>
      <div class="day-name">T7</div>
    </div>

    <!-- Grid các ngày -->
    <div class="calendar-body">
      <!-- Ô trống cho những ngày trước ngày đầu tháng -->
      <div 
        v-for="blank in leadingBlanks" 
        :key="'blank-' + blank" 
        class="calendar-day blank"
      ></div>

      <!-- Các ngày trong tháng -->
      <div
        v-for="day in daysInMonth"
        :key="day.date"
        class="calendar-day"
        :class="getDayClass(day)"
        @click="$emit('date-click', day)"
      >
        <div class="day-number">{{ getDayNumber(day.date) }}</div>
        
        <!-- Hiển thị số lượng time slots nếu có -->
        <div v-if="hasTimeSlots(day)" class="day-status">
          <span class="slot-count">{{ getTimeSlotCount(day) }} khoảng</span>
        </div>
        
        <!-- Badge trạng thái -->
        <div v-if="day.status === 'busy'" class="status-badge busy">
          Bận
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  daysInMonth: {
    type: Array,
    required: true,
    default: () => []
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  }
})

defineEmits(['date-click'])

// Tính số ô trống đầu tháng
const leadingBlanks = computed(() => {
  if (!props.daysInMonth || props.daysInMonth.length === 0) return 0
  
  const firstDay = new Date(props.year, props.month - 1, 1)
  return firstDay.getDay() // 0 = CN, 1 = T2, ...
})

// Lấy số ngày từ date string (YYYY-MM-DD)
const getDayNumber = (dateStr) => {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  return parseInt(parts[2], 10)
}

// Kiểm tra có time slots không (AN TOÀN)
const hasTimeSlots = (day) => {
  return day && 
         day.timeSlots && 
         Array.isArray(day.timeSlots) && 
         day.timeSlots.length > 0
}

// Đếm số time slots (AN TOÀN)
const getTimeSlotCount = (day) => {
  if (!hasTimeSlots(day)) return 0
  return day.timeSlots.length
}

// Xác định class cho ngày
const getDayClass = (day) => {
  const classes = []
  
  if (day.status === 'busy') {
    classes.push('has-slots')
  }
  
  // Kiểm tra ngày hiện tại
  const today = new Date()
  const dayDate = new Date(day.date)
  
  if (
    dayDate.getDate() === today.getDate() &&
    dayDate.getMonth() === today.getMonth() &&
    dayDate.getFullYear() === today.getFullYear()
  ) {
    classes.push('today')
  }
  
  // Kiểm tra ngày trong quá khứ
  if (dayDate < today && !classes.includes('today')) {
    classes.push('past')
  }
  
  return classes
}
</script>

<style scoped>
.calendar-grid {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #1D3557;
  color: white;
}

.day-name {
  padding: 15px;
  text-align: center;
  font-weight: 600;
  font-size: 0.95rem;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e5e7eb;
}

.calendar-day {
  background: white;
  min-height: 100px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  display: flex;
  flex-direction: column;
}

.calendar-day:hover:not(.blank) {
  background: #f9fafb;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.calendar-day.blank {
  background: #f3f4f6;
  cursor: default;
}

.calendar-day.today {
  background: #fff7ed;
  border: 2px solid #f59e0b;
}

.calendar-day.past {
  opacity: 0.6;
}

.calendar-day.has-slots {
  background: #fef3c7;
}

.calendar-day.has-slots:hover {
  background: #fde68a;
}

.day-number {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1D3557;
  margin-bottom: 5px;
}

.day-status {
  margin-top: auto;
  padding-top: 8px;
}

.slot-count {
  display: inline-block;
  font-size: 0.8rem;
  color: #92400e;
  background: #fde68a;
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.status-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.busy {
  background: #fee2e2;
  color: #991b1b;
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-day {
    min-height: 80px;
    padding: 8px;
  }
  
  .day-number {
    font-size: 1rem;
  }
  
  .day-name {
    padding: 10px;
    font-size: 0.85rem;
  }
  
  .slot-count {
    font-size: 0.7rem;
    padding: 2px 6px;
  }
}
</style>