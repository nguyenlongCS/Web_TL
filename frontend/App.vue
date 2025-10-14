<!-- frontend/App.vue -->
<!-- Component gốc của ứng dụng -->

<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
    <Cart />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Cart from './components/Cart.vue'
</script>