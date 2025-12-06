// frontend/utils/api.js
// Cấu hình axios instance với interceptor để tự động thêm token
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Tạo axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor: tự động thêm token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      // Đảm bảo headers.Authorization được set đúng
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor: xử lý response error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu lỗi 401, có thể token hết hạn
    if (error.response?.status === 401) {
      // Xóa token và user khỏi localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Reload trang để user phải đăng nhập lại
      if (window.location.pathname !== '/dangnhap') {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
        window.location.href = '/dangnhap'
      }
    }
    return Promise.reject(error)
  }
)

export default api