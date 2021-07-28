// HANDLE STICKER MAKING REQUEST
const { MessageMedia } = require('whatsapp-web.js');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const crypto = require('crypto');
const { prettyPrint, sendAndDeleteAfter } = require('../helper');
const _ = require('../globals');

const MEGA = 10_00_000;

// DEFAULT -SS VALUE TO USE IN FFMPEG COMMAND
let seekstart = "00:00:00";

// PROCESS STICKER
module.exports = async function(msg){
  try{
    if(msg.hasMedia){
      _sendMediaAsSticker(msg);
    }else if(msg.hasQuotedMsg){
      let quotedMsg = await msg.getQuotedMessage();
      if(quotedMsg.hasMedia){
        _sendMediaAsSticker(msg, quotedMsg);
      }else{
        _parseTimeStamp(msg);
        _parseBody(msg, quotedMsg);
      }
    }else{
      sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.ATTACH));
      return;
    }
  }catch(err){
    console.trace(err);
    return;
  }
}

async function _sendMediaAsSticker(msg, quotedMsg){
  let media, mediaMsg = quotedMsg ?? msg;
  try{
    media = await mediaMsg.downloadMedia();
  }catch(e){
    msg.reply('```Message gone out-of-cache, try resending the media and type !miku sticker```')
    return;
  }
  let messageSendOptions = {
    sendMediaAsSticker: true,
    sendSeen: false,
    media: media,
  }
  msg.reply(media, undefined, messageSendOptions);
}

function _parseTimeStamp(msg){
  let timestamp = msg.body.split(' ')[2];
  let timestampRegex = /^((([0-2])?\d:)?([0-5]?\d:)?)?([0-5]?\d)$/;
  if(timestampRegex.test(timestamp)){
    seekstart = timestamp;
  }else{
    sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.TIMESTAMP));
  }
}

async function _parseBody(msg, quotedMsg){
  // REGEX FOR MATCHING A VALID URL
  let regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;
  extractedURL = quotedMsg.body.match(regex);
  if(extractedURL === null){
    sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.ATTACH));
    return;
  }
  extractedURL = extractedURL[0];

  let filename = await _extractVideoFromURL(extractedURL)
  if(filename){
    let media = MessageMedia.fromFilePath(`${__dirname}/${filename}.webp`);
    // SIZE OF BASE64 ENCODED DATA IN BYTES
    let size = (media.data.length * 3/4);
    console.log('size of webp file: ', size);
    if(size < MEGA){
      try{
        msg.reply(media, undefined, { sendMediaAsSticker: true, media: media });
      }catch(err){
        console.log(err);
        sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.ERROR_SND_MEDIA));
      }
    }else{
      sendAndDeleteAfter(msg, _.REPLIES.STICKER_SIZE);
      let  mp4Media = MessageMedia.fromFilePath(`${__dirname}/${filename}.mp4`);
      try{
        msg.reply(mp4Media, undefined, { media: mp4Media });
      }catch(e){
        console.log(e);
      }
    }
    fs.unlink(`${__dirname}/${filename}.webp`);
    fs.unlink(`${__dirname}/${filename}.mp4`);
  }else{
    sendAndDeleteAfter(msg, _.REPLIES.ERROR);
  }
}

async function _extractVideoFromURL(url){
  return new Promise((resolve) => {
    let filename = crypto.randomBytes(6).readUIntLE(0, 6).toString(36);
    let ytdlArgs = [
      url,
      '--no-continue',
      '--no-playlist',
      '-f', 'mp4',
      '-o', `${filename}.%(ext)s`,
      '--external-downloader', 'ffmpeg',
      '--external-downloader-args', 
      `-ss ${seekstart} -t 5`,
    ];

    const yt = spawn('youtube-dl', ytdlArgs, { cwd: __dirname });

    yt.stderr.on('data', () => {});

    yt.stdout.on('data', () => {});

    yt.on('close', (code) => {
      console.log('yt exited with: ', code)
      if(code === 0){
        const ff = spawn('ffmpeg', [
          '-nostdin',
          '-loglevel', 'quiet',
          '-y', '-i', `${filename}.mp4`,
          '-avoid_negative_ts', 'make_zero',
          '-vcodec',
          'libwebp',
          '-lossless', '1',
          '-vf',
          // eslint-disable-next-line no-useless-escape
          'scale=\'iw*min(300/iw\,300/ih)\':\'ih*min(300/iw\,300/ih)\',format=rgba,pad=300:300:\'(300-iw)/2\':\'(300-ih)/2\':\'#00000000\',setsar=1,fps=10',
          '-loop',
          '0',
          '-ss',
          '00:00:00.0',
          '-t',
          '00:00:05.0',
          '-preset',
          'default',
          '-an',
          '-vsync',
          '0',
          '-s',
          '512:512',
          '-f', 'webp',
          `${filename}.webp`
        ], { cwd: __dirname });

        ff.stderr.on('data', () => {})

        ff.stdout.on('data', () => {});

        ff.on('close', async (code) => {
          if(code === 0){
            resolve(filename);
          }else{
            resolve(null);
          }
        });
      }else{
        resolve(null);
      }
    });
  });
}
