<template>
  <nav class="navbar">
    <div v-if="isLoggedIn" class="user-info-left">
      <img src="/frontend/assets/icons/user-avatar.png" alt="Avatar" class="user-avatar">
      <span class="user-name-left">{{ userName }}</span>
    </div>

    <div class="container">
      <ul class="nav-menu">
        <li><router-link to="/">Trang chủ</router-link></li>
        <li><router-link to="/gioithieu">Giới thiệu</router-link></li>
        <li>
          <router-link to="/sanpham">Sản phẩm</router-link>
          <ul class="dropdown">
            <li><a href="#">Loa</a></li>
            <li><a href="#">Amply</a></li>
            <li><a href="#">Phụ kiện âm thanh</a></li>
            <li><a href="#">Khác</a></li>
          </ul>
        </li>
        <li><router-link to="/duan">Dự án</router-link></li>
        <li><router-link to="/lienhe">Liên hệ</router-link></li>
      </ul>
      <div class="nav-right">
        <div class="search-bar">
          <input type="text" placeholder="Tìm kiếm...">
        </div>
        
        <router-link v-if="!isLoggedIn" to="/dangnhap" class="login-btn">
          Đăng nhập
        </router-link>
        
        <button v-else @click="handleLogout" class="logout-btn">
          Đăng xuất
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const { isLoggedIn, userName, logout } = useAuth()

const handleLogout = () => {
  logout()
  alert('Đã đăng xuất thành công')
  router.push('/')
}
</script>

<style scoped>
.user-info-left {
  position: absolute;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}

.user-name-left {
  color: white;
  font-weight: 500;
  font-size: 14px;
}

.logout-btn {
  background-color: #1D3557;
  padding: 8px 20px;
  border-radius: 20px;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background-color: #4b5563;
}
</style>