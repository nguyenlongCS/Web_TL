// backend/server.js
import express from 'express'
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

dotenv.config({ path: './backend/.env' })
connectDB()

const app = express()

// CORS configuration - CHO PHÉP FRONTEND GỌI API
app.use(cors({
  origin: 'http://localhost:5175', // Vite default port
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
      reviews: '/api/reviews'
    }
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/reviews', reviewRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log('=================================')
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 http://localhost:${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
  console.log('=================================')
})