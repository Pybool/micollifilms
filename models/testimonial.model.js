const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  imageName: {
    type: String,
    required: true
  },
  imageSrc: {
    type: String,
    required: true
  },
  testimonial: {
    type: String,
    required: true
  },
  isArchive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Testimonials', TestimonialSchema);
