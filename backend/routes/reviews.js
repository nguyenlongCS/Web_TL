// backend/routes/reviews.js
import express from 'express'
import {
  getReviews,
  createReview,
  approveReview,
  deleteReview
} from '../controllers/reviewController.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getReviews)
router.post('/', createReview)
router.put('/:id/approve', protect, admin, approveReview)
router.delete('/:id', protect, admin, deleteReview)

export default router