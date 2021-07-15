// GLOBALS
require('dotenv').config();
require('./src/database/connection');

// whatsapp-web
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const _ = require('./src/globals');
const miku = require('./src/miku');
const db = require('./src/database/dbfunctions');
const emojiStrip = require('emoji-strip');
const fs = require('fs');

// LOAD THE SESSION DATA IF IT HAS BEEN SAVED PREVIOUSLY
let sessionData = JSON.parse(process.env.WW_SESSION || null);
// LOAD THE LAST DELETED MESSAGE FOR EACH GROUP AND CONTACT FROM LAST DEPLOY
if(fs.existsSync('./deletedMessages.json')){
  _.DELETEDMESSAGE = require('./deletedMessages.json');
}
console.log(_.DELETEDMESSAGE);

const puppeteerOptions = {
  headless: true,
  args: ["--no-sandbox"],
  // executablePath: '/opt/google/chrome/chrome',
}

const client = new Client({ session: sessionData, puppeteer: puppeteerOptions });

client.on('authenticated', (session) => {
  console.log('AUTHENTICATED_CLIENT');
  db.getAllGroups(function(groups){
    groups.forEach((group) => {
      _.FILTER_GROUPS.push(group.name)
      console.log(_.FILTER_GROUPS);
    });
  })
  
});

client.on('auth_failure', (msg) => {
  console.log('AUTHENTICATION_FAILURE', msg);
})

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('QR_RECIEVED', qr)
});

client.on('ready', () => {
  console.log('client is ready');
});

client.on('message_create', msg => {
  miku.parseMsg(msg, client);
});

client.on('disconnected', (reason) => {
  console.log('disconnected due to', reason);
});

client.on('change_state', (state) => {
  console.log('state changed', state);
})

client.on('message_revoke_everyone', async (after, before) => {
  if(before.fromMe){
    return;
  }else if(!before.status && before.type === 'chat'){
    let chat = await after.getChat();
    let author = before.author ?? before.from;
    console.log(before, chat);
      _.DELETEDMESSAGE[emojiStrip(chat.name)] = {
        message: before.body,
        from: parseInt(author), 
      };
      console.log(_.DELETEDMESSAGE);
  }
})

process.on('exit', () => {
  fs.writeFileSync('./deletedMessages.json', JSON.stringify(_.DELETEDMESSAGE));
})


client.initialize();
