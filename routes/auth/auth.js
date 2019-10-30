const router = require("express").Router();
const passport = require("../../config/passport");

// Matches with "/auth/user"
router.route("/")
    // GET to check the current user
    .get((req, res, next) => {
        if (req.user) {
            console.log("User:");
            console.log(req.user);
            console.log("is logged in.")
            res.json({ user: req.user });
        } else {
            res.json({ user: false });
        }
    });

// Matches with "/auth/user/login"
router.route("/login")
    // POST to log a user in
    .post((req, res, next) => {
        console.log("Login attempt with the following credentials:");
        console.log(req.body);
        next();
    }, passport.authenticate("local"), (req, res) => {
        console.log("Successful login.", req.user);
        var userInfo = {
            username: req.user.username,
        };
        res.send(userInfo);
    });

// Matches with "/auth/user/logout"
router.route("/logout")
    // POST to log a user out
    .post((req, res, next) => {
        if (req.user) {
            req.logout();
            res.send({ msg: "Logging out." });
        } else {
            res.send({ msg: "No user logged in; aborting." });
        }
    });

module.exports = router;