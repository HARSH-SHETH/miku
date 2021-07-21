// DEFINE GLOBAL CONSTANTS HERE

const BOT_COMMAND = process.env.BOT_COMMAND ?? '!miku'
const EVERYONE = '!minna'

module.exports = {
  EVERYONE : `${EVERYONE}`,
  BOT_COMMAND : `${BOT_COMMAND}`,
  SFW_WAIFU_COMMAND: `${BOT_COMMAND} sfw`,
  NSFW_WAIFU_COMMMAND: `${BOT_COMMAND} nsfw`,
  REVEAL_COMMAND: `${BOT_COMMAND} reveal`,
  BLOCK_GROUP: `${BOT_COMMAND} block`,
  UNBLOCK_GROUP: `${BOT_COMMAND} unblock`,
  MSG_DEL_TIMEOUT: `10000`,
  POLL_START:`${BOT_COMMAND} poll`,
  POLL_YES:`${BOT_COMMAND} y`,
  POLL_NO:`${BOT_COMMAND} n`,
  POLL_STATUS:`${BOT_COMMAND} poll status`,
  POLL_STOP:`${BOT_COMMAND} poll end`,
  BLACKLIST_COMMAND:`${BOT_COMMAND} blacklist`,
  WHITELIST_COMMAND:`${BOT_COMMAND} whitelist`,
  ANNOUNCEMENTS:`${BOT_COMMAND} updates`,
  DELETEDMESSAGE:{},
  FILTER_GROUPS: [],
  BLACKLIST:{},
  POLL_DATA:{},
  ANNOUNCEMENTS_DATA:{last_fetched:null, data:[]},
  REPLIES: {
    UNAVAIL: 'This group is blocked from using this command',
    PRIVILEGE: 'You do not have privileges.',
    NO_DEL_MSG: 'No deleted message since last deploy',
    BLOCKED: 'BLOCKED',
    UNBLOCKED: 'UNBLOCKED',
    NOTGROUP: 'You need to be in a group to use this command',
    ERROR: 'Error Occurred',
    INVALID: 'Command Invalid',
    VALCOUNT: 'Please send a valid count',
    NOPOLL: 'No Poll Running',
    POLLRUNNING: 'Poll already running',
    POLLACTIVE: 'Poll active now',
    HOSTONLY: 'Poll can be ended by host only',
    NOPOWER:'Sorry, you have lost your powers, you weak!!!',
  },
  CODES: {
    MONGODB_CONNECTION_ERROR: 1,
  },
}
