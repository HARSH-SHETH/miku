// DEFINE GLOBAL CONSTANTS HERE

const BOT_COMMAND = '!miku'
const EVERYONE = '!minna'

module.exports = {
  EVERYONE : `${EVERYONE}`,
  BOT_COMMAND : `${BOT_COMMAND}`,
  SFW_WAIFU_COMMAND: `${BOT_COMMAND} sfw`,
  NSFW_WAIFU_COMMMAND: `${BOT_COMMAND} nsfw`,
  REVEAL_COMMAND: `${BOT_COMMAND} reveal`,
  admin: {
    'BLOCK_GROUP': `${BOT_COMMAND} block`,
    'UNBLOCK_GROUP': `${BOT_COMMAND} unblock`,
  },
  deletedMessage: {},
  FILTER_GROUPS: [],
  error_codes: {
    MONGODB_CONNECTION_ERROR: 1,
  },
}
