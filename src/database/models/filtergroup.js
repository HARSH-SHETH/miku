const mongoose = require('mongoose')

const filterGroupSchema = new mongoose.Schema({
  name: String,
});

const FilterGroupsModel = mongoose.model('FilterGroups', filterGroupSchema);

// const newGroup = new FilterGroupsModel({
//   name: 'CSE DD Family'
// });

// newGroup.save((err, group) => {
//   if(err){
//     console.log('error creating group');
//   }else{
//     console.log('group created successfully', group);
//   }
// });

// FilterGroupsModel.findOneAndDelete({ name: 'CSE DD Family' }, (err, group) => {
//   if(err) { console.log('error deleting group'); }
//   else { console.log('deleted group', group); }
// });

module.exports = FilterGroupsModel;
