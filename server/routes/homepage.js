const router = require('express').Router();
const DatabaseController = require('../controllers/DatabaseController');
const BotController = require('../controllers/BotController');
const errorHandler = require('../middlewares/errorHandler');

router.get('/',
  errorHandler(DatabaseController.getSiteCommonData),
  errorHandler(DatabaseController.getAllCategories),
  errorHandler(DatabaseController.getAllProducts),
  (req, res) => {

    // check for categories that have no products
    const arr = req.products.map(obj => obj.category);
    let categories = req.categories.filter(category => {
      return arr.some(el => el.equals(category.id));
    });

    res.render('client', {
      info: req.info[0],
      category: categories,
      products: req.products
    });
  });


// route for sending message or requesting callback
router.post('/notification/:type',
  errorHandler(DatabaseController.addNewNotification),
  (req, res) => {

    if (req.notifictionErrors) {
      res.status(400).json(req.notifictionErrors);
    } else {
      const msg = req.params.type == 'callback' ?
        `<b>Поступила заявка на обратный звонок!</b>
<b>Отправитель:</b> ${req.body.username}
<b>Телефон:</b> ${req.body.phone}\n\n` :
        `<b>Пришло новое сообщение!</b>
<b>Отправитель:</b> ${req.body.username}
<b>Email:</b> ${req.body.email}
<b>Текст сообщения...</b>
${req.body.message}\n\n`;

      BotController.sendMessageToFelkerGroup(msg)

      res.status(201).json(req.report);
    }

  }
);


router.post('/data/add', (req, res, next) => {
  let data = {};
  data.meta = {};

  Object.keys(req.body).forEach(key => {
    let temp = key.split('_');
    const request = req.body;

    if (temp[0] == 'meta') {
      data['meta'][temp[1]] = request[key];
    } else {
      data[key] = request[key];
    }
  });

  req.data = data;
  next();
}, DatabaseController.addInitialData);

module.exports = router;