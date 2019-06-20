const TelegramBot = require('node-telegram-bot-api');
const config = require('../config/settings');
const logger = require('../startup/logging');


const TOKEN = config.telegram.botToken;
const felkerChatID = config.telegram.chatId;
const bot = new TelegramBot(TOKEN, {
  polling: true
});

bot.on('polling_error', err => {
  console.log('POLLING ERROR: телеграм заблокирован, включите VPN');  // error.code -> 'EFATAL'
  logger.error(`POLLING ERROR: ${err}`);
  bot.stopPolling();
});


module.exports.sendMessageToFelkerGroup = async (msg) => {
  return await bot.sendMessage(felkerChatID, msg, {
    parse_mode: 'HTML'
  })
}