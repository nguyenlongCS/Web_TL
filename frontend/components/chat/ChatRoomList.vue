<!-- frontend/components/chat/ChatRoomList.vue -->
<!-- Component danh sách phòng chat cho admin -->

<template>
  <div class="chat-room-list">
    <div class="list-header">
      <h3>Danh sách tin nhắn</h3>
      <button class="btn-refresh" @click="$emit('refresh')">
        <img src="/frontend/assets/icons/refresh.png" alt="Làm mới" class="refresh-icon">
      </button>
    </div>

    <div v-if="loading" class="loading">
      Đang tải...
    </div>

    <div v-else-if="rooms.length === 0" class="empty">
      <p>Chưa có tin nhắn nào</p>
    </div>

    <div v-else class="rooms-container">
      <div 
        v-for="room in rooms" 
        :key="room._id"
        :class="['room-item', { active: room._id === selectedRoomId }]"
        @click="$emit('select-room', room._id)"
      >
        <div class="room-avatar">
          <img src="/frontend/assets/icons/user-avatar.png" alt="Avatar">
        </div>
        
        <div class="room-info">
          <div class="room-name">{{ room.senderName || 'Khách' }}</div>
          <div class="room-last-message">
            <span v-if="room.lastMessageType === 'image'">📷 Hình ảnh</span>
            <span v-else-if="room.lastMessageType === 'video'">🎥 Video</span>
            <span v-else>{{ truncateMessage(room.lastMessage) }}</span>
          </div>
        </div>
        
        <div class="room-meta">
          <div class="room-time">{{ formatTime(room.lastMessageTime) }}</div>
          <div v-if="room.unreadCount > 0" class="unread-badge">
            {{ room.unreadCount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rooms: {
    type: Array,
    default: () => []
  },
  selectedRoomId: String,
  loading: Boolean
})

defineEmits(['select-room', 'refresh'])

// Cắt ngắn tin nhắn
const truncateMessage = (message) => {
  if (!message) return ''
  return message.length > 40 ? message.substring(0, 40) + '...' : message
}

// Format thời gian
const formatTime = (dateStr) => {
  if (!dateStr) return ''
  
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  
  // Trong ngày hôm nay
  if (diff < 86400000 && date.getDate() === now.getDate()) {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }
  
  // Trong tuần
  if (diff < 604800000) {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    return days[date.getDay()]
  }
  
  // Cũ hơn
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}
</script>

<style scoped>
.chat-room-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-right: 1px solid #e5e7eb;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.list-header h3 {
  margin: 0;
  color: #1D3557;
  font-size: 1.2rem;
}

.btn-refresh {
  background: #f3f4f6;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.btn-refresh:hover {
  background: #e5e7eb;
}

.refresh-icon {
  width: 20px;
  height: 20px;
}

.loading,
.empty {
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
}

.rooms-container {
  flex: 1;
  overflow-y: auto;
}

.room-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f3f4f6;
}

.room-item:hover {
  background: #f9fafb;
}

.room-item.active {
  background: #fee2e2;
}

.room-avatar {
  flex-shrink: 0;
}

.room-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e63946;
}

.room-info {
  flex: 1;
  min-width: 0;
}

.room-name {
  font-weight: 600;
  color: #1D3557;
  margin-bottom: 4px;
  font-size: 0.95rem;
}

.room-last-message {
  color: #6b7280;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.room-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.room-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.unread-badge {
  background: #e63946;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}
</style>