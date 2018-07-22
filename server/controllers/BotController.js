const TelegramBot = require('node-telegram-bot-api');
const config = require('../config/settings');


const TOKEN = config.telegram.botToken;
const felkerChatID = config.telegram.chatId;
const bot = new TelegramBot(TOKEN, {
  polling: true
});


module.exports.sendMessageToFelkerGroup = async (msg) => {
  return await bot.sendMessage(felkerChatID, msg, {
    parse_mode: 'HTML'
  })
}