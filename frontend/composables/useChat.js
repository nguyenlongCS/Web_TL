// frontend/composables/useChat.js
// Composable quản lý chat với Socket.IO
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import api from '../utils/api'
import { useAuth } from './useAuth'

const socket = ref(null)
const messages = ref([])
const rooms = ref([])
const currentRoom = ref(null)
const loading = ref(false)
const connected = ref(false)

export function useChat() {
  const { currentUser, isLoggedIn } = useAuth()

  // Tạo roomId duy nhất cho user
  const roomId = computed(() => {
    if (isLoggedIn.value && currentUser.value) {
      return `user_${currentUser.value._id}`
    }
    // Guest chat - tạo ID tạm thời lưu trong localStorage
    let guestId = localStorage.getItem('guestChatId')
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('guestChatId', guestId)
    }
    return guestId
  })

  // Thông tin người gửi
  const senderInfo = computed(() => {
    if (isLoggedIn.value && currentUser.value) {
      return {
        name: currentUser.value.name,
        role: currentUser.value.role
      }
    }
    return {
      name: 'Khách',
      role: 'guest'
    }
  })

  // Kết nối Socket.IO
  const connect = () => {
    if (socket.value) return

    socket.value = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true
    })

    socket.value.on('connect', () => {
      console.log('✅ Connected to chat server')
      connected.value = true
      
      // Admin tự động join room nhận thông báo
      if (currentUser.value && currentUser.value.role === 'admin') {
        socket.value.emit('join_room', 'admin_notifications')
        console.log('👤 Admin joined notifications room')
      }
      
      // Join room hiện tại
      if (currentRoom.value) {
        socket.value.emit('join_room', currentRoom.value)
      }
    })

    socket.value.on('disconnect', () => {
      console.log('❌ Disconnected from chat server')
      connected.value = false
    })

    // Nhận tin nhắn mới
    socket.value.on('new_message', (message) => {
      // Chỉ thêm tin nhắn nếu đang trong phòng đó hoặc là admin
      if (currentRoom.value === message.roomId || 
          (currentUser.value && currentUser.value.role === 'admin')) {
        // Kiểm tra tin nhắn đã tồn tại chưa
        const exists = messages.value.find(m => m._id === message._id)
        if (!exists) {
          messages.value.push(message)
        }
      }
    })
  }

  // Ngắt kết nối
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      connected.value = false
    }
  }

  // Join phòng chat
  const joinRoom = (room) => {
    currentRoom.value = room
    if (socket.value && connected.value) {
      socket.value.emit('join_room', room)
    }
  }

  // Leave phòng chat
  const leaveRoom = () => {
    if (socket.value && currentRoom.value) {
      socket.value.emit('leave_room', currentRoom.value)
    }
    currentRoom.value = null
  }

  // Load tin nhắn
  const loadMessages = async (room) => {
    loading.value = true
    try {
      const { data } = await api.get(`/chat/messages/${room}`)
      if (data.success) {
        messages.value = data.messages
      }
    } catch (error) {
      console.error('Lỗi load tin nhắn:', error)
    } finally {
      loading.value = false
    }
  }

  // Gửi tin nhắn
  const sendMessage = async (content, messageType = 'text') => {
    if (!content || !currentRoom.value) return

    try {
      const { data } = await api.post('/chat/messages', {
        roomId: currentRoom.value,
        senderName: senderInfo.value.name,
        senderRole: senderInfo.value.role,
        messageType,
        content
      })

      if (!data.success) {
        throw new Error('Gửi tin nhắn thất bại')
      }
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error)
      throw error
    }
  }

  // Load danh sách phòng chat (admin/employee)
  const loadRooms = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/chat/rooms')
      if (data.success) {
        rooms.value = data.rooms
      }
    } catch (error) {
      console.error('Lỗi load danh sách phòng:', error)
    } finally {
      loading.value = false
    }
  }

  // Đánh dấu đã đọc
  const markAsRead = async (room) => {
    try {
      await api.put(`/chat/messages/${room}/read`)
    } catch (error) {
      console.error('Lỗi đánh dấu đã đọc:', error)
    }
  }

  // Cleanup khi component unmount
  onUnmounted(() => {
    leaveRoom()
    disconnect()
  })

  return {
    socket,
    messages,
    rooms,
    currentRoom,
    roomId,
    senderInfo,
    loading,
    connected,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    loadMessages,
    sendMessage,
    loadRooms,
    markAsRead
  }
}