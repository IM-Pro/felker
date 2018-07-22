const homepage = require('../routes/homepage');
const admin = require('../routes/admin');
const products = require('../routes/products');
const categories = require('../routes/categories');
const users = require('../routes/users');
const bot = require('../routes/bot');

// Initialize all Routes
module.exports = (app) => {
  app.use('/', homepage);
  app.use('/admin', admin);
  app.use('/products', products);
  app.use('/category', categories);
  app.use('/user', users);
  app.use('/bot', bot);
}