// GLOBALS
require('dotenv').config();
require('./src/database/connection');

// whatsapp-web
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const _ = require('./src/globals');
const miku = require('./src/miku');
const db = require('./src/database/dbfunctions');

// LOAD THE SESSION DATA IF IT HAS BEEN SAVED PREVIOUSLY
let sessionData = JSON.parse(process.env.WW_SESSION || null);

const puppeteerOptions = {
  headless: true,
  args: ["--no-sandbox"],
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


client.initialize();
