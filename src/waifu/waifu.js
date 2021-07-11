const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');
const { filterGroups } = require('../helper');

const categories = [
  'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 
  'hug', 'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 
  'blush', 'smile', 'wave', 'highfive', 'handhold', 'nom', 'bite', 
  'glomp', 'slap', 'kill', 'kick', 'happy', 'wink', 'poke', 'dance', 'cringe',
]

const urlPrefix = 'https://api.waifu.pics/sfw/'

module.exports = async function sendWaifu(msg, client){
  // NO WAIFUS FOR BLOCKED GROUPS
  let chat = await msg.getChat();
  if(filterGroups(chat)){
    msg.reply('Command not available in this group');
    return;
  }
  // let randomCategory = categories[Math.floor(Math.random() * categories.length)];
  let randomCategory = 'waifu';
  let url = urlPrefix + randomCategory;
  console.log(url);
  try{
    let response = await axios.get(url);
    url = response.data.url;
    let img = await axios.get(url, { responseType: 'arraybuffer' });
    let base64encodedImage = Buffer.from(img.data, 'binary').toString('base64');
    let mimeType = 'image/' + url.slice(url.lastIndexOf('.')+1); 
    msg.reply(new MessageMedia(mimeType, base64encodedImage, null));
  }catch(err){
    console.error(err);
  }
}
