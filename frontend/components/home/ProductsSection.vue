<!-- frontend/components/home/ProductsSection.vue -->
<!-- Section sản phẩm trang chủ - hiển thị featured products -->

<template>
  <section class="home-section home-product">
    <div class="container">
      <h2>Sản phẩm nổi bật</h2>
      
      <!-- Hiển thị loading -->
      <div v-if="loading" style="text-align: center; padding: 30px;">
        <p style="color: #e63946;">Đang tải sản phẩm...</p>
      </div>
      
      <!-- Hiển thị danh sách sản phẩm -->
      <div v-else>
        <ProductGrid :products="products" @add-to-cart="handleAddCart" />
        <router-link to="/sanpham" class="btn-more">Xem thêm</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import ProductGrid from '../product/ProductGrid.vue'
import { useCart } from '../../composables/useCart'

// Nhận props từ parent component
defineProps({
  products: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const { addToCart } = useCart()

// Hàm thêm vào giỏ hàng
const handleAddCart = (product) => {
  addToCart(product)
  alert(`✅ Đã thêm "${product.name}" vào giỏ hàng!`)
}
</script>