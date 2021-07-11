// HANDLE ALL BOT COMMANDS 
const _ = require('./globals');

const emojiStrip = require('emoji-strip');

module.exports.parseMsg = function(msg, client){
  let body = msg.body;
  switch(body){
    case _.EVERYONE: {
      tagEveryone(msg, client);
      break;
    }
    case _.BOT_COMMAND: {
      printCommands(msg, client);
      break;
    }
    case _.admin.BLOCK_GROUP: {
      blockGroup(msg, client);
      break;
    }
    case _.admin.UNBLOCK_GROUP: {
      unblockGroup(msg, client);
      break;
    }
  }
}

async function tagEveryone(msg, client, excludeArray){
  if(excludeArray === undefined){
    excludeArray = [];
  }
  console.log(msg);


  let chat = await msg.getChat();
  console.log('chat object', chat);
  // RETURN IF NOT IN A GROUP
  if(!chat.isGroup){
    msg.reply('you need to be in a group to use this command');
    return;
  }

  if(filterGroups(chat)){
    msg.reply('Command not available in this group');
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

function printCommands(msg, client){
  let commands = `
*!miku*  - show all commands.
*!minna* - tag everyone in the group.
*!miku block* - restrict access to special commands
*!miku unblock* - allow access to special commands
Source Code: https://github.com/harsh-sheth/miku
Submit Ideas: https://github.com/HARSH-SHETH/miku/discussions/2
  `
  msg.reply(commands);
}

function filterGroups(groupChat){
  let bool = false;
  _.FILTER_GROUPS.forEach((groupName) => {
    if(groupChat.name.startsWith(groupName)){
      console.log(groupName,'$', groupChat.name);
      bool = true;
    }
  })
  return bool;
}

// BLOCK GROUPS TO USE CERTAIN COMMANDS
async function blockGroup(msg, client){
  if(!msg.fromMe){
    msg.reply('You do not have privileges.')
    return;
  }
  let chat = await msg.getChat(); 
  if(!chat.isGroup){
    msg.reply('you need to be in a group to use this command')
    return;
  }
  let groupName = emojiStrip(chat.name);
  _.FILTER_GROUPS.forEach((group) => {
    if(group == groupName){
      return;
    }
  });
  _.FILTER_GROUPS.push(groupName);
  msg.reply('BLOCKED');
}

// UNBLOCK GROUP
async function unblockGroup(msg, client){
  if(!msg.fromMe){
    msg.reply('You do not have privileges.')
    return;
  }
  let chat = await msg.getChat(); 
  if(!chat.isGroup){
    msg.reply('you need to be in a group to use this command')
    return;
  }
  let groupName = emojiStrip(chat.name);
  _.FILTER_GROUPS.forEach(function(group, i){
    if(group == groupName){
      // REMOVE GROUP FROM FILTER_GROUPS ARRAY
      this.splice(i, 1)
      console.log(_.FILTER_GROUPS);
      msg.reply('UNBLOCKED')
      return;
    }
  }, _.FILTER_GROUPS);
}
