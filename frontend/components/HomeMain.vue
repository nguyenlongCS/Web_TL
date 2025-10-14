<!-- frontend/components/HomeMain.vue -->
<!-- Nội dung trang chủ -->

<template>
  <!-- Slider -->
  <section class="home-slider">
    <div class="slider-images" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
      <img src="/frontend/assets/img/slide1.jpg">
      <img src="/frontend/assets/img/slide2.jpg">
      <img src="/frontend/assets/img/slide3.jpg">
    </div>
    <div class="slider-tabs">
      <button 
        v-for="(_, index) in 3" 
        :key="index"
        :class="{ active: currentSlide === index }"
        @click="currentSlide = index"
      >
        {{ index + 1 }}
      </button>
    </div>
  </section>

  <!-- About Section -->
  <section class="home-section home-about">
    <div class="container">
      <h2>Giới thiệu</h2>
      <p class="about-content">
        Chúng tôi là công ty hàng đầu trong lĩnh vực cung cấp thiết bị âm thanh chất lượng
        cao, dịch vụ tổ chức sự kiện chuyên nghiệp, và giải pháp lắp đặt dự án tối ưu. Với hơn 10 năm kinh
        nghiệm, chúng tôi cam kết mang đến trải nghiệm âm thanh tuyệt vời.
      </p>
      <a href="#" class="btn-more">Xem thêm</a>
    </div>
  </section>

  <!-- Services Section -->
  <section class="home-section home-service">
    <div class="container">
      <h2>Dịch vụ</h2>
      <div class="services-grid">
        <div class="service-item">
          <img src="/frontend/assets/img/service1.jpg">
          <h3>Cho thuê phụ kiện</h3>
          <a href="#">Chi tiết</a>
        </div>
        <div class="service-item">
          <img src="/frontend/assets/img/service2.jpg">
          <h3>Tổ chức sự kiện</h3>
          <a href="#">Chi tiết</a>
        </div>
        <div class="service-item">
          <img src="/frontend/assets/img/service3.jpg">
          <h3>Lắp đặt dự án</h3>
          <a href="#">Chi tiết</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Products Section -->
  <section class="home-section home-product">
    <div class="container">
      <h2>Sản phẩm nổi bật</h2>
      <div class="products-grid">
        <div class="product-item">
          <img src="/frontend/assets/img/product1.jpg">
          <h3>Loa chuyên nghiệp JBL</h3>
          <a href="#">Chi tiết</a>
        </div>
        <div class="product-item">
          <img src="/frontend/assets/img/product2.jpg">
          <h3>Amply Yamaha MG16XU</h3>
          <a href="#">Chi tiết</a>
        </div>
        <div class="product-item">
          <img src="/frontend/assets/img/product3.jpg">
          <h3>Micro không dây Shure</h3>
          <a href="#">Chi tiết</a>
        </div>
      </div>
      <router-link to="/sanpham" class="btn-more">Xem thêm</router-link>
    </div>
  </section>

  <!-- Projects Section -->
  <section class="home-section home-project">
    <div class="container">
      <h2>Dự án nổi bật</h2>
      <div class="projects-grid">
        <div class="project-item">
          <img src="/frontend/assets/img/project1.jpg">
          <h3>Khách sạn Grand Plaza</h3>
          <a href="#">Chi tiết</a>
        </div>
        <div class="project-item">
          <img src="/frontend/assets/img/project2.jpg">
          <h3>Trung tâm hội nghị SECC</h3>
          <a href="#">Chi tiết</a>
        </div>
        <div class="project-item">
          <img src="/frontend/assets/img/project3.jpg">
          <h3>Nhà hàng Skyline</h3>
          <a href="#">Chi tiết</a>
        </div>
      </div>
      <a href="#" class="btn-more">Xem thêm</a>
    </div>
  </section>

  <!-- User Reviews Section -->
  <section class="home-section home-reviews">
    <div class="container">
      <h2>Đánh giá của khách hàng</h2>
      <div class="reviews-grid">
        <div class="review-item">
          <div class="review-header">
            <img src="/frontend/assets/img/avatar1.jpg" class="review-avatar">
            <div>
              <p class="review-author">Anh Tuấn</p>
              <div class="review-stars">★★★★★</div>
            </div>
          </div>
          <p class="review-text">"Chất lượng âm thanh tuyệt vời, nhân viên hỗ trợ rất nhiệt tình!"</p>
        </div>

        <div class="review-item">
          <div class="review-header">
            <img src="/frontend/assets/img/avatar2.jpg" class="review-avatar">
            <div>
              <p class="review-author">Chị Hương</p>
              <div class="review-stars">★★★★★</div>
            </div>
          </div>
          <p class="review-text">"Tôi thuê thiết bị cho sự kiện công ty, mọi thứ diễn ra suôn sẻ."</p>
        </div>

        <div class="review-item">
          <div class="review-header">
            <img src="/frontend/assets/img/avatar3.jpg" class="review-avatar">
            <div>
              <p class="review-author">Nhật Minh</p>
              <div class="review-stars">★★★★</div>
            </div>
          </div>
          <p class="review-text">"Giá cả hợp lý, dịch vụ chuyên nghiệp. Rất đáng để hợp tác lâu dài."</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Quản lý slider
const currentSlide = ref(0)
let slideInterval = null

// Auto slide mỗi 5 giây
onMounted(() => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % 3
  }, 5000)
})

// Dọn dẹp interval khi component bị unmount
onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
})
</script>