<!-- frontend/views/CartView.vue -->
<!-- Trang giỏ hàng - gửi đơn hàng qua API -->

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
        <CartSummary 
          :total="cartTotal" 
          :loading="orderLoading"
          @checkout="handleRent" 
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CartItem from '../components/cart/CartItem.vue'
import CartSummary from '../components/cart/CartSummary.vue'
import { useCart } from '../composables/useCart'
import { useOrders } from '../composables/useOrders'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { cart, cartTotal, removeFromCart, increaseQuantity, decreaseQuantity, updateDays, clearCart } = useCart()
const { createOrder } = useOrders()
const { isLoggedIn } = useAuth()

const orderLoading = ref(false)

// Hàm xử lý đặt hàng
const handleRent = async () => {
  // Kiểm tra đăng nhập
  if (!isLoggedIn.value) {
    alert('⚠️ Vui lòng đăng nhập để đặt hàng!')
    router.push('/dangnhap')
    return
  }

  orderLoading.value = true
  
  // Gọi API tạo đơn hàng
  const result = await createOrder([...cart.value], cartTotal.value)
  
  orderLoading.value = false
  
  if (result.success) {
    // Xóa giỏ hàng
    clearCart()
    
    // Hiển thị thông báo thành công
    alert(`✅ Đặt hàng thành công!\n\nMã đơn hàng: ${result.order.orderNumber}\n\nVui lòng chờ xác nhận từ chúng tôi.`)
    
    // Chuyển đến trang đơn hàng
    router.push('/donhang')
  } else {
    // Hiển thị lỗi
    alert(`❌ Đặt hàng thất bại!\n\n${result.message}`)
  }
}
</script>