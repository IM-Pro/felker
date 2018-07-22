const router = require('express').Router(); // -> '/product'
const DatabaseController = require('../controllers/DatabaseController');
const { ensureAuthenticated } = require('../controllers/AdminController');
const errorHandler = require('../middlewares/errorHandler');
const upload = require('../middlewares/upload');
const imgProcessing = require('../middlewares/imgProcessing');


router.post('/add',
  ensureAuthenticated, upload, imgProcessing,
  errorHandler(DatabaseController.addNewProduct),
  (req, res) => {
    req.flash(`success_msg`, `Новый продукт '${req.productTitle}' успешно добавлен`);
    res.status(200).redirect('/admin');
  });

router.delete('/delete/:id',
  ensureAuthenticated,
  errorHandler(DatabaseController.removeProduct),
  (req, res) => {
    res.status(200).send();
  }
);

router.get('/:id',
  errorHandler(DatabaseController.getProductById),
  (req, res) => {
    res.status(200).send(res.requestedProduct[0]);
  }
);

router.put('/edit/modifications/:id',
  ensureAuthenticated,
  errorHandler(DatabaseController.getProductModifications),
  errorHandler(DatabaseController.updateProduct),
  (req, res) => {
    req.flash(`success_msg`, `Данные продукта '${req.product.title}' изменены`);
    res.redirect('/admin');
  }
);

router.put('/edit/:id',
  ensureAuthenticated, upload, imgProcessing,
  errorHandler(DatabaseController.updateProduct),
  (req, res) => {
    req.flash(`success_msg`, `Данные продукта '${req.body.prod_name}' изменены`);
    res.status(200).redirect('/admin');
  });

module.exports = router;