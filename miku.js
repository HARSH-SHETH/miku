// HANDLE ALL BOT COMMANDS 
const _ = require('./globals');

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
Source Code: https://github.com/harsh-sheth/miku
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
