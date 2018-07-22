const exphbs = require('express-handlebars');
const { equals, isBigger, inRange, inc, isNotEmpty, ifCond, pre, sum } = require('../utils/exphbs-helper');

// Initialize view engine for Express
module.exports = (app) => {
  app.engine(
    'handlebars', 
    exphbs({
      helpers: {
        equals: equals,
        isBigger: isBigger,
        inRange: inRange,
        inc: inc,
        isNotEmpty: isNotEmpty,
        ifCond: ifCond,
        pre: pre,
        sum: sum
      }, defaultLayout: 'main'
    })
  );
  
  app.set('view engine', 'handlebars');
}