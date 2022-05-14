// GLOBALS
require("dotenv").config();
const { setStatus } = require("./server.js");
require("./src/database/connection");

// whatsapp-web
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const _ = require("./src/globals");
const miku = require("./src/miku");
const db = require("./src/database/dbfunctions");
const emojiStrip = require("emoji-strip");

const deleted = require("./src/database/models/deleted");

// LOAD THE SESSION DATA IF IT HAS BEEN SAVED PREVIOUSLY
// let sessionData = JSON.parse(process.env.WW_SESSION || null);

const puppeteerOptions = {
  headless: process.env.HEADLESS ?? false,
  args: ["--no-sandbox"],
  // executablePath: process.env.CHROME_PATH ?? "/opt/google/chrome/chrome",
};

const client = new Client({ authStrategy: new LocalAuth(), qrTimeoutMs: 0 ,puppeteer: puppeteerOptions, clientId: 'mikubot'});

client.on('authenticated', () => {
  console.log('AUTHENTICATED_CLIENT');
  setStatus('AUTHENTICATED_CLIENT')
  // PRINT SESSION AS JSON FOR FIRST TIME CONNECTIONS
  // process.env.WW_SESSION ?? console.log(JSON.stringify(session));
  db.getAllGroups(function(groups){
    groups.forEach((group) => {
      _.FILTER_GROUPS.push(group.name);
    });
  });
});

client.on("auth_failure", (msg) => {
  console.log("AUTHENTICATION_FAILURE", msg);
  setStatus("AUTHENTICATION_FAILURE");
  process.exit(_.CODES.AUTHENTICATION_ERROR);
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("QR_RECIEVED", qr);
});

client.on("ready", () => {
  setStatus("MIKU IS READY");
  console.log("client is ready");
});

client.on("message_create", (msg) => {
  miku.parseMsg(msg, client);
});

client.on("disconnected", (reason) => {
  console.log("disconnected due to", reason);
  setStatus("DISCONNECTED");
  process.exit(_.CODES.DISCONNECTED);
});

client.on("change_state", (state) => {
  setStatus(state);
  console.log("state changed", state);
});

// STORE DELETED CHATS
client.on("message_revoke_everyone", async (after, before) => {
  if (before.fromMe) {
    return;
  } else if (!before.status && before.type === "chat") {
    let chat = await after.getChat();
    let author = before.author ?? before.from;
    let authorName = null;
    if (chat.isGroup) {
      for (participant of chat.participants) {
        if (parseInt(participant.id.user) === parseInt(author)) {
          let contact = await client.getContactById(participant.id._serialized);
          authorName = contact.pushname;
          console.log(authorName);
        }
      }
    } 
    if (!_.DELETEDMESSAGE[emojiStrip(chat.name)])
      _.DELETEDMESSAGE[emojiStrip(chat.name)] = [];

    _.DELETEDMESSAGE[emojiStrip(chat.name)].unshift({
      message: before.body,
      from: authorName ? authorName : parseInt(author),
    });

    if (_.DELETEDMESSAGE[emojiStrip(chat.name)].length > 15)
      _.DELETEDMESSAGE[emojiStrip(chat.name)].pop();

    deleted
      .findOneAndUpdate(
        {},
        { $set: { messages: _.DELETEDMESSAGE } },
        { useFindAndModify: false }
      )
      .catch((err) => {
        console.log(err);
      });
  }
});

client.initialize().catch((err) => console.error(err));

// CATCH UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err) => {
  console.trace(`There was an uncaught exception`, err);
});
