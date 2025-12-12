// backend/server.js
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

// Import routes
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import serviceRoutes from './routes/services.js'
import projectRoutes from './routes/projects.js'
import reviewRoutes from './routes/reviews.js'
import calendarRoutes from './routes/calendar.js'
import chatRoutes from './routes/chat.js'

dotenv.config({ path: './backend/.env' })
connectDB()

const app = express()
const httpServer = createServer(app)

// Socket.IO configuration
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5175',
    credentials: true
  }
})

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5175',
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Middleware để inject io vào req
app.use((req, res, next) => {
  req.io = io
  next()
})

// Socket.IO xử lý kết nối
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id)

  // Join room chat
  socket.on('join_room', (roomId) => {
    socket.join(roomId)
    console.log(`👤 ${socket.id} joined room: ${roomId}`)
  })

  // Leave room
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId)
    console.log(`👤 ${socket.id} left room: ${roomId}`)
  })

  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id)
  })
})

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🎉 API is running...',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      services: '/api/services',
      projects: '/api/projects',
      reviews: '/api/reviews',
      calendar: '/api/calendar',
      chat: '/api/chat'
    }
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/chat', chatRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log('=================================')
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 http://localhost:${PORT}`)
  console.log(`💬 Socket.IO enabled`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
  console.log('=================================')
})