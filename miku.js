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

  msg.reply('rehne do ye scheme tumhare liye nhi hai');
  return;

  let chat = await msg.getChat();
  console.log('chat object', chat);
  // RETURN IF NOT IN A GROUP
  if(!chat.isGroup){
    msg.reply('you need to be in a group to use this command');
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
  `
  msg.reply(commands);
}
