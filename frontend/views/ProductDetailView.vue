<!-- frontend/views/ProductDetailView.vue -->
<!-- Trang chi tiết sản phẩm - hiển thị ảnh xem trước và media bổ sung -->

<template>
  <section class="page-section">
    <div class="container">
      <!-- Hiển thị loading -->
      <div v-if="loading" style="text-align: center; padding: 50px;">
        <p style="color: #e63946;">Đang tải sản phẩm...</p>
      </div>

      <!-- Hiển thị lỗi -->
      <div v-else-if="error" style="text-align: center; padding: 50px;">
        <p style="color: #ef4444;">{{ error }}</p>
        <router-link to="/sanpham" class="btn-back">Quay lại danh sách</router-link>
      </div>

      <!-- Hiển thị chi tiết sản phẩm -->
      <div v-else-if="product" class="product-detail">
        <!-- Cột trái: Ảnh xem trước và Media bổ sung -->
        <div class="product-left">
          <div class="product-image">
            <img :src="product.imgSrc" :alt="product.name">
          </div>

          <!-- Hiển thị media bổ sung nếu có -->
          <div v-if="product.media && product.media.length > 0" class="product-media">
            <h3>Hình ảnh/Video bổ sung</h3>
            <div class="media-grid">
              <div v-for="(item, index) in product.media" :key="index" class="media-item">
                <!-- Hiển thị ảnh -->
                <img 
                  v-if="item.type === 'image'" 
                  :src="item.url" 
                  :alt="`Media ${index + 1}`"
                  class="media-content"
                  @click="openMediaModal(item)"
                >
                <!-- Hiển thị video -->
                <video 
                  v-else
                  class="media-content video-player"
                  controls
                  preload="metadata"
                >
                  <source :src="item.url" type="video/mp4">
                  <source :src="item.url" type="video/webm">
                  <source :src="item.url" type="video/ogg">
                  Trình duyệt không hỗ trợ video
                </video>
              </div>
            </div>
          </div>
        </div>

        <!-- Cột phải: Thông tin sản phẩm -->
        <div class="product-info">
          <h2>{{ product.name }}</h2>

          <div class="product-meta">
            <div class="rating">
              <span class="stars">{{ formatStars(product.rating) }}</span>
              <span class="rating-number">({{ product.rating }}/5.0)</span>
            </div>

            <div class="category">
              <strong>Danh mục:</strong> {{ getCategoryLabel(product.category) }}
            </div>

            <div class="stock">
              <strong>Tình trạng:</strong>
              <span :style="{ color: product.stock > 0 ? '#10b981' : '#ef4444' }">
                {{ product.stock > 0 ? `Còn ${product.stock} chiếc` : 'Hết hàng' }}
              </span>
            </div>
          </div>

          <div class="product-price">
            <span class="price-label">Giá thuê:</span>
            <span class="price-value">{{ product.priceText }}</span>
          </div>

          <div class="product-description">
            <h3>Thông tin sản phẩm</h3>
            <p v-if="product.description">{{ product.description }}</p>
            <p v-else style="color: #9ca3af; font-style: italic;">
              Chưa có thông tin chi tiết về sản phẩm này.
            </p>
          </div>

          <div class="product-actions">
            <router-link to="/sanpham" class="btn-back">
              ⬅ Quay lại
            </router-link>
            <button 
              class="btn-add-cart"
              @click="handleAddToCart"
              :disabled="product.stock === 0"
            >
              {{ product.stock === 0 ? 'Hết hàng' : '🛒 Thêm vào giỏ hàng' }}
            </button>
          </div>

          <!-- Nút Sửa/Xóa cho admin và employee -->
          <div v-if="canEdit" class="admin-actions">
            <router-link :to="`/sanpham/${product._id}/sua`" class="btn-edit">
              ✏️ Sửa sản phẩm
            </router-link>
            <button class="btn-delete" @click="handleDelete">
              🗑️ Xóa sản phẩm
            </button>
          </div>
        </div>
      </div>

      <!-- Modal xem ảnh phòng to -->
      <div v-if="showMediaModal" class="media-modal" @click="closeMediaModal">
        <div class="modal-content" @click.stop>
          <button class="btn-close-modal" @click="closeMediaModal">✕</button>
          <img 
            v-if="selectedMedia && selectedMedia.type === 'image'" 
            :src="selectedMedia.url" 
            alt="Full size"
            class="modal-image"
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '../composables/useProducts'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'
import { formatStars } from '../utils/formatters'
import { CATEGORY_LABELS } from '../utils/constants'
import api from '../utils/api'

