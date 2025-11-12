<!-- frontend/views/ProductView.vue -->
<!-- Trang sản phẩm - sử dụng dữ liệu từ API với filter -->

<template>
  <section class="page-section">
    <div class="container">
      <h2>Sản phẩm</h2>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0;">Sản phẩm</h2>

        <router-link v-if="canAddProduct" to="/sanpham/them" class="btn-add-product">
          ➕ Thêm sản phẩm
        </router-link>
      </div>
      <ProductFilter v-model:categoryFilter="categoryFilter" v-model:priceSort="priceSort"
        v-model:ratingSort="ratingSort" />

      <!-- Hiển thị loading -->
      <div v-if="loading" style="text-align: center; padding: 50px;">
        <p style="color: #e63946;">Đang tải sản phẩm...</p>
      </div>

      <!-- Hiển thị lỗi -->
      <div v-else-if="error" style="text-align: center; padding: 50px;">
        <p style="color: #ef4444;">{{ error }}</p>
      </div>

      <!-- Hiển thị danh sách sản phẩm -->
      <ProductGrid v-else :products="products" @add-to-cart="handleAddCart" />
    </div>
  </section>
</template>

<script setup>
import { ref, watch, computed} from 'vue'
import ProductFilter from '../components/product/ProductFilter.vue'
import ProductGrid from '../components/product/ProductGrid.vue'
import { useProducts } from '../composables/useProducts'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'

const { products, loading, error, fetchProducts } = useProducts()
const { addToCart } = useCart()
const { currentUser } = useAuth()

const canAddProduct = computed(() => {
  return currentUser.value && (currentUser.value.role === 'admin' || currentUser.value.role === 'employee')
})

// State cho filters
const categoryFilter = ref('all')
const priceSort = ref('none')
const ratingSort = ref('none')

// Hàm thêm vào giỏ hàng
const handleAddCart = (product) => {
  addToCart(product)
  alert(`✅ Đã thêm "${product.name}" vào giỏ hàng!`)
}

// Watch filters và gọi API khi thay đổi
watch([categoryFilter, priceSort, ratingSort], () => {
  fetchProducts({
    category: categoryFilter.value,
    sort: priceSort.value !== 'none' ? priceSort.value : null,
    rating: ratingSort.value !== 'none' ? ratingSort.value : null
  })
})
</script>
/* Thêm CSS */
<style scoped>
.btn-add-product {
  background-color: #10b981;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.3s;
}

.btn-add-product:hover {
  background-color: #059669;
}
</style>