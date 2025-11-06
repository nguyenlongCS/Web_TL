<!-- frontend/views/ProjectsView.vue -->
<!-- Trang dự án - sử dụng dữ liệu từ API -->

<template>
  <section class="page-section">
    <div class="container">
      <h2>Dự án nổi bật</h2>
      
      <!-- Hiển thị loading -->
      <div v-if="loading" style="text-align: center; padding: 50px;">
        <p style="color: #e63946;">Đang tải dự án...</p>
      </div>
      
      <!-- Hiển thị lỗi -->
      <div v-else-if="error" style="text-align: center; padding: 50px;">
        <p style="color: #ef4444;">{{ error }}</p>
      </div>
      
      <!-- Hiển thị danh sách dự án -->
      <div v-else class="projects-grid">
        <ProjectCard 
          v-for="project in projects" 
          :key="project._id"
          :imgSrc="project.imgSrc"
          :name="project.name"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import ProjectCard from '../components/common/ProjectCard.vue'
import { useProjects } from '../composables/useProjects'

// Sử dụng composable để lấy dữ liệu từ API
const { projects, loading, error } = useProjects()
</script>