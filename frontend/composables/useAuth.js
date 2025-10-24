import { ref, computed } from 'vue'

const currentUser = ref(null)
const users = ref([])
const loading = ref(false)

export function useAuth() {
  const isLoggedIn = computed(() => currentUser.value !== null)
  const userName = computed(() => currentUser.value?.name || '')

  const register = (userData) => {
    loading.value = true
    const exists = users.value.find(u => u.email === userData.email)
    if (exists) {
      loading.value = false
      return { success: false, message: 'Email đã được sử dụng' }
    }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || ''
    }
    users.value.push(newUser)

    currentUser.value = { ...newUser }
    delete currentUser.value.password

    loading.value = false
    return { success: true, message: 'Đăng ký thành công' }
  }

  const login = (email, password) => {
    loading.value = true
    const user = users.value.find(
      u => u.email === email && u.password === password
    )

    if (!user) {
      loading.value = false
      return { success: false, message: 'Email hoặc mật khẩu không đúng' }
    }

    currentUser.value = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
    }

    loading.value = false
    return { success: true, message: 'Đăng nhập thành công' }
  }

  const logout = () => {
    loading.value = true
    currentUser.value = null
    loading.value = false
  }

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