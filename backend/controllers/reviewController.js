// backend/controllers/reviewController.js
import Review from '../models/Review.js'

// @desc    Lấy tất cả đánh giá đã duyệt
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true })
      .sort({ createdAt: -1 })
      .populate('userId', 'name')

    res.json({
      success: true,
      count: reviews.length,
      reviews
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Tạo đánh giá mới
// @route   POST /api/reviews
// @access  Private (hoặc Public)
export const createReview = async (req, res) => {
  try {
    const { author, avatar, stars, text, productId } = req.body

    const starsText = '★'.repeat(stars) + '☆'.repeat(5 - stars)

    const review = await Review.create({
      userId: req.user ? req.user._id : null,
      author,
      avatar,
      stars,
      starsText,
      text,
      productId: productId || null,
      approved: false // Cần admin duyệt
    })

    res.status(201).json({
      success: true,
      message: 'Gửi đánh giá thành công, đang chờ duyệt',
      review
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Duyệt đánh giá
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (review) {
      review.approved = true
      await review.save()

      res.json({
        success: true,
        message: 'Đã duyệt đánh giá',
        review
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy đánh giá' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Xóa đánh giá
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)

    if (review) {
      res.json({
        success: true,
        message: 'Xóa đánh giá thành công'
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy đánh giá' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}