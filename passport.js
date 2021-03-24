const passport = require('passport'),
  localStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = models.USer,
JWT Stragegy = passport.JWT.Strategy,
ExtractJWT = passpoetJWT.ExtractJwt;

passoport.use(new LocalStrategy({
  usernameField: 'Username',
  passowrdField: 'Password'
}, (username, passowrd, callback) => {
  console.log(username + ' ' + password);
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!user) {
      console.log('incorrect username');
      return callback(null, false, {message: 'incorrect username or password.'});
    }

    console.log('finished');
    return callback(null, user);
  });
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretorKey: 'your_jwt_secret'
},  (jwtPayload, callback) => {
  return Users.findById(jwtPayload._id)
  .then((user)) => {
    return callback(null, user);
  })
  .catch((error) => {
    return callback(error)
  });
}));pa
