<!-- frontend/views/HomeView.vue -->
<!-- Trang chủ - sử dụng dữ liệu từ API -->

<template>
  <HomeSlider />
  <AboutSection />
  <ServicesSection />
  <ProductsSection :products="featuredProducts" :loading="productsLoading" />
  <ProjectsSection />
  <ReviewsSection />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HomeSlider from '../components/home/HomeSlider.vue'
import AboutSection from '../components/home/AboutSection.vue'
import ServicesSection from '../components/home/ServicesSection.vue'
import ProductsSection from '../components/home/ProductsSection.vue'
import ProjectsSection from '../components/home/ProjectsSection.vue'
import ReviewsSection from '../components/home/ReviewsSection.vue'
import { useProducts } from '../composables/useProducts'

const { fetchFeaturedProducts } = useProducts()

// State cho featured products
const featuredProducts = ref([])
const productsLoading = ref(false)

// Load featured products khi component mount
onMounted(async () => {
  productsLoading.value = true
  featuredProducts.value = await fetchFeaturedProducts()
  productsLoading.value = false
})
</script>