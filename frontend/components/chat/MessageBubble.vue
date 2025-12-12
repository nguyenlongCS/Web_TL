<!-- frontend/components/chat/MessageBubble.vue -->
<!-- Component hiển thị một tin nhắn - fix logic xác định tin nhắn của mình -->

<template>
  <div :class="['message-bubble', isOwn ? 'own' : 'other']">
    <div class="message-sender" v-if="!isOwn">
      {{ message.senderName }}
    </div>
    
    <div class="message-content">
      <!-- Tin nhắn text -->
      <p v-if="message.messageType === 'text'">{{ message.content }}</p>
      
      <!-- Tin nhắn hình ảnh -->
      <img 
        v-else-if="message.messageType === 'image'" 
        :src="message.content" 
        alt="Image"
        class="message-image"
        @click="$emit('preview-image', message.content)"
      >
      
      <!-- Tin nhắn video -->
      <video 
        v-else-if="message.messageType === 'video'"
        :src="message.content"
        controls
        class="message-video"
      ></video>
    </div>
    
    <div class="message-time">
      {{ formatTime(message.createdAt) }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isOwn: {
    type: Boolean,
    default: false
  }
})

defineEmits(['preview-image'])

// Format thời gian
const formatTime = (dateStr) => {
  const date = new Date(dateStr)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
</script>

<style scoped>
.message-bubble {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  max-width: 70%;
}

.message-bubble.own {
  align-self: flex-end;
  align-items: flex-end;
}

.message-bubble.other {
  align-self: flex-start;
  align-items: flex-start;
}

.message-sender {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 5px;
  font-weight: 500;
}

.message-content {
  padding: 10px 15px;
  border-radius: 12px;
  word-wrap: break-word;
}

.message-bubble.own .message-content {
  background: #e63946;
  color: white;
}

.message-bubble.other .message-content {
  background: #f3f4f6;
  color: #1D3557;
}

.message-content p {
  margin: 0;
  line-height: 1.4;
}

.message-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  cursor: pointer;
  display: block;
}

.message-video {
  max-width: 300px;
  max-height: 200px;
  border-radius: 8px;
  display: block;
}

.message-time {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 3px;
}
</style>