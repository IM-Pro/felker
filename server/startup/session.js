const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const DB = require('../utils/db-helper');
const config = require('../config/settings');
const logger = require('../startup/logging');

// Initialize session and passport for Express auth
module.exports = async (app) => {
  // app.use(session({
  //   secret: 'secret',
  //   resave: true,
  //   saveUninitialized: true
  // }));

  const url = config.db;

  try {
    await DB.connect(url, () => {});
  } catch (err) {
    console.log(`Init session failed, could not connect to DB: `, err);
    logger.error(`Init session failed, could not connect to DB: ${err}`);
    throw new Error(`Init session failed, could not connect to DB: ${err}`);
  }


  app.use(session({
    secret: 'secret',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    store: new MongoStore({
      url: url,
      collection: 'session',
      touchAfter: 24 * 3600 // time period in seconds
    })
  }));

  app.use(passport.initialize());
  app.use(passport.session());
}