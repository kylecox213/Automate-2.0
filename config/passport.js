const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const db = require("../models");

passport.use(new LocalStrategy({
    usernameField: "username"
},
    function (username, password, done) {
        db.User.findOne({
            where: {
                username: username
            }
        }).then(function (dbUser) {
            if (!dbUser) {
                console.log("We're here");
                return done(null, false, {
                    message: "Incorrect username or password, please correct."
                });
            } else if (!dbUser.validPassword(password)) {
                return done(null, false, {
                    message: "Incorrect username or password, please correct."
                });
            }
            // If everything is good to go, respond with the User's username
            return done(null, dbUser.username);
        });
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

module.exports = passport;