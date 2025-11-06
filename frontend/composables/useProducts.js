// frontend/composables/useProducts.js
// Composable quản lý products từ API thay vì mock data

import { ref, onMounted } from 'vue'
import api from '../utils/api'

const products = ref([])
const loading = ref(false)
const error = ref(null)

export function useProducts() {
  // Lấy tất cả sản phẩm từ API
  const fetchProducts = async (filters = {}) => {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      
      // Thêm filters vào params nếu có
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category)
      }
      if (filters.sort) {
        params.append('sort', filters.sort)
      }
      if (filters.rating) {
        params.append('rating', filters.rating)
      }

      const { data } = await api.get(`/products?${params.toString()}`)
      
      if (data.success) {
        products.value = data.products
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải sản phẩm'
      console.error('Lỗi khi tải products:', err)
    } finally {
      loading.value = false
    }
  }

  // Lấy sản phẩm nổi bật từ API
  const fetchFeaturedProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/products/featured')
      
      if (data.success) {
        return data.products
      }
      return []
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải sản phẩm nổi bật'
      console.error('Lỗi khi tải featured products:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Lấy chi tiết một sản phẩm
  const fetchProductById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get(`/products/${id}`)
      
      if (data.success) {
        return data.product
      }
      return null
    } catch (err) {
      error.value = err.response?.data?.message || 'Không tìm thấy sản phẩm'
      console.error('Lỗi khi tải product detail:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Load products khi component mount
  onMounted(() => {
    fetchProducts()
  })

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchFeaturedProducts,
    fetchProductById
  }
}