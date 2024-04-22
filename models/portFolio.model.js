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
  }
});

const PortfolioSchema = new Schema({
  shortNote: {
    type: String,
    required: false
  },
  portfolioItems: [PortfolioItemSchema]
});

const PortfolioModel = mongoose.model('Portfolio', PortfolioSchema);

module.exports = PortfolioModel;
