// GLOBALS
const _ = require('./globals');
const miku = require('./miku');

// node_modules_default
const fs = require('fs');

// whatsapp-web
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// LOAD THE SESSION DATA IF IT HAS BEEN SAVED PREVIOUSLY
let sessionData;
if(fs.existsSync(_.SESSION_FILE_PATH)){
  sessionData = require(_.SESSION_FILE_PATH);
  console.log(sessionData);
}

const client = new Client({ session: sessionData });

client.on('authenticated', (session) => {
  console.log('AUTHENTICATED_CLIENT');
  sessionData = session;
  fs.writeFile(_.SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    if(err) {
      console.log(err);
    }
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
  console.log(client)
  miku.handleMessages(msg, client);
})

client.initialize();
