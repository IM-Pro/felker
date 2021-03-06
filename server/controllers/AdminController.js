const Users = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


passport.use(
  new LocalStrategy({
      usernameField: 'login'
    },
    async (login, password, done) => {
      if (password.trim() == '') {
        return done(null, false, {
          message: 'Логин или пароль указаны неверно!'
        });
      }
      try {
        const user = await Users.getByName(login);

        if (!user) {
          return done(null, false, {
            message: 'Логин или пароль указаны неверно!'
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          user.password = null;
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Логин или пароль указаны неверно!'
          });
        }
      } catch (ex) {
        console.log(ex);
        return done(null, false, {
          message: 'Логин или пароль указаны неверно!'
        });
      }

    }
  )
)

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    const isAdmin = req.user.roles.includes('admin');
    if (isAdmin) return next();
    
    req.flash('error_msg', 'Нет прав доступа!');
    req.errors = ['no rights']
    return next();
  } else {
    req.flash('error_msg', 'Необходима авторизация!');
    res.redirect('/admin/login')
  }
}


exports.loginUser = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res, next);
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

exports.addNewUser = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);

  if (hash) {
    req.body.password = hash;

    await Users.add(req.body);
  } else {
    throw new Error('Что-то не так с хэшированием пароля...');
  }
}

exports.removeUser = async (req, res) => {
  if (req.errors && req.errors.includes('no rights')) {
    req.flash(`error_msg`, `Нет прав доступа!`);
    res.status(403).json({error: 'нет прав доступа'})
  } else {
    const removedUser = await Users.remove(req.params.id);
    req.flash(`success_msg`, `Пользователь ${req.removedUser} удален`);
    res.status(200).send(removedUser);
  }
  
}

exports.updateUserData = async (req, res) => {
  await Users.update(req.params.id, req.body);
}

exports.getAllUsers = async (req, res) => {
  req.users = await Users.all();
}