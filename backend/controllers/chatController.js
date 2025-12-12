// backend/controllers/chatController.js
// Controller xử lý chat
import Message from '../models/Message.js'

// @desc    Lấy danh sách tin nhắn trong phòng chat
// @route   GET /api/chat/messages/:roomId
// @access  Public
export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params
    const { limit = 50 } = req.query

    const messages = await Message.find({ roomId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('senderId', 'name role')

    // Đảo ngược để hiển thị từ cũ đến mới
    const sortedMessages = messages.reverse()

    res.json({
      success: true,
      messages: sortedMessages
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Gửi tin nhắn
// @route   POST /api/chat/messages
// @access  Public
export const sendMessage = async (req, res) => {
  try {
    const { roomId, senderName, senderRole, messageType, content } = req.body

    if (!roomId || !senderName || !senderRole || !content) {
      return res.status(400).json({ message: 'Thiếu thông tin tin nhắn' })
    }

    const message = await Message.create({
      roomId,
      senderId: req.user ? req.user._id : null,
      senderName,
      senderRole,
      messageType: messageType || 'text',
      content,
      isRead: false
    })

    await message.populate('senderId', 'name role')

    // Phát sự kiện socket cho phòng hiện tại
    if (req.io) {
      req.io.to(roomId).emit('new_message', message)
      
      // Phát sự kiện cho admin (room 'admin_notifications')
      req.io.to('admin_notifications').emit('new_message', message)
    }

    res.status(201).json({
      success: true,
      message
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Đánh dấu tin nhắn đã đọc
// @route   PUT /api/chat/messages/:roomId/read
// @access  Private/Admin/Employee
export const markAsRead = async (req, res) => {
  try {
    const { roomId } = req.params

    await Message.updateMany(
      { roomId, isRead: false },
      { isRead: true }
    )

    res.json({
      success: true,
      message: 'Đã đánh dấu đọc'
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Lấy danh sách phòng chat (cho admin/employee)
// @route   GET /api/chat/rooms
// @access  Private/Admin/Employee
export const getChatRooms = async (req, res) => {
  try {
    // Lấy tất cả roomId duy nhất
    const rooms = await Message.aggregate([
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$roomId',
          lastMessage: { $first: '$content' },
          lastMessageType: { $first: '$messageType' },
          lastMessageTime: { $first: '$createdAt' },
          senderName: { $first: '$senderName' },
          unreadCount: {
            $sum: {
              $cond: [{ $eq: ['$isRead', false] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      }
    ])

    res.json({
      success: true,
      rooms
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}