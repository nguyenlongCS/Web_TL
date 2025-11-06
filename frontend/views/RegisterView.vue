<!-- frontend/views/RegisterView.vue -->
<template>
  <section class="page-section">
    <div class="container">
      <AuthForm 
        title="Đăng ký tài khoản"
        submitText="Đăng ký"
        switchText="Đã có tài khoản?"
        switchLink="/dangnhap"
        switchLinkText="Đăng nhập ngay"
        @submit="handleRegister"
      >
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

        <!-- Loading indicator -->
        <p v-if="loading" style="text-align: center; color: #e63946;">
          Đang xử lý...
        </p>
      </AuthForm>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthForm from '../components/common/AuthForm.vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register, loading } = useAuth()

const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    alert('Mật khẩu xác nhận không khớp')
    return
  }

  if (formData.value.password.length < 6) {
    alert('Mật khẩu phải có ít nhất 6 ký tự')
    return
  }

  const result = await register({
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