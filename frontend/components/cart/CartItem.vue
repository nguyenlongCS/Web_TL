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
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: Object,
  index: Number
})

defineEmits(['increase', 'decrease', 'update-days', 'remove'])
</script>
