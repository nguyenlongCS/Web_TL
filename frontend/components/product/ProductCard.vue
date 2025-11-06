<!-- frontend/components/product/ProductCard.vue -->
<!-- Component hiển thị một sản phẩm với dữ liệu từ MongoDB -->

<template>
  <div class="product-item">
    <img :src="product.imgSrc" :alt="product.name">
    <h3>{{ product.name }}</h3>
    <div class="product-info-row">
      <div class="product-rating">
        {{ formatStars(product.rating) }}
        <span>({{ product.rating }})</span>
      </div>
      <p class="product-stock">
        Còn lại: <strong>{{ product.stock }}</strong> chiếc
      </p>
    </div>
    <p class="product-price">
      Giá thuê: <strong>{{ product.priceText }}</strong>
    </p>
    <div class="product-buttons">
      <a href="#" class="btn-detail">Chi tiết</a>
      <a href="#" class="btnaddCart" @click.prevent="$emit('add-to-cart', product)">
        Thêm vào giỏ
      </a>
    </div>
  </div>
</template>

<script setup>
import { formatStars } from '../../utils/formatters'

defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['add-to-cart'])
</script>