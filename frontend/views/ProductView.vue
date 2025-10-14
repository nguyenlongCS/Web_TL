<!-- frontend/views/ProductView.vue -->
<!-- View trang sản phẩm -->

<template>
  <section class="page-section">
    <div class="container">
      <h2>Sản phẩm</h2>
      
      <!-- Bộ lọc và sắp xếp -->
      <div class="filter-bar">
        <div class="filter-group">
          <label for="filter-category">Loại sản phẩm:</label>
          <select id="filter-category" v-model="categoryFilter">
            <option value="all">Tất cả</option>
            <option value="loa">Loa</option>
            <option value="amply">Amply</option>
            <option value="phu-kien">Phụ kiện âm thanh</option>
            <option value="khac">Khác</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="sort-price">Sắp xếp theo giá:</label>
          <select id="sort-price" v-model="priceSort">
            <option value="none">Mặc định</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="sort-rating">Sắp xếp theo đánh giá:</label>
          <select id="sort-rating" v-model="ratingSort">
            <option value="none">Mặc định</option>
            <option value="high">Cao đến thấp</option>
            <option value="low">Thấp đến cao</option>
          </select>
        </div>
      </div>

      <!-- Danh sách sản phẩm -->
      <div class="products-grid">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="product-item"
        >
          <img :src="product.imgSrc">
          <h3>{{ product.name }}</h3>
          <div class="product-info-row">
            <div class="product-rating">
              {{ getStars(product.rating) }} 
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
            <a href="#" class="btn-rent" @click.prevent="handleRent(product)">Đặt thuê</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useProducts } from '../composables/useProducts'
import { useCart } from '../composables/useCart'

// Lấy danh sách sản phẩm và các bộ lọc
const { 
  categoryFilter, 
  priceSort, 
  ratingSort, 
  filteredProducts 
} = useProducts()

// Lấy hàm thêm vào giỏ
const { addToCart } = useCart()

// Chuyển đổi rating thành dấu sao
const getStars = (rating) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  let stars = '★'.repeat(fullStars)
  if (hasHalfStar) stars += '☆'
  while (stars.length < 5) stars += '☆'
  return stars
}

// Xử lý khi nhấn đặt thuê
const handleRent = (product) => {
  addToCart(product)
  alert(`✅ Đã thêm "${product.name}" vào giỏ hàng!`)
}
</script>