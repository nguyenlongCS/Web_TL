// backend/models/Product.js
import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên sản phẩm'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Vui lòng chọn danh mục'],
    enum: ['loa', 'amply', 'phu-kien', 'khac']
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá'],
    min: 0
  },
  priceText: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  stock: {
    type: Number,
    required: [true, 'Vui lòng nhập số lượng'],
    min: 0,
    default: 0
  },
  imgSrc: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

const Product = mongoose.model('Product', productSchema)
export default Product