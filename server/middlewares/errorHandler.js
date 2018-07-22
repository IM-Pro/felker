const logger = require('../startup/logging');

module.exports = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
      next();
    } catch (ex) {
      const error = ex.message ? ex.message : ex;

      logger.error(ex);

      req.flash(`error_msg`, `Произошла ошибка: '${error}'
      ${ex}`);
      // res.status(500).send(error);
      res.redirect('/admin');
    }
  }
}