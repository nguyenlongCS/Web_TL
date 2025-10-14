// frontend/composables/useAuth.js
// Quản lý logic xác thực người dùng

import { ref, computed } from 'vue'

// State lưu thông tin user (dùng memory, không dùng localStorage)
const currentUser = ref(null)
const users = ref([])

export function useAuth() {
  // Kiểm tra đã đăng nhập chưa
  const isLoggedIn = computed(() => currentUser.value !== null)
  
  // Lấy tên user hiện tại
  const userName = computed(() => currentUser.value?.name || '')

  // Đăng ký tài khoản mới
  const register = (userData) => {
    // Kiểm tra email đã tồn tại chưa
    const exists = users.value.find(u => u.email === userData.email)
    if (exists) {
      return { success: false, message: 'Email đã được sử dụng' }
    }

    // Thêm user mới
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || ''
    }
    users.value.push(newUser)

    // Tự động đăng nhập sau khi đăng ký
    currentUser.value = { ...newUser }
    delete currentUser.value.password // Không lưu password trong session

    return { success: true, message: 'Đăng ký thành công' }
  }

  // Đăng nhập
  const login = (email, password) => {
    // Tìm user theo email và password
    const user = users.value.find(
      u => u.email === email && u.password === password
    )

    if (!user) {
      return { success: false, message: 'Email hoặc mật khẩu không đúng' }
    }

    // Lưu thông tin user (không lưu password)
    currentUser.value = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
    }

    return { success: true, message: 'Đăng nhập thành công' }
  }

  // Đăng xuất
  const logout = () => {
    currentUser.value = null
  }

  return {
    currentUser,
    isLoggedIn,
    userName,
    register,
    login,
    logout
  }
}