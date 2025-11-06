<!-- frontend/views/ProductView.vue -->
<!-- Trang sản phẩm - sử dụng dữ liệu từ API với filter -->

<template>
  <section class="page-section">
    <div class="container">
      <h2>Sản phẩm</h2>
      <ProductFilter 
        v-model:categoryFilter="categoryFilter"
        v-model:priceSort="priceSort"
        v-model:ratingSort="ratingSort"
      />
      
      <!-- Hiển thị loading -->
      <div v-if="loading" style="text-align: center; padding: 50px;">
        <p style="color: #e63946;">Đang tải sản phẩm...</p>
      </div>
      
      <!-- Hiển thị lỗi -->
      <div v-else-if="error" style="text-align: center; padding: 50px;">
        <p style="color: #ef4444;">{{ error }}</p>
      </div>
      
      <!-- Hiển thị danh sách sản phẩm -->
      <ProductGrid 
        v-else
        :products="products" 
        @add-to-cart="handleAddCart" 
      />
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import ProductFilter from '../components/product/ProductFilter.vue'
import ProductGrid from '../components/product/ProductGrid.vue'
import { useProducts } from '../composables/useProducts'
import { useCart } from '../composables/useCart'

const { products, loading, error, fetchProducts } = useProducts()
const { addToCart } = useCart()

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