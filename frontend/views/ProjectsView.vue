<template>
  <section class="page-section">
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
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ProjectCard from '../components/common/ProjectCard.vue'

const projects = ref([
  { id: 1, name: 'Khách sạn Grand Plaza', imgSrc: '/frontend/assets/img/project1.jpg' },
  { id: 2, name: 'Trung tâm hội nghị SECC', imgSrc: '/frontend/assets/img/project2.jpg' },
  { id: 3, name: 'Nhà hàng Skyline', imgSrc: '/frontend/assets/img/project3.jpg' },
  { id: 4, name: 'Rạp chiếu phim Galaxy', imgSrc: '/frontend/assets/img/project4.jpg' },
  { id: 5, name: 'Hội trường RMIT University', imgSrc: '/frontend/assets/img/project5.jpg' },
  { id: 6, name: 'Trung tâm tiệc cưới Diamond', imgSrc: '/frontend/assets/img/project6.jpg' },
  { id: 7, name: 'Trung tâm thương mại Vincom', imgSrc: '/frontend/assets/img/project7.jpg' },
  { id: 8, name: 'Club Premium', imgSrc: '/frontend/assets/img/project8.jpg' },
  { id: 9, name: 'Nhà thờ Tân Định', imgSrc: '/frontend/assets/img/project9.jpg' },
  { id: 10, name: 'Sân vận động Thống Nhất', imgSrc: '/frontend/assets/img/project10.jpg' },
  { id: 11, name: 'Chuỗi cà phê Highlands', imgSrc: '/frontend/assets/img/project11.jpg' },
  { id: 12, name: 'Tòa nhà văn phòng Bitexco', imgSrc: '/frontend/assets/img/project12.jpg' }
])
</script>