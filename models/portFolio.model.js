const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PortfolioItemSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  src: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: false
  },
  videoUrl: {
    type: String,
    required: true
  },
  isYoutube: {
    type: Boolean,
    required: true,
    default: false
  },
  isLatest: {
    type: Boolean,
    default: false
  },
  isArchive: {
    type: Boolean,
    default: false
  },
});

const PortfolioModel = mongoose.model('Portfolio', PortfolioItemSchema);

module.exports = PortfolioModel;
