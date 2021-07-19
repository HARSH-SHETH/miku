const mongoose = require('mongoose')

const deleted = new mongoose.Schema({
  messages:{}
});

module.exports = mongoose.model('messages', deleted);
