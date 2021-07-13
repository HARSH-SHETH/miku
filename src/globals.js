// DEFINE GLOBAL CONSTANTS HERE

const BOT_COMMAND = '!miku'
const EVERYONE = '!minna'

module.exports = {
  EVERYONE : `${EVERYONE}`,
  BOT_COMMAND : `${BOT_COMMAND}`,
  SFW_WAIFU_COMMAND: `${BOT_COMMAND} sfw`,
  NSFW_WAIFU_COMMMAND: `${BOT_COMMAND} nsfw`,
  admin: {
    'BLOCK_GROUP': `${BOT_COMMAND} block`,
    'UNBLOCK_GROUP': `${BOT_COMMAND} unblock`,
  },
  FILTER_GROUPS: [
    'CSE DD Family',
  ],
  error_codes: {
    MONGODB_CONNECTION_ERROR: 1,
  },
}
