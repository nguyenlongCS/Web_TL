<!-- frontend/components/calendar/CalendarGrid.vue -->
<!-- Component hiển thị lịch dạng lưới với các ô ngày tô màu theo trạng thái -->

<template>
  <div class="calendar-grid">
    <!-- Header với tên các thứ -->
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
      <!-- Ô trống cho ngày đầu tháng -->
      <div 
        v-for="blank in firstDayOfWeek" 
        :key="'blank-' + blank"
        class="calendar-cell blank"
      ></div>

      <!-- Các ô ngày trong tháng -->
      <div 
        v-for="day in daysInMonth"
        :key="day.date"
        :class="['calendar-cell', getStatusClass(day.status)]"
        @click="$emit('date-click', day)"
      >
        <div class="day-number">{{ getDayNumber(day.date) }}</div>
        <div class="day-status">
          <span v-if="day.status === 'busy'">{{ day.orderIds.length }} đơn</span>
          <span v-else-if="day.status === 'blocked'">🚫</span>
        </div>
      </div>
    </div>

    <!-- Chú thích -->
    <div class="calendar-legend">
      <div class="legend-item">
        <div class="legend-color free"></div>
        <span>Rảnh</span>
      </div>
      <div class="legend-item">
        <div class="legend-color busy"></div>
        <span>Bận</span>
      </div>
      <div class="legend-item">
        <div class="legend-color blocked"></div>
        <span>Kẹt lịch</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  daysInMonth: {
    type: Array,
    required: true
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

// Tính ngày đầu tiên của tháng là thứ mấy (0 = CN, 1 = T2,...)
const firstDayOfWeek = computed(() => {
  if (props.daysInMonth.length === 0) return 0
  const firstDate = new Date(props.daysInMonth[0].date)
  return firstDate.getDay()
})

// Lấy số ngày từ date string (YYYY-MM-DD)
const getDayNumber = (dateStr) => {
  const date = new Date(dateStr)
  return date.getDate()
}

// Lấy class CSS theo trạng thái
const getStatusClass = (status) => {
  const classes = {
    'free': 'status-free',
    'busy': 'status-busy',
    'blocked': 'status-blocked'
  }
  return classes[status] || 'status-free'
}
</script>

<style scoped>
.calendar-grid {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 10px;
}

.day-name {
  text-align: center;
  font-weight: 600;
  color: #1D3557;
  padding: 10px;
  font-size: 0.9rem;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-cell {
  aspect-ratio: 1;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.calendar-cell:hover:not(.blank) {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.calendar-cell.blank {
  background: transparent;
  border: none;
  cursor: default;
}

.day-number {
  font-weight: 600;
  font-size: 1rem;
  color: #1D3557;
}

.day-status {
  font-size: 0.75rem;
  text-align: center;
  margin-top: 5px;
}

/* Trạng thái rảnh - màu xanh */
.status-free {
  background: #d1fae5;
  border-color: #10b981;
}

.status-free .day-number {
  color: #047857;
}

/* Trạng thái bận - màu đỏ */
.status-busy {
  background: #fee2e2;
  border-color: #ef4444;
}

.status-busy .day-number {
  color: #991b1b;
}

.status-busy .day-status {
  color: #dc2626;
  font-weight: 500;
}

/* Trạng thái kẹt lịch - màu vàng */
.status-blocked {
  background: #fef3c7;
  border-color: #f59e0b;
}

.status-blocked .day-number {
  color: #92400e;
}

.status-blocked .day-status {
  font-size: 1.2rem;
}

/* Chú thích */
.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
}

.legend-color.free {
  background: #d1fae5;
  border-color: #10b981;
}

.legend-color.busy {
  background: #fee2e2;
  border-color: #ef4444;
}

.legend-color.blocked {
  background: #fef3c7;
  border-color: #f59e0b;
}

.legend-item span {
  font-size: 0.9rem;
  color: #4b5563;
}
</style>