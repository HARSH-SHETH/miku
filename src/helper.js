// CONTAINS HELPER FUNCTIONS REQUIRED BY OTHER FILES
const _ = require('./globals');

module.exports.filterGroups = function(groupChat){
  let bool = false;
  _.FILTER_GROUPS.forEach((groupName) => {
    if(groupChat.name.startsWith(groupName)){
      bool = true;
    }
  });
  return bool;
}

module.exports.prettyPrint = function(msg){
  return '```' + msg + '```'; 
}

// DELETE FOR EVERYONE AFTER GIVEN TIMEOUT
// USE THIS FUNCTION FOR BOT REPLIES 
// PREVENTS CHAT FROM BEING POLLUTED
// RETURNS PROMISE CONTAINING MESSAGE
// @param {msg} msg to be send
// @param {msgString} a String or MediaMessage.
// @param {timeout} timeinterval after which message should be deleted.
// @param {timeout} specify time in milliseconds after which msg should be deleted.
module.exports.sendAndDeleteAfter = async function(msg, msgString,msgSendOptions, timeout){
    if(msgSendOptions === undefined ){
      msgSendOptions = { sendSeen: false };
    }
    if(timeout === undefined){
      timeout = _.MSG_DEL_TIMEOUT;
    }

    let sendMsg = await msg.reply(msgString, undefined, msgSendOptions);
    // DELETE FOR EVERYONE AFTER SPECIFIED TIMEOUT
    setTimeout(() => {
      sendMsg.delete(true);
    }, timeout);
}
