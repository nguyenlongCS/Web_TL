<!-- frontend/views/RegisterView.vue -->
<!-- View trang đăng ký -->

<template>
  <section class="page-section">
    <div class="container">
      <div class="auth-container">
        <div class="auth-box">
          <h2 style="color: #e63946; margin-bottom: 30px;">Đăng ký tài khoản</h2>
          
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label>Họ tên *</label>
              <input 
                v-model="formData.name"
                type="text" 
                placeholder="Nhập họ tên"
                required
              >
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input 
                v-model="formData.email"
                type="email" 
                placeholder="Nhập email"
                required
              >
            </div>

            <div class="form-group">
              <label>Số điện thoại</label>
              <input 
                v-model="formData.phone"
                type="tel" 
                placeholder="Nhập số điện thoại"
              >
            </div>

            <div class="form-group">
              <label>Mật khẩu *</label>
              <input 
                v-model="formData.password"
                type="password" 
                placeholder="Nhập mật khẩu"
                required
              >
            </div>

            <div class="form-group">
              <label>Xác nhận mật khẩu *</label>
              <input 
                v-model="formData.confirmPassword"
                type="password" 
                placeholder="Nhập lại mật khẩu"
                required
              >
            </div>

            <button type="submit" class="btn-submit">Đăng ký</button>
          </form>

          <p class="auth-switch">
            Đã có tài khoản? 
            <router-link to="/dangnhap">Đăng nhập ngay</router-link>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register } = useAuth()

// Dữ liệu form
const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

// Xử lý đăng ký
const handleRegister = () => {
  // Kiểm tra mật khẩu khớp
  if (formData.value.password !== formData.value.confirmPassword) {
    alert('Mật khẩu xác nhận không khớp')
    return
  }

  // Kiểm tra độ dài mật khẩu
  if (formData.value.password.length < 6) {
    alert('Mật khẩu phải có ít nhất 6 ký tự')
    return
  }

  // Thực hiện đăng ký
  const result = register({
    name: formData.value.name,
    email: formData.value.email,
    phone: formData.value.phone,
    password: formData.value.password
  })

  if (result.success) {
    alert(result.message)
    router.push('/')
  } else {
    alert(result.message)
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.auth-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1D3557;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #e63946;
}

.btn-submit {
  width: 100%;
  background: #e63946;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.3s;
  margin-top: 10px;
}

.btn-submit:hover {
  background: #d00000;
}

.auth-switch {
  text-align: center;
  margin-top: 20px;
  color: #6b7280;
  font-size: 14px;
}

.auth-switch a {
  color: #e63946;
  font-weight: 500;
}

.auth-switch a:hover {
  text-decoration: underline;
}
</style>