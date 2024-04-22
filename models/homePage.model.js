const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HomePageSchema = new Schema({
  bannerImages: [
    {
      image: {
        type: String,
        required: true
      },
      page: {
        type: String,
        required: true
      }
    }
  ],
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
