// HANDLE ALL BOT COMMANDS 
const _ = require('./globals');
const waifu = require('./waifu/waifu');
const { 
  filterGroups, 
  prettyPrint, 
  sendAndDeleteAfter, 
} = require('./helper');
const sticker = require('./sticker/sticker');
const help = require('./help/help');

const db = require('./database/dbfunctions');
const deleted = require('./database/models/deleted')
const emojiStrip = require('emoji-strip');
const axios = require('axios');
const cheerio = require('cheerio')

const class_schedule = require('./classes/class')

module.exports.parseMsg = async function(msg, client){
  let body = msg.body;

  if(body.startsWith(_.BOT_COMMAND) || body.startsWith(_.EVERYONE)){
      let chat = await msg.getChat();
      let sender = parseInt(msg.author ?? msg.from);

      let list = _.BLACKLIST[emojiStrip(chat.name)];

      if(list && Object.keys(list).length && list[sender]){
        sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.NOPOWER));
        return;
      }
  }

  switch(body){
    case _.EVERYONE: {
      tagEveryone(msg, client);
      break;
    }
    case _.BOT_COMMAND: {
      printCommands(msg);
      break;
    }

    case _.BLOCK_GROUP: {
      blockGroup(msg);
      break;
    }
    case _.UNBLOCK_GROUP: {
      unblockGroup(msg);
      break;
    }
    case _.POLL_START : {
      startpoll(msg)
      break;
    }
    case _.POLL_YES : {
      markYes(msg)
      break;
    }
    case _.POLL_NO : {
      markNo(msg)
      break;
    }
    case _.POLL_STATUS : {
      pollstatus(msg);
      break;
    }
    case _.POLL_STOP : {
      stoppoll(msg);
      break;
    }
    case _.ANNOUNCEMENTS : {
      announcements(msg);
      break;
    }

    case _.CURRENT_CLASS : {
      let classes = new class_schedule();
      let result = classes.classNow();
      currentClass(msg, result);
      break;
    }

    case _.NEXT_CLASS: {
      let classes = new class_schedule();
      let result = classes.classNext();
      nextClass(msg, result);
      break;
    }

    case _.DOT_COMMAND: {
      let quotedMessage = await msg.getQuotedMessage();
      this.parseMsg(quotedMessage);
      return;
    }

    default: {
      if(body.startsWith(_.SFW_WAIFU_COMMAND)){
        waifu(msg);
      }
      if(body.startsWith(_.BLACKLIST_COMMAND)){
        blacklist(msg);
      }
      if(body.startsWith(_.WHITELIST_COMMAND)){
        whitelist(msg);
      }
      if(body.startsWith(_.GRADES)){
        let index = _.GRADES.length;
        let roll_no = body.substr(index).trim();
        grades(msg, roll_no)
      }
      if(body.startsWith(_.REVEAL_COMMAND)){
        let index = _.REVEAL_COMMAND.length;
        let count = body.substr(index).trim();
        revealMessage(msg, count)
      }
      if(body.startsWith(_.STICKER_COMMAND)){
        sticker(msg);
      }
      if(body.startsWith(_.HELP_COMMAND)){
        const command = msg.body.split(' ')[2];
        help(msg, command);
      }
    }
  }
}

async function currentClass(msg, result){
  let replyMessage = '';
  if(JSON.stringify(result) == '{}')
    replyMessage += `No Class scheduled currently`;
  else
    replyMessage = `Current Class : ${result.Subject}\nlink:` + result.link;
    msg.reply(replyMessage);
}

async function nextClass(msg, result) {
  let replyMessage = "";
  if (JSON.stringify(result) == "{}") {
    replyMessage += `No next class scheduled currently`;
  } else {
    replyMessage = `Next Class : ${result.Subject}\nlink:` + result.link;
  }
  msg.reply(replyMessage);
}

async function grades(msg, roll_no){
  axios.get(`https://nithp.herokuapp.com/api/result/student/${roll_no}`).then(response => {

    let data = response.data;
    let last_sem = data.summary.length;
    let sem_result = data.result.filter(function(item){
      return item.sem === last_sem;
    })


    let replyMessage = `Name:${data.name}\nCurrent CGPI : ${data.cgpi}\n\n---------------------------\n`;
    replyMessage += `Last Semester Passed : ${last_sem}\n\n`;

    let count = 0;
    for(item of sem_result){
      count++;
      replyMessage += `${count}. ${item.subject.substr(0,18)}. -> ${item.sub_gp/item.sub_point}\n`;
    }

    replyMessage += `---------------------------\nSUMMARY\n`;

    let summary = data.summary;
    summary.reverse();

    for(item of summary){
      replyMessage += `Sem ${item.sem}\nCGPI : ${item.cgpi}\nSGPI : ${item.sgpi}\n\n`;
    }
    sendAndDeleteAfter(msg, prettyPrint(replyMessage));
  }).catch(err => {
    sendAndDeleteAfter(msg, prettyPrint('Something went wrong !'));
  })
}

