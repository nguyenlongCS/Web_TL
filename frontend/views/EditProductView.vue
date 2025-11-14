<!-- frontend/views/EditProductView.vue -->
<!-- Trang sửa sản phẩm - chỉ dành cho employee và admin -->

<template>
  <section class="page-section">
    <div class="container">
      <h2>Sửa sản phẩm</h2>

      <!-- Kiểm tra quyền truy cập -->
      <div v-if="!canAccess" style="text-align: center; padding: 50px;">
        <p style="color: #ef4444; font-size: 1.2rem;">
          ⚠️ Bạn không có quyền truy cập trang này
        </p>
        <router-link to="/" class="btn-back">Quay về trang chủ</router-link>
      </div>

      <!-- Hiển thị loading -->
      <div v-else-if="loading" style="text-align: center; padding: 50px;">
        <p style="color: #e63946;">Đang tải sản phẩm...</p>
      </div>

      <!-- Form sửa sản phẩm -->
      <div v-else-if="product" class="edit-product-container">
        <form @submit.prevent="handleSubmit" class="product-form">
          
          <!-- 1. Ảnh xem trước sản phẩm (bắt buộc) -->
          <div class="form-group">
            <label>Ảnh xem trước sản phẩm *</label>
            <p class="help-text">Ảnh đại diện hiển thị cho sản phẩm (bắt buộc)</p>
            <div class="image-upload">
              <input 
                type="file" 
                id="product-image"
                accept="image/*"
                @change="handlePreviewImageChange"
              >
              <label for="product-image" class="image-label">
                <img :src="previewImage || product.imgSrc" alt="Preview" class="image-preview">
              </label>
              <p class="help-text">Click vào ảnh để thay đổi</p>
            </div>
          </div>

          <!-- 2. Hình ảnh/Video bổ sung (không bắt buộc) -->
          <div class="form-group">
            <label>Hình ảnh/Video bổ sung</label>
            <p class="help-text">Thêm nhiều ảnh hoặc video để mô tả chi tiết sản phẩm</p>
            
            <!-- Input để chọn nhiều file -->
            <div class="media-upload">
              <input 
                type="file" 
                id="product-media"
                accept="image/*,video/*"
                multiple
                @change="handleMediaChange"
              >
              <label for="product-media" class="media-label">
                📁 Thêm ảnh/video (có thể chọn nhiều)
              </label>
            </div>

            <!-- Hiển thị danh sách media đã có và mới thêm -->
            <div v-if="mediaList.length > 0" class="media-list">
              <div v-for="(item, index) in mediaList" :key="index" class="media-item">
                <!-- Hiển thị ảnh -->
                <img v-if="item.type === 'image'" :src="item.preview || item.url" alt="Media" class="media-thumbnail">
                <!-- Hiển thị video -->
                <video v-else :src="item.preview || item.url" class="media-thumbnail"></video>
                
                <div class="media-info">
                  <span class="media-type">{{ item.type === 'image' ? '🖼️ Ảnh' : '🎥 Video' }}</span>
                  <span class="media-name">{{ item.name || 'Media hiện tại' }}</span>
                </div>
                
                <button type="button" class="btn-remove-media" @click="removeMedia(index)">
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Tên sản phẩm -->
          <div class="form-group">
            <label>Tên sản phẩm *</label>
            <input 
              v-model="product.name"
              type="text" 
              placeholder="VD: Loa JBL SRX815P"
              required
            >
          </div>

          <!-- Danh mục -->
          <div class="form-group">
            <label>Danh mục *</label>
            <select v-model="product.category" required>
              <option value="">-- Chọn danh mục --</option>
              <option value="loa">Loa</option>
              <option value="amply">Amply</option>
              <option value="phu-kien">Phụ kiện âm thanh</option>
              <option value="khac">Khác</option>
            </select>
          </div>

          <!-- Giá thuê/ngày -->
          <div class="form-group">
            <label>Giá thuê/ngày (VNĐ) *</label>
            <input 
              v-model.number="product.price"
              type="number" 
              placeholder="VD: 1200000"
              min="0"
              required
            >
            <p class="price-preview">
              Hiển thị: {{ formatPrice(product.price) }}/ngày
            </p>
          </div>

          <!-- Số lượng tồn kho -->
          <div class="form-group">
            <label>Số lượng tồn kho *</label>
            <input 
              v-model.number="product.stock"
              type="number" 
              placeholder="VD: 10"
              min="0"
              required
            >
          </div>

          <!-- Thông tin sản phẩm -->
          <div class="form-group">
            <label>Thông tin sản phẩm</label>
            <textarea 
              v-model="product.description"
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
              rows="5"
            ></textarea>
          </div>

          <!-- Buttons -->
          <div class="form-actions">
            <router-link :to="`/sanpham/${product._id}`" class="btn-cancel">Hủy</router-link>
            <button 
              type="submit" 
              class="btn-submit"
              :disabled="submitting"
            >
              {{ submitting ? 'Đang xử lý...' : 'Cập nhật sản phẩm' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useProducts } from '../composables/useProducts'
import api from '../utils/api'
import { formatPrice } from '../utils/formatters'

const router = useRouter()
const route = useRoute()
const { currentUser } = useAuth()
const { fetchProductById } = useProducts()

// Kiểm tra quyền truy cập (chỉ employee và admin)
const canAccess = computed(() => {
  return currentUser.value && (currentUser.value.role === 'admin' || currentUser.value.role === 'employee')
})

// State
const product = ref(null)
const loading = ref(false)
const submitting = ref(false)

// State cho ảnh xem trước
const previewImage = ref(null)

// State cho danh sách media bổ sung
const mediaList = ref([])

// Load sản phẩm hiện tại
const loadProduct = async () => {
  loading.value = true
  try {
    const productId = route.params.id
    const data = await fetchProductById(productId)
    
    if (data) {
      product.value = data
      
      // Load media hiện có vào mediaList
      if (data.media && data.media.length > 0) {
        mediaList.value = data.media.map(item => ({
          type: item.type,
          url: item.url,
          name: null,
          preview: null,
          isExisting: true
        }))
      }
    } else {
      alert('❌ Không tìm thấy sản phẩm!')
      router.push('/sanpham')
    }
  } catch (error) {
    alert('❌ Có lỗi xảy ra khi tải sản phẩm!')
    router.push('/sanpham')
  } finally {
    loading.value = false
  }
}

// Xử lý khi chọn ảnh xem trước mới
const handlePreviewImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Kiểm tra file phải là ảnh
    if (!file.type.startsWith('image/')) {
      alert('⚠️ Vui lòng chọn file ảnh!')
      event.target.value = ''
      return
    }

    // Tạo preview
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
    }
    reader.readAsDataURL(file)
    
    // Lưu đường dẫn tạm
    product.value.imgSrc = `/frontend/assets/img/${file.name}`
  }
}

