const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AboutUsSchema = new Schema({
  bannerImage: {
    image: {
      type: String,
      required: true
    },
    page: {
      type: String,
      required: true
    }
  },
  bannerSubFloatText: {
    type: String,
    required: false
  },
  aboutUsSideText: {
    type: String,
    required: false
  },
  aboutUsCarousel: [
    {
      imageSrc: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  ],
  aboutUsTeam: [
    {
      name: {
        type: String,
        required: true
      },
      src: {
        type: String,
        required: true
      }
    }
  ]
});

const AboutUsModel = mongoose.model('AboutUs', AboutUsSchema);

module.exports = AboutUsModel;
