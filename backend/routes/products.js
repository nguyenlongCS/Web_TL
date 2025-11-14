// backend/routes/products.js
// Routes cho sản phẩm - cập nhật quyền sửa/xóa cho employee
import express from 'express'
import {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js'
import { protect, admin, employeeOrAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/featured', getFeaturedProducts)
router.get('/:id', getProductById)
router.post('/', protect, employeeOrAdmin, createProduct)
router.put('/:id', protect, employeeOrAdmin, updateProduct)
router.delete('/:id', protect, employeeOrAdmin, deleteProduct)

export default router