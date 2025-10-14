<!-- frontend/components/Header.vue -->
<!-- Component header/navbar -->

<template>
  <nav class="navbar">
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
        <a href="#" class="login-btn">Đăng nhập</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>