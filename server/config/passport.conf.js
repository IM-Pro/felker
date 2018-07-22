const LocalStrategy = require('passport-local').Strategy;

module.exports = passport => {
  passport.use( 
    new LocalStrategy( {usernameField: 'login'}, 
      (login, password, done) => {
        console.log(`login: ${login}, password: ${password}`);
      }
    ) 
  )
}