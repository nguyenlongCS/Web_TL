// backend/models/Project.js
import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  imgSrc: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  completedDate: {
    type: Date,
    default: Date.now
  },
  client: {
    type: String,
    default: ''
  },
  value: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const Project = mongoose.model('Project', projectSchema)
export default Project