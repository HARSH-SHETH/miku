const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');
const { filterGroups } = require('../helper');
const fs = require('fs');
const { spawn } = require('child_process');
const _ = require('../globals');

const categories = {
  sfw: [
    'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 
    'hug', 'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 
    'blush', 'smile', 'wave', 'highfive', 'handhold', 'nom', 'bite', 
    'glomp', 'slap', 'kill', 'kick', 'happy', 'wink', 'poke', 'dance', 'cringe',
    'random',
  ],
  nsfw: ['waifu', 'neko', 'trap', 'blowjob', 'random'],
}


const urlPrefix = 'https://api.waifu.pics'

module.exports = async function sendWaifu(msg){
  // NO WAIFUS FOR BLOCKED GROUPS
  let chat = await msg.getChat();
  if(filterGroups(chat)){
    msg.reply('Command not available in this group');
    return;
  }
  let url = _processCommand(msg);
  if(url === null) return;  // COMMAND WAS !miku sfw, CATEGORIES ALREADY SENT
  console.log(url);
  try{
    let response = await axios.get(url);
    url = response.data.url;
    let img = await axios.get(url, { responseType: 'arraybuffer' });
    let base64encodedImage = Buffer.from(img.data, 'binary').toString('base64');
    let mimeType = 'image/' + url.slice(url.lastIndexOf('.')+1); 
    let filename = url.slice(url.lastIndexOf('/')+3);
    let messageSendOptions = { caption: url};
    let media = new MessageMedia(mimeType, base64encodedImage, null);
    if(mimeType === 'image/gif'){
      let success = await _convertGifToMp4(img.data, filename);
      mimeType = 'video/mp4';
      if(success){
        base64encodedImage = fs.readFileSync(`${__dirname}/vidgif.mp4`, { encoding: 'base64' })
        media = new MessageMedia(mimeType, base64encodedImage, null)
      }
      messageSendOptions = { sendVideoAsGif: true, caption: url, media: media };
    }
    msg.reply(media, undefined, messageSendOptions);
    fs.rm(`${__dirname}/${filename}`, () => {})
  }catch(err){
    msg.reply('```error occured```');
    console.error(err);
  }
}

// SEND CATEGORIES ARRAY [SFW ONLY]
function _sendCategories(msg, type){
  let text = "```";
  categories[type].forEach((category) => {
    text += `[${category}], `
  });
  text += '```';
  msg.reply(text);
}

// RETURN PROCESSESED URL FOR DOWNLOADING MEDIA
function _processCommand(msg){
  let type = msg.body.split(' ')[1];
  if(type != 'sfw' && type != 'nsfw'){
    msg.reply('INVALID TYPE');
    return null;
  }
  let category = msg.body.split(' ')[2];
  if(category === 'random'){
    // GET A RANDOM CATEGORY OF TYPE ${TYPE}
    category = categories[type][Math.floor( Math.random() * (categories[type].length - 1) )];
  }else if(category === undefined){
    _sendCategories(msg, type);
    return null;
  }else{
    let wrongCategory = false;
    categories[type].forEach((c) => {
      if(c === category){
        wrongCategory = true;
      }
    })
    if(!wrongCategory){
      msg.reply(singleLineString`\`\`\`No such category
        Plz type ${_.BOT_COMMAND} ${type} to see list of categories\`\`\``);
      return null
    }
  }
  let url = `${urlPrefix}/${type}/${category}`;
  return url;
}

function _convertGifToMp4(gifData, filename){
  return new Promise(function(resolve, reject){
    fs.writeFileSync(`${__dirname}/${filename}`, gifData, 'binary');

    let args = [
      '-y',
      '-i', 
      `'${__dirname}/${filename}'`,  
      '-pix_fmt yuv420p', 
      '-movflags +faststart', 
      '-c:v libx264', 
      '-filter:v crop=\'floor(in_w/2)*2:floor(in_h/2)*2\'', ' vidgif.mp4'
    ]; 

    const ff = spawn('ffmpeg', args, { shell: '/usr/bin/bash', cwd: __dirname });
    ff.on('close', (code) => {
      if(code == 0){
        resolve(true);
      }else{
        reject(false);
      }
    });
  });
}

function singleLineString(strings, ...values) {
  // Interweave the strings with the
  // substitution vars first.
  let output = '';
  for (let i = 0; i < values.length; i++) {
    output += strings[i] + values[i];
  }
  output += strings[values.length];

  // Split on newlines.
  let lines = output.split(/(?:\r\n|\n|\r)/);

  // Rip out the leading whitespace.
  return lines.map((line) => {
    return line.replace(/^\s+/gm, '');
  }).join('\n').trim();
}