const route = useRoute()
const router = useRouter()
const { fetchProductById } = useProducts()
const { addToCart } = useCart()
const { currentUser } = useAuth()

// State
const product = ref(null)
const loading = ref(false)
const error = ref(null)

// State cho modal xem ảnh
const showMediaModal = ref(false)
const selectedMedia = ref(null)

// Kiểm tra quyền sửa/xóa (chỉ admin và employee)
const canEdit = computed(() => {
  return currentUser.value && (currentUser.value.role === 'admin' || currentUser.value.role === 'employee')
})

// Lấy label của category
const getCategoryLabel = (category) => {
  return CATEGORY_LABELS[category] || category
}

// Load chi tiết sản phẩm
const loadProduct = async () => {
  loading.value = true
  error.value = null
  
  try {
    const productId = route.params.id
    const data = await fetchProductById(productId)
    
    if (data) {
      product.value = data
    } else {
      error.value = 'Không tìm thấy sản phẩm'
    }
  } catch (err) {
    error.value = 'Có lỗi xảy ra khi tải sản phẩm'
  } finally {
    loading.value = false
  }
}

// Thêm vào giỏ hàng
const handleAddToCart = () => {
  addToCart(product.value)
  alert(`✅ Đã thêm "${product.value.name}" vào giỏ hàng!`)
  router.push('/giohang')
}

// Mở modal xem ảnh phóng to
const openMediaModal = (media) => {
  if (media.type === 'image') {
    selectedMedia.value = media
    showMediaModal.value = true
  }
}

// Đóng modal
const closeMediaModal = () => {
  showMediaModal.value = false
  selectedMedia.value = null
}

// Xóa sản phẩm
const handleDelete = async () => {
  if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.value.name}"?`)) {
    return
  }

  try {
    const { data } = await api.delete(`/products/${product.value._id}`)
    
    if (data.success) {
      alert('✅ ' + data.message)
      router.push('/sanpham')
    } else {
      alert('❌ Xóa sản phẩm thất bại!')
    }
  } catch (error) {
    alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm!'))
  }
}

// Load sản phẩm khi component mount
onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-top: 30px;
}

.product-left {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.product-image {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.product-image img {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.product-info h2 {
  color: #1D3557;
  font-size: 2rem;
  margin: 0;
}

.product-meta {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars {
  color: #FFD700;
  font-size: 1.3rem;
  letter-spacing: 2px;
}

.rating-number {
  color: #6b7280;
  font-size: 1rem;
}

.category,
.stock {
  font-size: 1rem;
  color: #4b5563;
}

.category strong,
.stock strong {
  color: #1D3557;
  margin-right: 8px;
}

.product-price {
  padding: 25px;
  background: #e63946;
  color: white;
  border-radius: 8px;
  text-align: center;
}

.price-label {
  display: block;
  font-size: 1rem;
  margin-bottom: 8px;
  opacity: 0.9;
}

.price-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
}

.product-description {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-description h3 {
  color: #e63946;
  font-size: 1.3rem;
  margin-bottom: 15px;
}

.product-description p {
  color: #4b5563;
  line-height: 1.8;
  font-size: 1rem;
}

.product-media {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-media h3 {
  color: #e63946;
  font-size: 1.3rem;
  margin-bottom: 15px;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.media-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #000;
}

.media-content {
  width: 100%;
  height: 150px;
  object-fit: cover;
  transition: transform 0.3s;
  display: block;
}

img.media-content {
  cursor: pointer;
  background: #f8f9fa;
}

img.media-content:hover {
  transform: scale(1.05);
}

video.media-content {
  cursor: default;
  pointer-events: auto;
}

video.media-content:hover {
  transform: none;
}

.product-actions {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.btn-back,
.btn-add-cart {
  flex: 1;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-back {
  background: #6b7280;
  color: white;
}

.btn-back:hover {
  background: #4b5563;
}

.btn-add-cart {
  background: #10b981;
  color: white;
}

.btn-add-cart:hover {
  background: #059669;
}

.btn-add-cart:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.admin-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #f3f4f6;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-edit {
  background: #f59e0b;
  color: white;
}

.btn-edit:hover {
  background: #d97706;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}

.media-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  cursor: pointer;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  cursor: default;
}

.modal-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

.btn-close-modal {
  position: absolute;
  top: -40px;
  right: 0;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-close-modal:hover {
  background: #dc2626;
}
</style>