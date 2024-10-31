const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AboutUsSchema = new Schema({
  bannerImage: {
    type: String,
    required: true
  },
 
});

const AboutUsModel = mongoose.model('AboutUs', AboutUsSchema);

module.exports = AboutUsModel;
