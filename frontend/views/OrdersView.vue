<template>
  <section class="page-section">
    <div class="container">
      <h2>Đơn hàng của bạn</h2>
      
      <div v-if="orders.length === 0" id="orders-container">
        <p>📦 Bạn chưa có đơn hàng nào.</p>
      </div>

      <div v-else id="orders-container">
        <OrderCard 
          v-for="order in orders" 
          :key="order.id"
          :order="order"
          :statusText="getStatusText(order.status)"
          :statusColor="getStatusColor(order.status)"
          @cancel="handleCancelOrder"
        />
      </div>

      <div class="order-actions">
        <router-link to="/sanpham" class="btn-back-order">⬅ Trở về</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import OrderCard from '../components/order/OrderCard.vue'
import { useOrders } from '../composables/useOrders'

const { orders, cancelOrder, getStatusText, getStatusColor } = useOrders()

const handleCancelOrder = (orderId) => {
  if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
    const result = cancelOrder(orderId)
    alert(result.message)
  }
}
</script>

<style scoped>
#orders-container {
  min-height: 200px;
}

#orders-container > p {
  text-align: center;
  color: #6b7280;
  font-size: 1.1rem;
  margin-top: 50px;
}

.order-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 30px;
}

.btn-back-order {
  display: inline-block;
  background-color: #e63946;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.3s;
}

.btn-back-order:hover {
  background-color: #d00000;
}
</style>