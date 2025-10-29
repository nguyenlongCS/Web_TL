<template>
  <section class="home-section home-reviews">
    <div class="container">
      <h2>Đánh giá của khách hàng</h2>
      <div class="reviews-grid">
        <ReviewCard 
          v-for="review in reviews" 
          :key="review.id"
          :avatar="review.avatar"
          :author="review.author"
          :stars="review.stars"
          :text="review.text"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ReviewCard from '../common/ReviewCard.vue'

const reviews = ref([
  {
    id: 1,
    avatar: '/frontend/assets/img/avatar1.jpg',
    author: 'Anh Tuấn',
    stars: '★★★★★',
    text: '"Chất lượng âm thanh tuyệt vời, nhân viên hỗ trợ rất nhiệt tình!"'
  },
  {
    id: 2,
    avatar: '/frontend/assets/img/avatar2.jpg',
    author: 'Chị Hương',
    stars: '★★★★★',
    text: '"Tôi thuê thiết bị cho sự kiện công ty, mọi thứ diễn ra suôn sẻ."'
  },
  {
    id: 3,
    avatar: '/frontend/assets/img/avatar3.jpg',
    author: 'Nhật Minh',
    stars: '★★★★',
    text: '"Giá cả hợp lý, dịch vụ chuyên nghiệp. Rất đáng để hợp tác lâu dài."'
  }
])
</script>
