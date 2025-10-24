<template>
  <HomeSlider />
  <AboutSection />
  <ServicesSection />
  <ProductsSection :products="featuredProducts" />
  <ProjectsSection />
  <ReviewsSection />
</template>

<script setup>
import HomeSlider from '../components/home/HomeSlider.vue'
import AboutSection from '../components/home/AboutSection.vue'
import ServicesSection from '../components/home/ServicesSection.vue'
import ProductsSection from '../components/home/ProductsSection.vue'
import ProjectsSection from '../components/home/ProjectsSection.vue'
import ReviewsSection from '../components/home/ReviewsSection.vue'
import { useProducts } from '../composables/useProducts'

const { featuredProducts } = useProducts()
</script>