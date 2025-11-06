// frontend/composables/useServices.js
// Composable quản lý services từ API

import { ref, onMounted } from 'vue'
import api from '../utils/api'

const services = ref([])
const loading = ref(false)
const error = ref(null)

export function useServices() {
  // Lấy tất cả dịch vụ từ API
  const fetchServices = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/services')
      
      if (data.success) {
        services.value = data.services
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải dịch vụ'
      console.error('Lỗi khi tải services:', err)
    } finally {
      loading.value = false
    }
  }

  // Lấy chi tiết một dịch vụ
  const fetchServiceById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get(`/services/${id}`)
      
      if (data.success) {
        return data.service
      }
      return null
    } catch (err) {
      error.value = err.response?.data?.message || 'Không tìm thấy dịch vụ'
      console.error('Lỗi khi tải service detail:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Load services khi component mount
  onMounted(() => {
    fetchServices()
  })

  return {
    services,
    loading,
    error,
    fetchServices,
    fetchServiceById
  }
}