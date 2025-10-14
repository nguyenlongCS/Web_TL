// frontend/router/index.js
// Cấu hình routing cho ứng dụng

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import CartView from '../views/CartView.vue'
import AboutView from '../views/AboutView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ContactView from '../views/ContactView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/gioithieu',
    name: 'about',
    component: AboutView
  },
  {
    path: '/sanpham',
    name: 'products',
    component: ProductView
  },
  {
    path: '/duan',
    name: 'projects',
    component: ProjectsView
  },
  {
    path: '/lienhe',
    name: 'contact',
    component: ContactView
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