// HANDLE STICKER MAKING REQUEST
const supportedDomainsArray = require('./supportedsite');
const { MessageMedia } = require('whatsapp-web.js');
const { spawn } = require('child_process');

// DEFAULT -SS VALUE TO USE IN FFMPEG COMMAND
let seekstart = "00:00:00";

// PROCESS STICKER
module.exports = async function(msg){
  try{
    if(msg.hasMedia){
      let media = await msg.downloadMedia();
      let messageSendOptions = {
        sendMediaAsSticker: true,
        sendSeen: false,
        media: media,
      }
      msg.reply(media, undefined, messageSendOptions);
      return;
    }
    if(msg.hasQuotedMsg){
      _parseTimeStamp(msg);
      _parseBody(msg);
    }else{
      msg.reply('Plz attach a media file or quote a message containing video url');
      return;
    }
  }catch(err){
    console.log('catched from sticker.js', err);
    return;
  }
}

function _parseTimeStamp(msg){
  let timestamp = msg.body.split(' ')[2];
  let timestampRegex = /^\d\d:\d\d:\d\d$/;
  if(timestampRegex.test(timestamp)){
    seekstart = timestamp;
  }else{
    msg.reply(`timestamp set to 00:00:00`);
  }
}

async function _parseBody(msg){
  let quotedMsg = await msg.getQuotedMessage();
  // REGEX FOR MATCHING A VALID URL
  let regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;
  extractedURL = quotedMsg.body.match(regex);
  if(extractedURL === null){
    msg.reply('Please send a valid URL');
    return;
  }
  extractedURL = extractedURL[0];
  console.log(extractedURL);

  // let contains = false;
  // supportedDomainsArray.forEach((domain, i) => {
  //   if(extractedURL.includes(domain.toLowerCase())){
  //     contains = true;
  //     console.log(i);
  //     return;
  //   }
  // });
  // if(contains){
    let filename = await _extractVideoFromURL(extractedURL)
    if(filename){
      console.log(__dirname, '/', filename);
      let media = MessageMedia.fromFilePath(`${__dirname}/${filename}`);
      msg.reply(media, undefined, { sendMediaAsSticker: true, media });
    }else{
      // msg.reply('error occurred');
    }

  // }else{
    // msg.reply('Domain Not Supported, See the list of supported domains here');
  // }
}

function _extractVideoFromURL(url){
  return new Promise((resolve) => {
    let ytdlArgs = [
      url,
      '--no-playlist',
      '-f mp4',
      '-o', 'test.%(ext)s',
      '--external-downloader', 'ffmpeg',
      '--external-downloader-args', 
      `-ss ${seekstart} -t 5`,
    ];

    const yt = spawn('youtube-dl', ytdlArgs, { cwd: __dirname });

    yt.stdout.on('data', (data) => {
    });

    yt.stderr.on('data', (data) => {
      console.log('yt error', data.toString('utf-8'));
    });

    yt.on('close', (code) => {
      console.log('yt exited with: ', code)
      if(code === 0){
        resolve('test.mp4');
      }else{
        resolve(null);
      }
      // if(code === 0){
      //   const ff = spawn('ffmpeg', [
      //     '-y', '-ss', seekstart, '-t', '5',
      //     '-i', video_url.split('\n')[0],
      //     // '-avoid_negative_ts', 'make_zero',
      //     'test.mp4',
      //   ]);

      //   ff.stderr.on('data', data => {
      //     console.log('ffmpeg err', data.toString('utf-8'));
      //   });

      //   ff.on('close', code => {
      //     if(code === 0){
      //       resolve('test.mp4');
      //     }else{
      //       resolve(null);
      //     }
      //   })
      // }else{
      //   resolve(null);
      // }
    });
  });
}
