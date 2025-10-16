<!-- frontend/views/CartView.vue -->
<!-- View trang giỏ hàng -->

<template>
  <section class="page-section">
    <div class="container">
      <h2>Giỏ hàng của bạn</h2>
      
      <!-- Giỏ hàng trống -->
      <div v-if="cart.length === 0" id="cart-container">
        <p>🛒 Giỏ hàng của bạn đang trống.</p>
      </div>

      <!-- Danh sách sản phẩm trong giỏ -->
      <div v-else id="cart-container">
        <div 
          v-for="(item, index) in cart" 
          :key="index"
          class="cart-item"
        >
          <img :src="item.imgSrc">
          <div class="cart-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.priceText }}</p>

            <div class="cart-controls">
              <!-- Điều khiển số lượng -->
              <div class="quantity-control">
                <button class="qty-btn minus" @click="decreaseQuantity(index)">−</button>
                <span>{{ item.quantity }}</span>
                <button class="qty-btn plus" @click="increaseQuantity(index)">+</button>
              </div>

              <!-- Điều khiển số ngày thuê -->
              <div class="days-control">
                <label :for="'days-' + index">Số ngày:</label>
                <input 
                  type="number" 
                  :id="'days-' + index"
                  class="days-input"
                  min="1"
                  :value="item.days"
                  @input="updateDays(index, $event.target.value)"
                >
              </div>

              <!-- Nút xóa -->
              <button class="btn-remove" @click="removeFromCart(index)">Xóa</button>
            </div>
          </div>
        </div>

        <!-- Tổng tiền -->
        <div id="cart-total">
          <h3>
            Tổng cộng: 
            <span style="color:#e63946">{{ cartTotal.toLocaleString() }}đ</span>
          </h3>
        </div>
      </div>

      <!-- Các nút hành động -->
      <div class="cart-actions">
        <router-link to="/sanpham" class="btn-back-cart">⬅ Trở về</router-link>
        <button 
          v-if="cart.length > 0"
          class="btn-rent"
          @click="handleRent"
        >
          đặt ngay
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'
import { useOrders } from '../composables/useOrders'
import { useAuth } from '../composables/useAuth'

const router = useRouter()

// Lấy các hàm và dữ liệu từ composable
const { 
  cart, 
  cartTotal,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateDays,
  clearCart
} = useCart()

const { createOrder } = useOrders()
const { userName } = useAuth()

// Xử lý đặt ngay
const handleRent = () => {
  // Tạo đơn hàng mới
  const order = createOrder([...cart.value], cartTotal.value, userName.value)
  
  // Xóa giỏ hàng
  clearCart()
  
  // Thông báo và chuyển đến trang đơn hàng
  alert(`✅ đặt ngay thành công!\n\nMã đơn hàng: ${order.orderNumber}\n\nVui lòng chờ xác nhận từ chúng tôi.`)
  
  router.push('/donhang')
}
</script>