const mongoose = require('mongoose')

const deleted = new mongoose.Schema({
  messages:{},
  blacklist:{}
});


module.exports = mongoose.model('messages', deleted);
