if (process.env.NODE_ENV != 'production') {
  const local = require('../../config/local.settings');
}

const settings = {
  db: process.env.NODE_ENV == 'production' ?
    process.env.MONGO_DB_URI : local.db,
  telegram: {
    botToken: process.env.NODE_ENV == 'production' ?
      process.env.TELEGRAM_BOT_TOKEN : local.telegram.botToken,
    chatId: process.env.NODE_ENV == 'production' ?
      process.env.TELEGRAM_FELKER_CHAT_ID : local.telegram.chatId
  },
  cloudinary: {
    name: process.env.NODE_ENV == 'production' ?
      process.env.FELKER_IMGS_CLOUD : local.cloudinary.name,
    key: process.env.NODE_ENV == 'production' ?
      process.env.FELKER_IMGS_API_KEY : local.cloudinary.key,
    secret: process.env.NODE_ENV == 'production' ?
      process.env.FELKER_IMGS_API_SECRET : local.cloudinary.secret
  },
  sessionSecret: process.env.NODE_ENV == 'production' ?
    process.env.SESSION_SECRET : local.sessionSecret
}

module.exports = settings;