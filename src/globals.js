// DEFINE GLOBAL CONSTANTS HERE

const BOT_COMMAND = process.env.BOT_COMMAND ?? '!miku'
const EVERYONE = process.env.TAG_COMMAND ?? '!minna'

module.exports = {
  // COMMANDS
  EVERYONE : `${EVERYONE}`,
  BOT_COMMAND : `${BOT_COMMAND}`,
  SFW_WAIFU_COMMAND: `${BOT_COMMAND} sfw`,
  NSFW_WAIFU_COMMMAND: `${BOT_COMMAND} nsfw`,
  REVEAL_COMMAND: `${BOT_COMMAND} reveal`,
  STICKER_COMMAND: `${BOT_COMMAND} sticker`,
  BLOCK_GROUP: `${BOT_COMMAND} block`,
  UNBLOCK_GROUP: `${BOT_COMMAND} unblock`,
  POLL_START:`${BOT_COMMAND} poll`,
  POLL_YES:`${BOT_COMMAND} y`,
  POLL_NO:`${BOT_COMMAND} n`,
  POLL_STATUS:`${BOT_COMMAND} poll status`,
  POLL_STOP:`${BOT_COMMAND} poll end`,
  BLACKLIST_COMMAND:`${BOT_COMMAND} blacklist`,
  WHITELIST_COMMAND:`${BOT_COMMAND} whitelist`,
  ANNOUNCEMENTS:`${BOT_COMMAND} updates`,
  GRADES:`${BOT_COMMAND} result`,
  HELP_COMMAND: `${BOT_COMMAND} help`,

  // TIMEOUTS
  MSG_DEL_TIMEOUT: `25000`,

  // RUNTIME CACHE 
  DELETEDMESSAGE:{},
  FILTER_GROUPS: [],
  BLACKLIST:{},
  POLL_DATA:{},
  ANNOUNCEMENTS_DATA:{last_fetched:null, data:[]},

  // CUSTOM REPLIES
  REPLIES: {
    // GENERAL
    UNAVAIL: 'This group is blocked from using this command',
    PRIVILEGE: 'You do not have privileges.',
    BLOCKED: 'BLOCKED',
    UNBLOCKED: 'UNBLOCKED',
    NOTGROUP: 'You need to be in a group to use this command',
    ERROR: 'Error Occurred',
    INVALID: 'Command Invalid',

    // REVEAL MODULE
    VALCOUNT: 'Please send a valid count',
    NO_DEL_MSG: 'No deleted message since last deploy',

    // POLL MODULE
    NOPOLL: 'No Poll Running',
    POLLRUNNING: 'Poll already running',
    POLLACTIVE: 'Poll active now',
    HOSTONLY: 'Poll can be ended by host only',
    NOPOWER:'Sorry, you have lost your powers, you weak!!!',

    // STICKER MODULE
    ATTACH: 'Plz attach a media file or quote a message containing video url',
    TIMESTAMP: 'Timestamp set to 00:00:00',
    ERROR_SND_MEDIA: 'Error occured while sending media',
    STICKER_SIZE: `Generated sticker file size is greater than 1MB.\nSending media as MP4.`
  },

  // ERROR CODES
  CODES: {
    MONGODB_CONNECTION_ERROR: 1,
    AUTHENTICATION_ERROR: 2,
    DISCONNECTED: 3,
  },
}
