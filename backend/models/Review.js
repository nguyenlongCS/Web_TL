// backend/models/Review.js
import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  author: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  starsText: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  approved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Review = mongoose.model('Review', reviewSchema)
export default Review