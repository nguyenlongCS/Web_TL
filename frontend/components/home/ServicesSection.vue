<template>
  <section class="home-section home-service">
    <div class="container">
      <h2>Dịch vụ</h2>
      <div class="services-grid">
        <ServiceCard 
          v-for="service in services" 
          :key="service.id"
          :imgSrc="service.imgSrc"
          :title="service.title"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ServiceCard from '../common/ServiceCard.vue'

const services = ref([
  { id: 1, imgSrc: '/frontend/assets/img/service1.jpg', title: 'Cho thuê phụ kiện' },
  { id: 2, imgSrc: '/frontend/assets/img/service2.jpg', title: 'Tổ chức sự kiện' },
  { id: 3, imgSrc: '/frontend/assets/img/service3.jpg', title: 'Lắp đặt dự án' }
])
</script>