<!-- frontend/views/CartView.vue -->
<!-- Trang giỏ hàng - xử lý ngày và giờ bắt đầu thuê -->

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
          @update-rental-start="updateRentalStart(index, $event)"
          @update-rental-time="updateRentalTime(index, $event)"
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
const { 
  cart, 
  cartTotal, 
  removeFromCart, 
  increaseQuantity, 
  decreaseQuantity, 
  updateDays, 
  updateRentalStart,
  updateRentalTime,
  clearCart 
} = useCart()

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

  // Kiểm tra tất cả sản phẩm đã chọn ngày bắt đầu thuê chưa
  const missingDate = cart.value.find(item => !item.rentalStartDate)
  if (missingDate) {
    alert(`⚠️ Vui lòng chọn ngày bắt đầu thuê cho sản phẩm "${missingDate.name}"!`)
    return
  }

  // Kiểm tra tất cả ngày bắt đầu thuê phải từ hôm nay trở đi
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const invalidDate = cart.value.find(item => {
    const selectedDate = new Date(item.rentalStartDate + 'T00:00:00')
    return selectedDate < today
  })
  
  if (invalidDate) {
    alert(`⚠️ Ngày bắt đầu thuê cho sản phẩm "${invalidDate.name}" phải từ hôm nay trở đi!`)
    return
  }

  orderLoading.value = true
  
  // Gọi API tạo đơn hàng với ngày và giờ thuê
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