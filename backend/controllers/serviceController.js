// backend/controllers/serviceController.js
import Service from '../models/Service.js'

// @desc    Lấy tất cả dịch vụ
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ order: 1 })

    res.json({
      success: true,
      count: services.length,
      services
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Lấy chi tiết dịch vụ
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)

    if (service) {
      res.json({
        success: true,
        service
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy dịch vụ' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Tạo dịch vụ mới
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body)
    res.status(201).json({
      success: true,
      message: 'Tạo dịch vụ thành công',
      service
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Cập nhật dịch vụ
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (service) {
      res.json({
        success: true,
        message: 'Cập nhật dịch vụ thành công',
        service
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy dịch vụ' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Xóa dịch vụ
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)

    if (service) {
      res.json({
        success: true,
        message: 'Xóa dịch vụ thành công'
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy dịch vụ' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}