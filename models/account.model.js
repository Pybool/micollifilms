const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const Accounts = mongoose.model('Accounts', accountSchema);
module.exports = Accounts;
