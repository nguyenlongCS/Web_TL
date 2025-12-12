<!-- frontend/components/chat/ChatWindow.vue -->
<!-- Component cửa sổ chat - fix logic xác định tin nhắn của user/guest -->

<template>
  <div v-if="isOpen" class="chat-window">
    <div class="chat-header">
      <img src="/frontend/assets/icons/chat.png" alt="Chat" class="chat-icon">
      <h3>Tin nhắn</h3>
      <button class="btn-close" @click="$emit('close')">
        <img src="/frontend/assets/icons/close.png" alt="Đóng" class="close-icon">
      </button>
    </div>

    <div class="chat-messages" ref="messagesContainer">
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

    <div class="chat-input">
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
  isOpen: Boolean,
  messages: Array,
  loading: Boolean,
  currentUserId: String,
  currentUserRole: String
})

const emit = defineEmits(['close', 'send-message', 'send-file'])

const messageText = ref('')
const messagesContainer = ref(null)
const fileInput = ref(null)
const previewImage = ref(null)

// Fix: Xác định tin nhắn có phải của mình không
// User đã login: so sánh senderId với currentUserId
// Guest: so sánh senderRole === 'guest'
const isOwnMessage = (message) => {
  // Nếu là user đã login và có senderId
  if (props.currentUserId && message.senderId?._id) {
    return message.senderId._id === props.currentUserId
  }
  
  // Nếu là guest
  if (props.currentUserRole === 'guest') {
    return message.senderRole === 'guest'
  }
  
  // Nếu là user đã login nhưng tin nhắn không có senderId
  // (trường hợp cũ hoặc lỗi data)
  return message.senderRole === 'user'
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
.chat-window {
  position: fixed;
  bottom: 100px;
  right: 100px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 9998;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #e63946;
  color: white;
  border-radius: 12px 12px 0 0;
  gap: 10px;
}

.chat-icon {
  width: 24px;
  height: 24px;
}

.chat-header h3 {
  flex: 1;
  margin: 0;
  font-size: 1.1rem;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.close-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}

.chat-messages {
  flex: 1;
  padding: 15px;
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

.chat-input {
  display: flex;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid #e5e7eb;
}

.btn-attach,
.btn-send {
  background: #f3f4f6;
  border: none;
  padding: 10px;
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

.chat-input input[type="text"] {
  flex: 1;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
}

.chat-input input[type="text"]:focus {
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