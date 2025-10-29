// backend/middleware/auth.js
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Protect routes - yêu cầu đăng nhập
export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Lấy user từ token (không lấy password)
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.error(error)
      res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ' })
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không có quyền truy cập, không có token' })
  }
}

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'Không có quyền truy cập, chỉ admin mới được phép' })
  }
}