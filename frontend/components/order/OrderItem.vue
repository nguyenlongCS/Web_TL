<template>
  <div class="order-item">
    <img :src="item.imgSrc" :alt="item.name">
    <div class="order-item-info">
      <h4>{{ item.name }}</h4>
      <p>{{ item.priceText }}</p>
      <p>Số lượng: {{ item.quantity }} | Số ngày: {{ item.days }}</p>
    </div>
    <div class="order-item-total">
      {{ formatPrice(item.price * item.quantity * item.days) }}
    </div>
  </div>
</template>

<script setup>
import { formatPrice } from '../../utils/formatters'

defineProps({
  item: Object
})
</script>