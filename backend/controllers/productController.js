// backend/controllers/productController.js
import Product from '../models/Product.js'

// @desc    Lấy tất cả sản phẩm (có filter & sort)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, sort, rating } = req.query
    
    // Build query
    let query = {}
    
    // Filter theo category
    if (category && category !== 'all') {
      query.category = category
    }

    // Tìm products
    let products = await Product.find(query)

    // Sort theo giá
    if (sort === 'asc') {
      products.sort((a, b) => a.price - b.price)
    } else if (sort === 'desc') {
      products.sort((a, b) => b.price - a.price)
    }

    // Sort theo rating
    if (rating === 'high') {
      products.sort((a, b) => b.rating - a.rating)
    } else if (rating === 'low') {
      products.sort((a, b) => a.rating - b.rating)
    }

    res.json({
      success: true,
      count: products.length,
      products
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Lấy sản phẩm nổi bật (top 3)
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ rating: -1 })
      .limit(3)

    res.json({
      success: true,
      products
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Lấy chi tiết sản phẩm
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      res.json({
        success: true,
        product
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Tạo sản phẩm mới
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      product
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (product) {
      res.json({
        success: true,
        message: 'Cập nhật sản phẩm thành công',
        product
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (product) {
      res.json({
        success: true,
        message: 'Xóa sản phẩm thành công'
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}