async function fetchannouncements(msg){
  let message = 'Please wait while we fetch the details';
  sendAndDeleteAfter(msg, prettyPrint(message));
  await axios.get('https://nith.ac.in/all-announcements').then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const data = $('tbody:first-of-type a')

    let data_array = Array.from(data);
    let raw_data = data_array.slice(0,5);

    let replyMessage = `[ Latest 5 announcements from nith.ac.in]\n\n`;
    let links = [];

    for(item of raw_data){

      let link = {
        text : item.children['0'].data,
        href : item.attribs.href
      }
      
      links.push(link);
    }
    _.ANNOUNCEMENTS_DATA.last_fetched = new Date();
    _.ANNOUNCEMENTS_DATA.data = links;

});
}

async function announcements(msg){
  let chat = await msg.getChat();
  let last_fetched = _.ANNOUNCEMENTS_DATA.last_fetched;
  if(last_fetched){
    let now = new Date();
    let time_diff = now.getTime() - last_fetched.getTime();

    if(time_diff/(1000 * 60) > 10){
      await fetchannouncements(msg);
    }
  } else {
    await fetchannouncements(msg);
  }

  let data = _.ANNOUNCEMENTS_DATA.data;

  let replyMessage = `[ Latest 5 announcements from nith.ac.in]\n\n`;

  for(item of data){
    replyMessage += `*Title* : ${item.text}\n`
    replyMessage += `*Link* : ` + item.href;
    replyMessage += '\n\n\n'
  }

  replyMessage += `\n\n *Last Fetched* : around ${Math.floor((new Date().getTime() - _.ANNOUNCEMENTS_DATA.last_fetched.getTime())/(1000 * 60))} min. ago\n\n`

  sendAndDeleteAfter(msg, replyMessage);
}

async function blacklist(msg){
  if(!msg.fromMe){
    let replyMessage = 'You cannot use this command';
    sendAndDeleteAfter(msg, prettyPrint(replyMessage));
    return;
  }
  let chat = await msg.getChat();
  let ids = msg.mentionedIds;
  if(!_.BLACKLIST[emojiStrip(chat.name)])
    _.BLACKLIST[emojiStrip(chat.name)] = {}
  
  for(id of ids){
    _.BLACKLIST[emojiStrip(chat.name)][parseInt(id)] = 1;
  } 
  deleted.findOneAndUpdate({}, {$set:{blacklist:_.BLACKLIST}}, {useFindAndModify: false}).catch(err => {
    console.log(err);
  })
}

async function whitelist(msg){
  if(!msg.fromMe){
    let replyMessage = 'You cannot use this command';
    sendAndDeleteAfter(msg, prettyPrint(replyMessage));
    return;
  }
  let chat = await msg.getChat();
  let ids = msg.mentionedIds;

  if(!_.BLACKLIST[emojiStrip(chat.name)])
    return;

  for(id of ids){
    delete _.BLACKLIST[emojiStrip(chat.name)][parseInt(id)];
  }

  if(!Object.keys(_.BLACKLIST[emojiStrip(chat.name)]).length)
    delete _.BLACKLIST[emojiStrip(chat.name)];

  deleted.findOneAndUpdate({}, {$set:{blacklist:_.BLACKLIST}}, {useFindAndModify: false}).catch(err => {
      console.log(err);
  })
}

async function tagEveryone(msg, client){

  let chat = await msg.getChat();
  // RETURN IF NOT IN A GROUP
  if(!chat.isGroup){
    sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.NOTGROUP));
    return;
  }

  if(filterGroups(chat)){
    sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.UNAVAIL));
    return;
  }

  let text = "";
  let mentions = [];

  for(let participant of chat.participants) {
    const contact = await client.getContactById(participant.id._serialized);

    mentions.push(contact);
    text += `@${participant.id.user} `;
  }

  // THIS MESSAGE SHOULD NOT BE AUTODELETED
  chat.sendMessage(text, { mentions });
}

function printCommands(msg){
  let commands = `
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
* [!miku] - show all commands *
*                             *
* [!miku help base_command]   *
*  --> show help for command  *
*  Eg: --> !miku help sfw     *
*                             *
* [!minna]                    *
*                             *
* [!miku sfw]                 *
*                             *
* [!miku reveal]              *
*                             *
* [!miku poll]                *
*                             *
* [!miku result rollno]       *
*                             *
* [!miku updates]             *
*                             *
* [!miku sticker]             *
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

Source Code: https://github.com/harsh-sheth/miku
`
  sendAndDeleteAfter(msg, prettyPrint(commands), { sendSeen: false }, _.MSG_DEL_TIMEOUT);
}


