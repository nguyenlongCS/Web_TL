<template>
  <section class="home-section home-product">
    <div class="container">
      <h2>Sản phẩm nổi bật</h2>
      <ProductGrid :products="products" @add-to-cart="handleAddCart" />
      <router-link to="/sanpham" class="btn-more">Xem thêm</router-link>
    </div>
  </section>
</template>

<script setup>
import ProductGrid from '../product/ProductGrid.vue'
import { useCart } from '../../composables/useCart'

defineProps({
  products: Array
})

const { addToCart } = useCart()

const handleAddCart = (product) => {
  addToCart(product)
  alert(`✅ Đã thêm "${product.name}" vào giỏ hàng!`)
}
</script>