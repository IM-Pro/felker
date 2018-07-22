const winston = require('winston');
require('winston-mongodb');
const config = require('../config/settings');

const db = config.db;

const logger = new winston.Logger({
  transports: [
    new winston.transports.MongoDB({
      db: db,
      collection: 'logs',
      handleExceptions: true,
      level: 'info'
    })
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
  winston.addColors({
    debug: "grey",
    verbose: "cyan",
    info: "magenta",
    silly: "green",
    warn: "yellow",
    error: "red"
  });

  logger.add(
    winston.transports.Console, {
      level: 'debug',
      handleExceptions: true,
      prettyPrint: true,
      json: false,
      colorize: true,
      humanReadableUnhandledException: true
    }
  );
}

// logger.handleExceptions([
//   new winston.transports.MongoDB({
//     db: config.get('DB.uri'),
//     collection: 'uncaughtExceptions',
//     handleExceptions: true,
//     level: 'error'
//   })
// ]);

module.exports = logger;