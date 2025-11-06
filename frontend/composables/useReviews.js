// frontend/composables/useReviews.js
// Composable quản lý reviews từ API

import { ref, onMounted } from 'vue'
import api from '../utils/api'

const reviews = ref([])
const loading = ref(false)
const error = ref(null)

export function useReviews() {
  // Lấy tất cả đánh giá đã duyệt từ API
  const fetchReviews = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/reviews')
      
      if (data.success) {
        reviews.value = data.reviews
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải đánh giá'
      console.error('Lỗi khi tải reviews:', err)
    } finally {
      loading.value = false
    }
  }

  // Tạo đánh giá mới
  const createReview = async (reviewData) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post('/reviews', reviewData)
      
      if (data.success) {
        return { success: true, message: data.message }
      }
      return { success: false, message: 'Không thể tạo đánh giá' }
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể gửi đánh giá'
      console.error('Lỗi khi tạo review:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Load reviews khi component mount
  onMounted(() => {
    fetchReviews()
  })

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    createReview
  }
}