// Xử lý khi chọn nhiều ảnh/video bổ sung
const handleMediaChange = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    // Kiểm tra file là ảnh hoặc video
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    
    if (!isImage && !isVideo) {
      alert(`⚠️ File "${file.name}" không phải ảnh hoặc video!`)
      return
    }

    // Tạo preview và thêm vào danh sách
    const reader = new FileReader()
    reader.onload = (e) => {
      mediaList.value.push({
        type: isImage ? 'image' : 'video',
        name: file.name,
        preview: e.target.result,
        url: `/frontend/assets/img/${file.name}`,
        isExisting: false
      })
    }
    reader.readAsDataURL(file)
  })

  // Reset input
  event.target.value = ''
}

// Xóa media khỏi danh sách
const removeMedia = (index) => {
  mediaList.value.splice(index, 1)
}

// Xử lý submit form
const handleSubmit = async () => {
  // Validate
  if (!product.value.name || !product.value.category || !product.value.imgSrc) {
    alert('⚠️ Vui lòng điền đầy đủ thông tin bắt buộc!')
    return
  }

  if (product.value.price <= 0) {
    alert('⚠️ Giá thuê phải lớn hơn 0!')
    return
  }

  if (product.value.stock < 0) {
    alert('⚠️ Số lượng tồn kho không được âm!')
    return
  }

  submitting.value = true

  try {
    // Tạo priceText từ price
    const priceText = `${product.value.price.toLocaleString()}đ/ngày`

    // Chuẩn bị dữ liệu media để gửi lên server
    const media = mediaList.value.map(item => ({
      type: item.type,
      url: item.url
    }))

    // Gọi API cập nhật sản phẩm
    const { data } = await api.put(`/products/${product.value._id}`, {
      name: product.value.name,
      category: product.value.category,
      price: product.value.price,
      priceText: priceText,
      stock: product.value.stock,
      description: product.value.description,
      imgSrc: product.value.imgSrc,
      media: media
    })

    if (data.success) {
      alert('✅ ' + data.message)
      router.push(`/sanpham/${product.value._id}`)
    } else {
      alert('❌ Cập nhật sản phẩm thất bại!')
    }
  } catch (error) {
    alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra!'))
  } finally {
    submitting.value = false
  }
}

// Load sản phẩm khi component mount
onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.edit-product-container {
  max-width: 800px;
  margin: 0 auto;
}

.product-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1D3557;
  font-weight: 500;
  font-size: 15px;
}

.help-text {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 10px;
  font-style: italic;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #e63946;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.price-preview {
  margin-top: 8px;
  color: #e63946;
  font-size: 14px;
  font-weight: 500;
}

.image-upload {
  position: relative;
}

.image-upload input[type="file"] {
  display: none;
}

.image-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.image-label:hover {
  border-color: #e63946;
}

.image-preview {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
}

.media-upload {
  margin-bottom: 15px;
}

.media-upload input[type="file"] {
  display: none;
}

.media-label {
  display: inline-block;
  padding: 12px 24px;
  background: #10b981;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.media-label:hover {
  background: #059669;
}

.media-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.media-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.media-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.media-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.media-type {
  font-size: 13px;
  color: #e63946;
  font-weight: 500;
}

.media-name {
  font-size: 14px;
  color: #4b5563;
}

.btn-remove-media {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-remove-media:hover {
  background: #dc2626;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 30px;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 12px 30px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: background 0.3s;
}

.btn-cancel {
  background: #6b7280;
  color: white;
}

.btn-cancel:hover {
  background: #4b5563;
}

.btn-submit {
  background: #e63946;
  color: white;
}

.btn-submit:hover {
  background: #d00000;
}

.btn-submit:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-back {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #e63946;
  color: white;
  border-radius: 20px;
  text-decoration: none;
  transition: background 0.3s;
}

.btn-back:hover {
  background: #d00000;
}
</style>