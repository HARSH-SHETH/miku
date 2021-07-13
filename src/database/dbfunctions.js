const filterGroupsModel = require('./models/filtergroup');
const _ = require('../globals');

const db = {};

// ADD NEW GROUP TO FILTER
db.addGroup = function(groupName, callback){
  const newGroup = new filterGroupsModel({ name: groupName });
  newGroup.save((err, group) => {
    if(err){
      console.error('Failed to add new group to database');
      return err;
    }else{
      console.log('group added to filter database', group);
      callback();
    }
  })
}

db.getAllGroups = function(callback){
  filterGroupsModel.find({}, (err, groups) => {
    if(!err && groups != null){
      callback(groups);
    }
  });
}

db.removeGroup = function(groupName, callback) {
  filterGroupsModel.findOneAndDelete({ name: groupName }, (err, group) => {
    if(!err) {
      console.log('group deleted', group);
    }
    callback();
  })
}
module.exports = db;
