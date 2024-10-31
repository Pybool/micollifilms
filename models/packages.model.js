const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PackageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  imageSrc: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    required: true
  }],
  isArchive: {
    type: Boolean,
    default: false
  }
});

const PackageModel = mongoose.model('Package', PackageSchema);

module.exports = PackageModel;
