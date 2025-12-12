<!-- frontend/components/layout/FloatingButtons.vue -->
<!-- Các nút floating - admin vào /tinnhan, user mở chat window -->

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

    <!-- Nút Chat - admin chuyển trang, user mở popup -->
    <router-link v-if="isAdmin" to="/tinnhan" class="chat-button">
      <img src="/frontend/assets/icons/chat.png" alt="Chat" class="chat-icon">
    </router-link>
    
    <button v-else class="chat-button" @click="toggleChat">
      <img src="/frontend/assets/icons/chat.png" alt="Chat" class="chat-icon">
    </button>

    <!-- Cửa sổ chat cho user/guest - chỉ hiển thị khi không phải admin -->
    <ChatWindow 
      v-if="!isAdmin"
      :isOpen="chatOpen"
      :messages="messages"
      :loading="loading"
      :currentUserId="currentUser?._id"
      :currentUserRole="senderInfo.role"
      @close="chatOpen = false"
      @send-message="handleSendMessage"
      @send-file="handleSendFile"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCart } from '../../composables/useCart'
import { useOrders } from '../../composables/useOrders'
import { useAuth } from '../../composables/useAuth'
import { useChat } from '../../composables/useChat'
import ChatWindow from '../chat/ChatWindow.vue'

const { cartCount } = useCart()
const { orderCount, allOrders } = useOrders()
const { currentUser } = useAuth()

const {
  messages,
  roomId,
  senderInfo,
  loading,
  connected,
  connect,
  joinRoom,
  loadMessages,
  sendMessage
} = useChat()

const chatOpen = ref(false)

// Kiểm tra có phải admin không
const isAdmin = computed(() => {
  return currentUser.value && currentUser.value.role === 'admin'
})

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

// Bật/tắt chat (chỉ cho user/guest)
const toggleChat = async () => {
  chatOpen.value = !chatOpen.value
  
  if (chatOpen.value) {
    // Kết nối socket nếu chưa kết nối
    if (!connected.value) {
      connect()
    }
    
    // Join room và load tin nhắn
    joinRoom(roomId.value)
    await loadMessages(roomId.value)
  }
}

// Gửi tin nhắn text
const handleSendMessage = async (content) => {
  try {
    await sendMessage(content, 'text')
  } catch (error) {
    alert('❌ Gửi tin nhắn thất bại!')
  }
}

// Gửi file
const handleSendFile = async (content, type) => {
  try {
    await sendMessage(content, type)
  } catch (error) {
    alert('❌ Gửi file thất bại!')
  }
}

// Kết nối socket khi component mount
watch(() => chatOpen.value, (isOpen) => {
  if (isOpen && !connected.value) {
    connect()
  }
})
</script>

<style scoped>
/* Nút Duyệt đơn hàng - vị trí cao nhất */
.approve-orders-button {
  position: fixed;
  bottom: 310px;
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

/* Nút Đơn hàng */
.orders-button {
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

/* Nút Giỏ hàng */
.cart-button {
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

/* Nút Chat - vị trí thấp nhất bên phải */
.chat-button {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #10b981;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 9999;
  border: none;
  transition: background 0.3s, transform 0.2s;
  text-decoration: none;
}

.chat-button:hover {
  background-color: #059669;
  transform: scale(1.05);
}

.chat-icon {
  width: 28px;
  height: 28px;
  filter: brightness(0) invert(1);
}
</style>