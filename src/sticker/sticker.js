// HANDLE STICKER MAKING REQUEST

// PROCESS STICKER
module.exports = async function(msg){
  try{
    if(!msg.hasMedia){
      msg.reply('Plz attach a media file')
      return;
    }
    let media = await msg.downloadMedia();
    console.log(`media is: `, media);
    let messageSendOptions = {
      sendMediaAsSticker: true,
      sendSeen: false,
      media: media,
    }
    msg.reply(media, undefined, messageSendOptions);
  }catch(err){
    console.log('catched from sticker.js', err);
  }
}
