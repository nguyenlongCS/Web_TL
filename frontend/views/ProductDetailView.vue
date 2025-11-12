<!-- frontend/views/ProductDetailView.vue -->
<!-- Trang chi tiết sản phẩm -->

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
        <div class="product-image">
          <img :src="product.imgSrc" :alt="product.name">
        </div>

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
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '../composables/useProducts'
import { useCart } from '../composables/useCart'
import { formatStars } from '../utils/formatters'
import { CATEGORY_LABELS } from '../utils/constants'

const route = useRoute()
const router = useRouter()
const { fetchProductById } = useProducts()
const { addToCart } = useCart()

// State
const product = ref(null)
const loading = ref(false)
const error = ref(null)

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

/* .btn-add-cart {
  background: #10b981;
  color: white;
}

.btn-add-cart:hover {
  background: #059669;
} */

.btn-add-cart:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>