const mongoose = require('mongoose');
const logger = require('../startup/logging');

mongoose.Promise = global.Promise;

let state = {
  db: null
}

exports.connect = async (url, done) => {
  if (state.db) {
    return done();
  }

  try {
    state.db = await mongoose.connect(url, {
      useNewUrlParser: true
    });

    logger.verbose('MongoDB connected...');
    done();
  } catch (err) {
    console.log(`Error occured while trying set up DB connection...`, err);
    logger.error(err)
  }
}