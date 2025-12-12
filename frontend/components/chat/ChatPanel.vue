<!-- frontend/components/chat/ChatPanel.vue -->
<!-- Component khung chat cho admin - hiển thị tin nhắn của 1 phòng -->

<template>
  <div class="chat-panel">
    <div v-if="!currentRoom" class="no-room-selected">
      <img src="/frontend/assets/icons/chat.png" alt="Chat" class="empty-icon">
      <p>Chọn một cuộc trò chuyện để bắt đầu</p>
    </div>

    <div v-else class="chat-content">
      <div class="chat-panel-header">
        <div class="room-info">
          <img src="/frontend/assets/icons/user-avatar.png" alt="Avatar" class="avatar">
          <div>
            <h3>{{ currentRoomName }}</h3>
            <span class="room-id">ID: {{ currentRoom }}</span>
          </div>
        </div>
      </div>

      <div class="chat-panel-messages" ref="messagesContainer">
        <MessageBubble 
          v-for="message in messages" 
          :key="message._id"
          :message="message"
          :isOwn="isOwnMessage(message)"
          @preview-image="handlePreviewImage"
        />
        
        <div v-if="loading" class="loading-indicator">
          Đang tải tin nhắn...
        </div>
      </div>

      <div class="chat-panel-input">
        <input 
          type="file"
          ref="fileInput"
          accept="image/*,video/*"
          style="display: none"
          @change="handleFileSelect"
        >
        
        <button class="btn-attach" @click="$refs.fileInput.click()">
          <img src="/frontend/assets/icons/attach.png" alt="Đính kèm" class="attach-icon">
        </button>
        
        <input 
          v-model="messageText"
          type="text"
          placeholder="Nhập tin nhắn..."
          @keyup.enter="handleSend"
        >
        
        <button class="btn-send" @click="handleSend">
          <img src="/frontend/assets/icons/send.png" alt="Gửi" class="send-icon">
        </button>
      </div>
    </div>

    <!-- Preview ảnh -->
    <div v-if="previewImage" class="image-preview-modal" @click="previewImage = null">
      <img :src="previewImage" alt="Preview">
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import MessageBubble from './MessageBubble.vue'

const props = defineProps({
  currentRoom: String,
  currentRoomName: String,
  messages: Array,
  loading: Boolean,
  currentUserId: String
})

const emit = defineEmits(['send-message', 'send-file'])

const messageText = ref('')
const messagesContainer = ref(null)
const fileInput = ref(null)
const previewImage = ref(null)

// Kiểm tra tin nhắn có phải của admin không
const isOwnMessage = (message) => {
  return message.senderId?._id === props.currentUserId
}

// Gửi tin nhắn text
const handleSend = () => {
  if (!messageText.value.trim()) return
  
  emit('send-message', messageText.value)
  messageText.value = ''
}

// Chọn file
const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')
  
  if (!isImage && !isVideo) {
    alert('⚠️ Chỉ hỗ trợ gửi ảnh hoặc video!')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target.result
    const type = isImage ? 'image' : 'video'
    emit('send-file', content, type)
  }
  reader.readAsDataURL(file)
  
  event.target.value = ''
}

// Preview ảnh
const handlePreviewImage = (imageUrl) => {
  previewImage.value = imageUrl
}

// Scroll xuống cuối khi có tin nhắn mới
watch(() => props.messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, { deep: true })
</script>

<style scoped>
.chat-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
}

.no-room-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.empty-icon {
  width: 80px;
  height: 80px;
  opacity: 0.3;
  margin-bottom: 20px;
}

.chat-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-panel-header {
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.room-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.room-info .avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #e63946;
}

.room-info h3 {
  margin: 0;
  color: #1D3557;
  font-size: 1.1rem;
}

.room-id {
  font-size: 0.8rem;
  color: #9ca3af;
  font-family: monospace;
}

.chat-panel-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.loading-indicator {
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
  padding: 10px;
}

.chat-panel-input {
  display: flex;
  gap: 10px;
  padding: 20px;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.btn-attach,
.btn-send {
  background: #f3f4f6;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-attach:hover,
.btn-send:hover {
  background: #e5e7eb;
}

.attach-icon,
.send-icon {
  width: 20px;
  height: 20px;
}

.btn-send {
  background: #e63946;
}

.btn-send:hover {
  background: #d00000;
}

.send-icon {
  filter: brightness(0) invert(1);
}

.chat-panel-input input[type="text"] {
  flex: 1;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
}

.chat-panel-input input[type="text"]:focus {
  outline: none;
  border-color: #e63946;
}

.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  cursor: pointer;
}

.image-preview-modal img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
}
</style>