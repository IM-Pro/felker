const router = require('express').Router();
const DatabaseController = require('../controllers/DatabaseController');
const {
  ensureAuthenticated
} = require('../controllers/AdminController');
const errorHandler = require('../middlewares/errorHandler');

//route for adding new category
router.post('/add',
  ensureAuthenticated,
  errorHandler(DatabaseController.addNewCategory),
  (req, res) => {
    req.flash(`success_msg`, `Категория '${req.body.name}' успешно добавлена`);
    res.redirect('/admin?tab=category');
  }
);

router.get('/teest', DatabaseController.testGroup);

router.put('/edit/:id',
  ensureAuthenticated,
  errorHandler(DatabaseController.updateCategory),
  (req, res) => {
    req.flash(`success_msg`, `Категория успешно изменена`);
    res.status(200).redirect('/admin?tab=category');
  }
);

//route for deleting category
router.delete('/delete/:id',
  ensureAuthenticated,
  errorHandler(DatabaseController.removeCategory),
  (req, res) => {

    res.status(200).send();
  }
);

module.exports = router;