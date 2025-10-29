<!-- frontend/App.vue -->
<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
    <FloatingButtons />
  </div>
</template>

<script setup>
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import FloatingButtons from './components/layout/FloatingButtons.vue'
</script>