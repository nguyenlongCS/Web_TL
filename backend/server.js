// backend/server.js
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'

// Load environment variables
dotenv.config({ path: './backend/.env' })

// Kết nối MongoDB
connectDB()

// Khởi tạo Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Backend is running!',
    timestamp: new Date().toISOString()
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    mongodb: 'Connected',
    port: process.env.PORT
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 http://localhost:${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
})