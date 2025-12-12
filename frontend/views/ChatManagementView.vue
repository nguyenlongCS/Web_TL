<!-- frontend/views/ChatManagementView.vue -->
<!-- Trang quản lý tin nhắn cho admin - fix lấy tên phòng từ tin nhắn -->

<template>
  <section class="page-section chat-management-page">
    <div class="chat-management-container">
      <!-- Sidebar danh sách phòng chat -->
      <div class="chat-sidebar">
        <ChatRoomList 
          :rooms="rooms"
          :selectedRoomId="selectedRoomId"
          :loading="roomsLoading"
          @select-room="handleSelectRoom"
          @refresh="loadRooms"
        />
      </div>

      <!-- Main chat panel -->
      <div class="chat-main">
        <ChatPanel 
          :currentRoom="selectedRoomId"
          :currentRoomName="currentRoomName"
          :messages="messages"
          :loading="messagesLoading"
          :currentUserId="currentUser?._id"
          @send-message="handleSendMessage"
          @send-file="handleSendFile"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ChatRoomList from '../components/chat/ChatRoomList.vue'
import ChatPanel from '../components/chat/ChatPanel.vue'
import { useChat } from '../composables/useChat'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { currentUser } = useAuth()

// Kiểm tra quyền truy cập (chỉ admin)
if (!currentUser.value || currentUser.value.role !== 'admin') {
  alert('⚠️ Chỉ admin mới có quyền truy cập trang này!')
  router.push('/')
}

const {
  messages,
  rooms,
  loading,
  connected,
  connect,
  joinRoom,
  leaveRoom,
  loadMessages,
  sendMessage,
  loadRooms,
  markAsRead
} = useChat()

const selectedRoomId = ref(null)
const roomsLoading = ref(false)
const messagesLoading = ref(false)

// Fix: Lấy tên phòng từ senderName trong room data
const currentRoomName = computed(() => {
  if (!selectedRoomId.value) return ''
  const room = rooms.value.find(r => r._id === selectedRoomId.value)
  // Sử dụng senderName từ room data (đã được backend trả về)
  return room?.senderName || 'Khách'
})

// Chọn phòng chat và đánh dấu đã đọc
const handleSelectRoom = async (roomId) => {
  // Leave phòng cũ
  if (selectedRoomId.value) {
    leaveRoom()
  }

  // Join phòng mới
  selectedRoomId.value = roomId
  joinRoom(roomId)
  
  // Load tin nhắn
  messagesLoading.value = true
  await loadMessages(roomId)
  messagesLoading.value = false

  // Đánh dấu đã đọc
  await markAsRead(roomId)
  
  // Reload danh sách phòng để cập nhật unread count
  await loadRooms()
}

// Gửi tin nhắn text
const handleSendMessage = async (content) => {
  if (!selectedRoomId.value) return
  
  try {
    await sendMessage(content, 'text')
  } catch (error) {
    alert('❌ Gửi tin nhắn thất bại!')
  }
}

// Gửi file
const handleSendFile = async (content, type) => {
  if (!selectedRoomId.value) return
  
  try {
    await sendMessage(content, type)
  } catch (error) {
    alert('❌ Gửi file thất bại!')
  }
}

// Load danh sách phòng khi mount
onMounted(async () => {
  // Kết nối socket
  if (!connected.value) {
    connect()
  }

  // Load danh sách phòng
  roomsLoading.value = true
  await loadRooms()
  roomsLoading.value = false
})

// Reload rooms khi có tin nhắn mới
watch(() => messages.value.length, () => {
  loadRooms()
})
</script>

<style scoped>
.chat-management-page {
  padding: 0;
  margin-bottom: 0;
  height: calc(100vh - 140px);
}

.chat-management-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chat-sidebar {
  height: 100%;
  overflow: hidden;
}

.chat-main {
  height: 100%;
  overflow: hidden;
}

@media (max-width: 768px) {
  .chat-management-container {
    grid-template-columns: 1fr;
  }
  
  .chat-sidebar {
    display: none;
  }
}
</style>