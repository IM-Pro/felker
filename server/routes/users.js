const router = require('express').Router();
const AdminController = require('../controllers/AdminController');
const errorHandler = require('../middlewares/errorHandler');

//route for adding new user
router.post('/add',
  // AdminController.ensureAuthenticated,
  errorHandler(AdminController.addNewUser),
  (req, res) => {
    req.flash('success_msg', `Пользователь ${req.body.login} был успешно добавлен`)
    res.redirect('/admin?tab=user');
  }
);

router.put('/edit/:id',
  AdminController.ensureAuthenticated,
  errorHandler(AdminController.updateUserData),
  (req, res) => {
    req.flash(`success_msg`, `Данные пользователя ${req.body.login} были изменены`);
    res.redirect('/admin?tab=user');
  }
);

//route for deleting user
router.delete('/delete/:id',
  // AdminController.ensureAuthenticated,
  errorHandler(AdminController.removeUser)
);

module.exports = router;