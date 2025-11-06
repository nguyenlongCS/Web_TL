<!-- frontend/components/home/ServicesSection.vue -->
<!-- Section dịch vụ trang chủ - sử dụng dữ liệu từ API -->

<template>
  <section class="home-section home-service">
    <div class="container">
      <h2>Dịch vụ</h2>
      
      <!-- Hiển thị loading -->
      <div v-if="loading" style="text-align: center; padding: 30px;">
        <p style="color: #e63946;">Đang tải dịch vụ...</p>
      </div>
      
      <!-- Hiển thị lỗi -->
      <div v-else-if="error" style="text-align: center; padding: 30px;">
        <p style="color: #ef4444;">{{ error }}</p>
      </div>
      
      <!-- Hiển thị danh sách dịch vụ -->
      <div v-else class="services-grid">
        <ServiceCard 
          v-for="service in services" 
          :key="service._id"
          :imgSrc="service.imgSrc"
          :title="service.title"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import ServiceCard from '../common/ServiceCard.vue'
import { useServices } from '../../composables/useServices'

// Sử dụng composable để lấy dữ liệu từ API
const { services, loading, error } = useServices()
</script>