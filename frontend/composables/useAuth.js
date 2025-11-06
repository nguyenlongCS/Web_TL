// frontend/composables/useAuth.js
import { ref, computed } from 'vue'
import api from '../utils/api'

const currentUser = ref(null)
const token = ref(localStorage.getItem('token') || null)
const loading = ref(false)

export function useAuth() {
  const isLoggedIn = computed(() => currentUser.value !== null)
  const userName = computed(() => currentUser.value?.name || '')

  // Load user từ localStorage khi khởi động
  const loadUser = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser && token.value) {
      try {
        currentUser.value = JSON.parse(savedUser)
      } catch (e) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
  }

  // Đăng ký
  const register = async (userData) => {
    loading.value = true
    try {
      const { data } = await api.post('/auth/register', userData)
      
      if (data.success) {
        currentUser.value = data.user
        token.value = data.token
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        loading.value = false
        return { success: true, message: data.message }
      }
    } catch (error) {
      loading.value = false
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng ký thất bại' 
      }
    }
  }

  // Đăng nhập
  const login = async (email, password) => {
    loading.value = true
    try {
      const { data } = await api.post('/auth/login', { email, password })
      
      if (data.success) {
        currentUser.value = data.user
        token.value = data.token
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        loading.value = false
        return { success: true, message: data.message }
      }
    } catch (error) {
      loading.value = false
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng nhập thất bại' 
      }
    }
  }

  // Đăng xuất
  const logout = () => {
    loading.value = true
    currentUser.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    loading.value = false
  }

  // Load user khi khởi động
  loadUser()

  return {
    currentUser,
    isLoggedIn,
    userName,
    register,
    login,
    logout,
    loading
  }
}