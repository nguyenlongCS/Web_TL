<!-- frontend/components/home/ProjectsSection.vue -->
<!-- Section dự án trang chủ - sử dụng dữ liệu từ API (featured projects) -->

<template>
  <section class="home-section home-project">
    <div class="container">
      <h2>Dự án nổi bật</h2>
      
      <!-- Hiển thị loading -->
      <div v-if="loading" style="text-align: center; padding: 30px;">
        <p style="color: #e63946;">Đang tải dự án...</p>
      </div>
      
      <!-- Hiển thị lỗi -->
      <div v-else-if="error" style="text-align: center; padding: 30px;">
        <p style="color: #ef4444;">{{ error }}</p>
      </div>
      
      <!-- Hiển thị danh sách dự án nổi bật -->
      <div v-else class="projects-grid">
        <ProjectCard 
          v-for="project in featuredProjects" 
          :key="project._id"
          :imgSrc="project.imgSrc"
          :name="project.name"
        />
      </div>
      
      <router-link to="/duan" class="btn-more">Xem thêm</router-link>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProjectCard from '../common/ProjectCard.vue'
import { useProjects } from '../../composables/useProjects'

const { fetchFeaturedProjects } = useProjects()

// State cho featured projects
const featuredProjects = ref([])
const loading = ref(false)
const error = ref(null)

// Load featured projects khi component mount
onMounted(async () => {
  loading.value = true
  try {
    featuredProjects.value = await fetchFeaturedProjects()
  } catch (err) {
    error.value = 'Không thể tải dự án nổi bật'
  } finally {
    loading.value = false
  }
})
</script>