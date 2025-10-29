// backend/controllers/projectController.js
import Project from '../models/Project.js'

// @desc    Lấy tất cả dự án
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 })

    res.json({
      success: true,
      count: projects.length,
      projects
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Lấy dự án nổi bật
// @route   GET /api/projects/featured
// @access  Public
export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true })
      .sort({ value: -1 })
      .limit(3)

    res.json({
      success: true,
      count: projects.length,
      projects
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Lấy chi tiết dự án
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (project) {
      res.json({
        success: true,
        project
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy dự án' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Tạo dự án mới
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body)
    res.status(201).json({
      success: true,
      message: 'Tạo dự án thành công',
      project
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Cập nhật dự án
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (project) {
      res.json({
        success: true,
        message: 'Cập nhật dự án thành công',
        project
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy dự án' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Xóa dự án
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)

    if (project) {
      res.json({
        success: true,
        message: 'Xóa dự án thành công'
      })
    } else {
      res.status(404).json({ message: 'Không tìm thấy dự án' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}