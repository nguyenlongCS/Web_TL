<!-- frontend/views/LoginView.vue -->
<template>
  <section class="page-section">
    <div class="container">
      <AuthForm 
        title="Đăng nhập"
        submitText="Đăng nhập"
        switchText="Chưa có tài khoản?"
        switchLink="/dangky"
        switchLinkText="Đăng ký ngay"
        @submit="handleLogin"
      >
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
          <label>Mật khẩu *</label>
          <input 
            v-model="formData.password"
            type="password" 
            placeholder="Nhập mật khẩu"
            required
          >
        </div>

        <!-- Loading indicator -->
        <p v-if="loading" style="text-align: center; color: #e63946;">
          Đang đăng nhập...
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
const { login, loading } = useAuth()

const formData = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  const result = await login(formData.value.email, formData.value.password)
  
  if (result.success) {
    alert(result.message)
    router.push('/')
  } else {
    alert(result.message)
  }
}
</script>