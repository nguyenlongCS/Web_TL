// backend/routes/projects.js
import express from 'express'
import {
  getProjects,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getProjects)
router.get('/featured', getFeaturedProjects)
router.get('/:id', getProjectById)
router.post('/', protect, admin, createProject)
router.put('/:id', protect, admin, updateProject)
router.delete('/:id', protect, admin, deleteProject)

export default router