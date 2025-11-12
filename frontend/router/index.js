// frontend/router/index.js
// Cấu hình routing cho ứng dụng

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import CartView from '../views/CartView.vue'
import AboutView from '../views/AboutView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ContactView from '../views/ContactView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import OrdersView from '../views/OrdersView.vue'
import AddProductView from '../views/AddProductView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'

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
    path: '/sanpham/:id',
    name: 'product-detail',
    component: ProductDetailView
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
    path: '/donhang',
    name: 'orders',
    component: OrdersView
  },
  {
    path: '/giohang',
    name: 'cart',
    component: CartView
  },
  {
    path: '/dangnhap',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dangky',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/sanpham/them',
    name: 'add-product',
    component: AddProductView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router