// frontend/composables/useAuth.js
// Composable quản lý authentication - reload cart khi đổi user
import { ref, computed } from 'vue'
import api from '../utils/api'
import { useCart } from './useCart'

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
        
        // Reload giỏ hàng cho user mới
        const { reloadCart } = useCart()
        reloadCart()
        
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
        
        // Reload giỏ hàng cho user đã đăng nhập
        const { reloadCart } = useCart()
        reloadCart()
        
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
    
    // Reload giỏ hàng cho guest
    const { reloadCart } = useCart()
    reloadCart()
    
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