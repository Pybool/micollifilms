const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HomePageSchema = new Schema({
  bannerImages: {
    type: String,
    required: false
  },
  motto: {
    type: String,
    required: false
  },

  bannerMainFloatText: {
    type: String,
    required: true
  },
  bannerSubFloatText: {
    type: String,
    required: true
  },
  aboutUsText: {
    type: String,
    required: true
  },
  carouselSliderVideoUrls: [String],
  latestFromPortFolioVideos: []
});

const HomePageModel = mongoose.model('HomePage', HomePageSchema);

module.exports = HomePageModel;
