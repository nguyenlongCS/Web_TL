<!-- frontend/components/cart/CartItem.vue -->
<!-- Component item giỏ hàng - thêm input chọn ngày bắt đầu thuê cho từng sản phẩm -->

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
      
      <!-- Input chọn ngày giờ bắt đầu thuê cho sản phẩm này -->
      <div class="rental-date-control">
        <label :for="'rental-start-' + index">📅 Ngày bắt đầu thuê:</label>
        <input 
          type="datetime-local" 
          :id="'rental-start-' + index"
          class="rental-date-input"
          :value="item.rentalStartDate || ''"
          :min="minDateTime"
          @input="$emit('update-rental-start', $event.target.value)"
          required
        >
      </div>
      
      <!-- Hiển thị ngày kết thúc dự kiến -->
      <div v-if="item.rentalStartDate && item.days" class="rental-end-preview">
        <span class="preview-label">⏰ Ngày kết thúc dự kiến:</span>
        <span class="preview-date">{{ calculateEndDate(item.rentalStartDate, item.days) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDateTime } from '../../utils/formatters'

defineProps({
  item: Object,
  index: Number
})

defineEmits(['increase', 'decrease', 'update-days', 'update-rental-start', 'remove'])

// Tính ngày giờ tối thiểu (hiện tại)
const minDateTime = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
})

// Tính ngày kết thúc dự kiến
const calculateEndDate = (startDate, days) => {
  if (!startDate || !days) return ''
  
  const start = new Date(startDate)
  const end = new Date(start)
  end.setDate(end.getDate() + parseInt(days))
  
  return formatDateTime(end)
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

.rental-date-input {
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  background: white;
}

.rental-date-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.rental-end-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #e8f5e9;
  border-radius: 6px;
  border-left: 3px solid #10b981;
}

.preview-label {
  color: #059669;
  font-weight: 500;
  font-size: 0.9rem;
}

.preview-date {
  color: #047857;
  font-size: 0.9rem;
  font-weight: 600;
}
</style>