// frontend/router/index.js
// Cấu hình routing cho ứng dụng

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import CartView from '../views/CartView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/sanpham',
    name: 'products',
    component: ProductView
  },
  {
    path: '/giohang',
    name: 'cart',
    component: CartView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router