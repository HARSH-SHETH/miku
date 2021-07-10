// HANDLE ALL BOT COMMANDS 
const _ = require('./globals');
module.exports.handleMessages = function(msg, client) {
  if(msg.body.startsWith(_.BOT_COMMAND)){
    parseMsg(msg, client)
  }
}

function parseMsg(msg, client){
  let body = msg.body;
  switch(body){
    case _.EVERYONE: {
      tagEveryone(msg, client);
    }
  }
}

async function tagEveryone(msg, client, excludeArray){
  if(excludeArray === undefined){
    excludeArray = [];
  }

  let chat = await msg.getChat();
  console.log('chat object', chat);
  let text = "";
  let mentions = [];

  for(let participant of chat.participants) {
    const contact = await client.getContactById(participant.id._serialized);

    mentions.push(contact);
    text += `@${participant.id.user} `;
  }

  chat.sendMessage(text, { mentions });
}
