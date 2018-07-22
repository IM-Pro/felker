// Initialize local variables for using in handlebars
module.exports = (app) => {
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user || null;
    res.locals.notifications = {};
    next();
  });
}