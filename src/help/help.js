const HELP_MSG = require('./helpMessages');

const { prettyPrint, sendAndDeleteAfter } = require('../helper');

module.exports = function(msg, command){
  try{
    if(command === undefined){
      sendAndDeleteAfter(msg, prettyPrint(HELP_MSG.HELP));
      return;
    }
    for(let [key, message] of Object.entries(HELP_MSG)){
      if(command.includes(key.toLowerCase())){
        sendAndDeleteAfter(msg, prettyPrint(message));
        return;
      }
    }
  }catch(e){
    console.trace(e);
  }
}
