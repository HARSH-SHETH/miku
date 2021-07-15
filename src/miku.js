// HANDLE ALL BOT COMMANDS 
const _ = require('./globals');
const waifu = require('./waifu/waifu');
const { filterGroups, prettyPrint } = require('./helper');
const db = require('./database/dbfunctions');

const emojiStrip = require('emoji-strip');

module.exports.parseMsg = function(msg, client){
  let body = msg.body;
  switch(body){
    case _.EVERYONE: {
      tagEveryone(msg, client);
      break;
    }
    case _.BOT_COMMAND: {
      printCommands(msg);
      break;
    }
    case _.REVEAL_COMMAND: {
      revealMessage(msg);
      break;
    }
    case _.BLOCK_GROUP: {
      blockGroup(msg);
      break;
    }
    case _.UNBLOCK_GROUP: {
      unblockGroup(msg);
      break;
    }
    default: {
      if(body.startsWith(_.SFW_WAIFU_COMMAND) || body.startsWith(_.NSFW_WAIFU_COMMMAND)){
        waifu(msg);
      }
    }
    
  }
}

async function tagEveryone(msg, client){
  console.log(msg);

  let chat = await msg.getChat();
  console.log('chat object', chat);
  // RETURN IF NOT IN A GROUP
  if(!chat.isGroup){
    msg.reply(prettyPrint(_.REPLIES.NOTGROUP));
    return;
  }

  if(filterGroups(chat)){
    msg.reply(prettyPrint(_.REPLIES.UNAVAIL));
    return;
  }

  let text = "";
  let mentions = [];

  for(let participant of chat.participants) {
    const contact = await client.getContactById(participant.id._serialized);

    mentions.push(contact);
    text += `@${participant.id.user} `;
  }

  chat.sendMessage(text, { mentions });
}

function printCommands(msg){
  let commands = `
[!miku]  - show all commands.

[!minna] - tag everyone.

[!miku sfw] - print categories.
  ---> [!miku sfw <category>]

[!miku reveal] - reveal last 
                 deleted chat.

[!miku block] - restrict access.

[!miku unblock] - allow access.

Source Code: https://github.com/harsh-sheth/miku
Submit Ideas: https://github.com/HARSH-SHETH/miku/discussions/2
Wiki: https://github.com/HARSH-SHETH/miku/wiki/Bot-Commands
`
  msg.reply(prettyPrint(commands));
}


// BLOCK GROUPS TO USE CERTAIN COMMANDS
async function blockGroup(msg){
  if(!msg.fromMe){
    msg.reply(prettyPrint(_.REPLIES.PRIVILEGE));
    return;
  }
  let chat = await msg.getChat(); 
  if(!chat.isGroup){
    msg.reply(prettyPrint(_.REPLIES.NOTGROUP));
    return;
  }
  let groupName = emojiStrip(chat.name);
  _.FILTER_GROUPS.forEach((group) => {
    if(group == groupName){
      return;
    }
  });
  db.addGroup(groupName, function(){
    _.FILTER_GROUPS.push(groupName);
    msg.reply(prettyPrint(_.REPLIES.BLOCKED));
    console.log(_.FILTER_GROUPS);
  });
}

// UNBLOCK GROUP
async function unblockGroup(msg){
  if(!msg.fromMe){
    msg.reply(prettyPrint(_.REPLIES.PRIVILEGE))
    return;
  }
  let chat = await msg.getChat(); 
  if(!chat.isGroup){
    msg.reply(prettyPrint(_.REPLIES.NOTGROUP));
    return;
  }
  let groupName = emojiStrip(chat.name);
  db.removeGroup(groupName, () => {
    _.FILTER_GROUPS.forEach(function(group, i){
      if(group == groupName){
        // REMOVE GROUP FROM FILTER_GROUPS ARRAY
        this.splice(i, 1)
        console.log(_.FILTER_GROUPS);
        msg.reply(prettyPrint(_.REPLIES.UNBLOCKED));
        return;
      }
    }, _.FILTER_GROUPS);
  });
}

async function revealMessage(msg) {
  // _.DELETEDMESSAGE[msg.]
  let chat = await msg.getChat();
  let deletedMessage = _.DELETEDMESSAGE[chat.name];
  if(deletedMessage === undefined){
    msg.reply(prettyPrint(_.REPLIES.NO_DEL_MSG));
  }else{
    // GROUPNAME IMPLIES TO TITLE CHAT NAME
    let groupName = emojiStrip(chat.name);
    let replyMessage = '[Last Deleted Message]\nMessage: ' + 
      _.DELETEDMESSAGE[groupName].message + "\nFrom: " +
      _.DELETEDMESSAGE[groupName].from.toString();
    msg.reply(prettyPrint(replyMessage));
  }
}
