<!-- frontend/components/layout/FloatingButtons.vue -->
<!-- Các nút floating - thêm nút Duyệt đơn hàng cho admin/employee -->

<template>
  <div>
    <!-- Nút Duyệt đơn hàng - chỉ hiển thị cho admin và employee -->
    <router-link v-if="canApprove" to="/duyetdonhang" class="approve-orders-button">
      <img src="/frontend/assets/icons/approve.png" alt="Duyệt đơn hàng">
      <span id="approve-count">{{ pendingOrderCount }}</span>
    </router-link>

    <!-- Nút Đơn hàng -->
    <router-link to="/donhang" class="orders-button">
      <img src="/frontend/assets/icons/orders.png" alt="Đơn hàng">
      <span id="orders-count">{{ orderCount }}</span>
    </router-link>
    
    <!-- Nút Giỏ hàng -->
    <router-link to="/giohang" class="cart-button">
      <img src="/frontend/assets/icons/cart.png" alt="Giỏ hàng">
      <span id="cart-count">{{ cartCount }}</span>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCart } from '../../composables/useCart'
import { useOrders } from '../../composables/useOrders'
import { useAuth } from '../../composables/useAuth'

const { cartCount } = useCart()
const { orderCount, allOrders } = useOrders()
const { currentUser } = useAuth()

// Kiểm tra quyền duyệt đơn (admin hoặc employee)
const canApprove = computed(() => {
  return currentUser.value && (
    currentUser.value.role === 'admin' || 
    currentUser.value.role === 'employee'
  )
})

// Đếm số đơn hàng chờ duyệt
const pendingOrderCount = computed(() => {
  return allOrders.value.filter(o => o.status === 'pending').length
})
</script>

<style scoped>
/* Nút Duyệt đơn hàng - vị trí cao nhất */
.approve-orders-button {
  position: fixed;
  bottom: 240px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #e63946;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 9999;
  transition: background 0.3s, transform 0.2s;
}

.approve-orders-button img {
  width: 28px;
  height: 28px;
}

.approve-orders-button:hover {
  background-color: #d00000;
  transform: scale(1.05);
}

#approve-count {
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: #1D3557;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
}

/* Nút Đơn hàng - vị trí giữa */
.orders-button {
  position: fixed;
  bottom: 170px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #e63946;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 9999;
  transition: background 0.3s, transform 0.2s;
}

.orders-button img {
  width: 28px;
  height: 28px;
}

.orders-button:hover {
  background-color: #d00000;
  transform: scale(1.05);
}

#orders-count {
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: #1D3557;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
}

/* Nút Giỏ hàng - vị trí thấp nhất */
.cart-button {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #e63946;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 9999;
  transition: background 0.3s, transform 0.2s;
}

.cart-button img {
  width: 28px;
  height: 28px;
}

.cart-button:hover {
  background-color: #d00000;
  transform: scale(1.05);
}

#cart-count {
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: #1D3557;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
}
</style>