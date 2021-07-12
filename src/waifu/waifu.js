const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');
const { filterGroups } = require('../helper');

const categories = {
  sfw: [
    'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 
    'hug', 'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 
    'blush', 'smile', 'wave', 'highfive', 'handhold', 'nom', 'bite', 
    'glomp', 'slap', 'kill', 'kick', 'happy', 'wink', 'poke', 'dance', 'cringe',
  ],
  nsfw: ['waifu', 'neko', 'trap', 'blowjob'],
}


const urlPrefix = 'https://api.waifu.pics'

module.exports = async function sendWaifu(msg){
  // NO WAIFUS FOR BLOCKED GROUPS
  let chat = await msg.getChat();
  if(filterGroups(chat)){
    msg.reply('Command not available in this group');
    return;
  }
  let type = msg.body.split(' ')[1];
  let category = msg.body.split(' ')[2];
  if(category === undefined){
    // GET A RANDOM CATEGORY OF TYPE ${TYPE}
    category = categories[type][Math.floor(Math.random() * categories[type].length)];
  }
  let url = `${urlPrefix}/${type}/${category}`;
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
