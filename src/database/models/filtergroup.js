const mongoose = require('mongoose')

const filterGroupSchema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model('FilterGroups', filterGroupSchema);
