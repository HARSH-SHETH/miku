// CONTAINS HELPER FUNCTIONS REQUIRED BY OTHER FILES
const _ = require('./globals');

module.exports.filterGroups = function(groupChat){
  let bool = false;
  _.FILTER_GROUPS.forEach((groupName) => {
    if(groupChat.name.startsWith(groupName)){
      console.log(groupName,'$', groupChat.name);
      bool = true;
    }
  });
  return bool;
}

module.exports.prettyPrint = function(msg){
  return '```' + msg + '```'; 
}
