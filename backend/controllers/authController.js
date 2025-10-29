// backend/controllers/authController.js
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// @desc    Đăng ký user mới
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    // Kiểm tra user đã tồn tại chưa
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email đã được sử dụng' })
    }

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password,
      phone
    })

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token: generateToken(user._id)
      })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Tìm user theo email
    const user = await User.findOne({ email })

    // Kiểm tra user và password
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token: generateToken(user._id)
      })
    } else {
      res.status(401).json({ 
        success: false,
        message: 'Email hoặc mật khẩu không đúng' 
      })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json({
      success: true,
      user
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Cập nhật profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.phone = req.body.phone || user.phone
      
      if (req.body.password) {
        user.password = req.body.password
      }

      const updatedUser = await user.save()

      res.json({
        success: true,
        message: 'Cập nhật thành công',
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role
        },
        token: generateToken(updatedUser._id)
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy user' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}