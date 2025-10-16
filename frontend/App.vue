<!-- frontend/App.vue -->
<!-- Component gốc của ứng dụng -->

<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
    <Orders />
    <Cart />
    <!-- <Mess /> -->
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Mess from './components/Mess.vue'
import Orders from './components/Orders.vue'
import Cart from './components/Cart.vue'
</script>