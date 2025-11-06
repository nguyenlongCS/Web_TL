// frontend/composables/useProjects.js
// Composable quản lý projects từ API

import { ref, onMounted } from 'vue'
import api from '../utils/api'

const projects = ref([])
const loading = ref(false)
const error = ref(null)

export function useProjects() {
  // Lấy tất cả dự án từ API
  const fetchProjects = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/projects')
      
      if (data.success) {
        projects.value = data.projects
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải dự án'
      console.error('Lỗi khi tải projects:', err)
    } finally {
      loading.value = false
    }
  }

  // Lấy dự án nổi bật từ API
  const fetchFeaturedProjects = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/projects/featured')
      
      if (data.success) {
        return data.projects
      }
      return []
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải dự án nổi bật'
      console.error('Lỗi khi tải featured projects:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Lấy chi tiết một dự án
  const fetchProjectById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get(`/projects/${id}`)
      
      if (data.success) {
        return data.project
      }
      return null
    } catch (err) {
      error.value = err.response?.data?.message || 'Không tìm thấy dự án'
      console.error('Lỗi khi tải project detail:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Load projects khi component mount
  onMounted(() => {
    fetchProjects()
  })

  return {
    projects,
    loading,
    error,
    fetchProjects,
    fetchFeaturedProjects,
    fetchProjectById
  }
}