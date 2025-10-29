<template>
  <section class="home-section home-project">
    <div class="container">
      <h2>Dự án nổi bật</h2>
      <div class="projects-grid">
        <ProjectCard 
          v-for="project in projects" 
          :key="project.id"
          :imgSrc="project.imgSrc"
          :name="project.name"
        />
      </div>
      <router-link to="/duan" class="btn-more">Xem thêm</router-link>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ProjectCard from '../common/ProjectCard.vue'

const projects = ref([
  { id: 1, imgSrc: '/frontend/assets/img/project1.jpg', name: 'Khách sạn Grand Plaza' },
  { id: 2, imgSrc: '/frontend/assets/img/project2.jpg', name: 'Trung tâm hội nghị SECC' },
  { id: 3, imgSrc: '/frontend/assets/img/project3.jpg', name: 'Nhà hàng Skyline' }
])
</script>