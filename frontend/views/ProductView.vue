<template>
  <section class="page-section">
    <div class="container">
      <h2>Sản phẩm</h2>
      <ProductFilter 
        v-model:categoryFilter="categoryFilter"
        v-model:priceSort="priceSort"
        v-model:ratingSort="ratingSort"
      />
      <ProductGrid :products="filteredProducts" @add-to-cart="handleAddCart" />
    </div>
  </section>
</template>

<script setup>
import ProductFilter from '../components/product/ProductFilter.vue'
import ProductGrid from '../components/product/ProductGrid.vue'
import { useProducts } from '../composables/useProducts'
import { useProductFilters } from '../composables/useProductFilters'
import { useCart } from '../composables/useCart'

const { products } = useProducts()
const { categoryFilter, priceSort, ratingSort, filteredProducts } = useProductFilters(products)
const { addToCart } = useCart()

const handleAddCart = (product) => {
  addToCart(product)
  alert(`✅ Đã thêm "${product.name}" vào giỏ hàng!`)
}
</script>