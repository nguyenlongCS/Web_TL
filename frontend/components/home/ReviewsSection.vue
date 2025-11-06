<!-- frontend/components/home/ReviewsSection.vue -->
<!-- Section đánh giá trang chủ - sử dụng dữ liệu từ API -->

<template>
  <section class="home-section home-reviews">
    <div class="container">
      <h2>Đánh giá của khách hàng</h2>
      
      <!-- Hiển thị loading -->
      <div v-if="loading" style="text-align: center; padding: 30px;">
        <p style="color: #e63946;">Đang tải đánh giá...</p>
      </div>
      
      <!-- Hiển thị lỗi -->
      <div v-else-if="error" style="text-align: center; padding: 30px;">
        <p style="color: #ef4444;">{{ error }}</p>
      </div>
      
      <!-- Hiển thị danh sách đánh giá -->
      <div v-else class="reviews-grid">
        <ReviewCard 
          v-for="review in reviews" 
          :key="review._id"
          :avatar="review.avatar"
          :author="review.author"
          :stars="review.starsText"
          :text="review.text"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import ReviewCard from '../common/ReviewCard.vue'
import { useReviews } from '../../composables/useReviews'

// Sử dụng composable để lấy dữ liệu từ API
const { reviews, loading, error } = useReviews()
</script>