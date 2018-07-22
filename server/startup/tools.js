const methodOverride = require('method-override');
const upload = require('multer')();
const bodyParser = require('body-parser');
const flash = require('connect-flash');

// Initialize some middlewares for Express
module.exports = (app) => {

  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use('/notification/*', upload.array());
  app.use(methodOverride('_method'));
  app.use(flash());
}