// backend/models/Service.js
import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
  title: {
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
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Service = mongoose.model('Service', serviceSchema)
export default Service