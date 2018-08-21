const router = require('express').Router();
const DatabaseController = require('../controllers/DatabaseController');
const AdminController = require('../controllers/AdminController');
const errorHandler = require('../middlewares/errorHandler');

// admin page
router.get('/',
  // AdminController.ensureAuthenticated,
  errorHandler(DatabaseController.getSiteCommonData),
  errorHandler(DatabaseController.getAllCategories),
  errorHandler(DatabaseController.getAllProducts),
  errorHandler(DatabaseController.getAllNotifications),
  errorHandler(AdminController.getAllUsers),
  (req, res) => {
    const users = req.users.map(user => {
      user.role = user.roles[0];
      return user;
    });
    const tab = req.query.tab;

    res.render('admin', {
      info: req.info[0],
      categories: req.categories,
      modHeaders: ['A', 'B', 'C', 'D', 'E', 'F'],
      products: req.products,
      newNotifications: {
        callbacks: req.notifications.callbacks.new,
        messages: req.notifications.messages.new
      },
      callbacks: req.notifications.callbacks.data,
      messages: req.notifications.messages.data,
      users: users,
      session: req.session,
      adminTab: tab || 'product'
    });
  });

router.put('/data/edit/:id',
  AdminController.ensureAuthenticated,
  errorHandler(DatabaseController.updateSiteCommonData),
  (req, res) => {
    req.flash(`success_msg`, `Данные сайта изменены`);
    res.status(200).redirect('/admin?tab=config');
  });


// login page
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', AdminController.loginUser);

module.exports = router;