// BLOCK GROUPS TO USE CERTAIN COMMANDS
async function blockGroup(msg){
  if(!msg.fromMe){
    sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.PRIVILEGE));
    return;
  }
  let chat = await msg.getChat(); 
  if(!chat.isGroup){
    sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.NOTGROUP));
    return;
  }
  let groupName = emojiStrip(chat.name);
  _.FILTER_GROUPS.forEach((group) => {
    if(group == groupName){
      return;
    }
  });
  db.addGroup(groupName, function(){
    _.FILTER_GROUPS.push(groupName);
    sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.BLOCKED))
  });
}

// UNBLOCK GROUP
async function unblockGroup(msg){
  if(!msg.fromMe){
    sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.PRIVILEGE))
    return;
  }
  let chat = await msg.getChat(); 
  if(!chat.isGroup){
    sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.NOTGROUP));
    return;
  }
  let groupName = emojiStrip(chat.name);
  db.removeGroup(groupName, () => {
    _.FILTER_GROUPS.forEach(function(group, i){
      if(group == groupName){
        // REMOVE GROUP FROM FILTER_GROUPS ARRAY
        this.splice(i, 1)
        sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.UNBLOCKED));
        return;
      }
    }, _.FILTER_GROUPS);
  });
}

async function revealMessage(msg, count) {
  // _.DELETEDMESSAGE[msg.]
  let chat = await msg.getChat();
  let deletedMessage = _.DELETEDMESSAGE[emojiStrip(chat.name)];
  if(deletedMessage === undefined){
    sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.NO_DEL_MSG));
    return;
  }else{
    // GROUPNAME IMPLIES TO TITLE CHAT NAME
    let groupName = emojiStrip(chat.name);
    let elements = _.DELETEDMESSAGE[groupName];
    if(!count)
      count = 1;
    
    if(!parseInt(count)){
      sendAndDeleteAfter(msg, prettyPrint('Please send a proper count'));
      return;
    }
    let total = elements.length;
    let cnt = Math.min(elements.length, parseInt(count));

    let replyMessage = `[Showing ${cnt}/${total} deleted messages]\n\n`;

    for(let i=0;i<cnt;i++){
      replyMessage += `Message:${elements[i].message}\nFrom:${elements[i].from}\n\n`;
    }

    sendAndDeleteAfter(msg, prettyPrint(replyMessage));
  }
}

async function startpoll(msg){
    let chat = await msg.getChat();
    if(!chat.isGroup){
      sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.NOTGROUP));
      return;
    }
    if(_.POLL_DATA[chat.name]){
      sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.POLLRUNNING));
      return; 
    }
    msg.reply(prettyPrint(_.REPLIES.POLLACTIVE));

    let sender = parseInt(msg.author ?? msg.from)
    _.POLL_DATA[chat.name] = {
      active:true, 
      data:new Map(),
      host:sender
    }
}

async function pollstatus(msg){
  let chat = await msg.getChat();
  if(!_.POLL_DATA[chat.name]){
    sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.NOPOLL));
    return;
  }
  const itr =  _.POLL_DATA[chat.name].data[Symbol.iterator]();
      let yes = 0, count = 0;
      let host = _.POLL_DATA[chat.name].host;
      for(const item of itr){
        count++;
        if(item[1])
          yes++;
      }
      let replyMessage = 'Poll Status\nYes:' + `${count ? (yes/count) * 100 : 0} %\nNo:` + `${count ? ((count - yes)/count) * 100 : 0} %\n\nParticipants:` + `${count}\nPoll Host:` + `${host}`;
      chat.sendMessage(prettyPrint(replyMessage));

}

async function stoppoll(msg){
  let chat = await msg.getChat();
  let sender = parseInt(msg.author ?? msg.from)
  if(!_.POLL_DATA[chat.name]){
    sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.NOPOLL));
    return;
  }

  if(sender === _.POLL_DATA[chat.name].host || msg.fromMe){
    const itr =  _.POLL_DATA[chat.name].data[Symbol.iterator]();
      let yes = 0, count = 0;
      let host = _.POLL_DATA[chat.name].host;
      for(const item of itr){
        count++;
        if(item[1])
          yes++;
      }
      delete _.POLL_DATA[chat.name];
      let replyMessage = 'Poll Results\nYes:' + `${count ? (yes/count) * 100 : 0} %\nNo:` + `${count ? ((count - yes)/count) * 100 : 0} %\n\nParticipants:` + `${count}\nPoll Host:` + `${host}`;
      chat.sendMessage(prettyPrint(replyMessage));
  } else {
    sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.HOSTONLY));
  }
}

async function markYes(msg){
    let chat = await msg.getChat();
    if(_.POLL_DATA[chat.name]){
      let sender = parseInt(msg.author ?? msg.from)
      _.POLL_DATA[chat.name].data.set(sender, 1);
    } else {
      sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.NOPOLL));
    }
}

async function markNo(msg){
  let chat = await msg.getChat();
  if(_.POLL_DATA[chat.name]){
    let sender = parseInt(msg.author ?? msg.from)
    _.POLL_DATA[chat.name].data.set(sender, 0);
  } else {
    sendAndDeleteAfter(msg, prettyPrint(_.REPLIES.NOPOLL));
  }
}
