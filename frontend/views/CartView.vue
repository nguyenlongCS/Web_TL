<template>
  <section class="page-section">
    <div class="container">
      <h2>Giỏ hàng của bạn</h2>
      
      <div v-if="cart.length === 0" id="cart-container">
        <p>🛒 Giỏ hàng của bạn đang trống.</p>
      </div>

      <div v-else id="cart-container">
        <CartItem 
          v-for="(item, index) in cart" 
          :key="index"
          :item="item"
          :index="index"
          @increase="increaseQuantity(index)"
          @decrease="decreaseQuantity(index)"
          @update-days="updateDays(index, $event)"
          @remove="removeFromCart(index)"
        />
        <CartSummary :total="cartTotal" @checkout="handleRent" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import CartItem from '../components/cart/CartItem.vue'
import CartSummary from '../components/cart/CartSummary.vue'
import { useCart } from '../composables/useCart'
import { useOrders } from '../composables/useOrders'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { cart, cartTotal, removeFromCart, increaseQuantity, decreaseQuantity, updateDays, clearCart } = useCart()
const { createOrder } = useOrders()
const { userName } = useAuth()

const handleRent = () => {
  const order = createOrder([...cart.value], cartTotal.value, userName.value)
  clearCart()
  alert(`✅ đặt ngay thành công!\n\nMã đơn hàng: ${order.orderNumber}\n\nVui lòng chờ xác nhận từ chúng tôi.`)
  router.push('/donhang')
}
</script>