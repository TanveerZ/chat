const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var db = require('../config/db');
var User = require('../app/modules/users/schemas/userSchema');

module.exports = async function (passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = db.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    //console.log("PAY LOAD DATA : ",jwt_payload);
    var member_id = jwt_payload.data;
    User.findById(member_id)
      .then(user => {
        //console.log(user);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      }).catch((err) => {
        return done(err, false);
      });
  }));
}
