const db = require("../models");

// Defining methods for the UsersController
module.exports = {
    findAll: function (req, res) {
        db.User
            .findAll()
            .then(users => res.json(users))
            .catch(err => res.status(422).json(err));
    },
    findById: function (req, res) {
        db.User
            .findByPk(req.params.id)
            .then(user => res.json(user))
            .catch(err => res.status(422).json(err));
    },
    // ------------------------------------------------------------
    // Commented out for testing
    // ------------------------------------------------------------
    create: function (req, res) {
        console.log("Session:");
        console.log(req.session);
        console.log("User registration request with the following credentials:");
        console.log(req.body);
        // On request to create a new user, first check to see if an existing user already has that name
        db.User
            .findOne({ where: { username: req.body.username } })
            .then(existingUser => {
                // If there is an existing user with that name...
                if (existingUser) {
                    // Send the HTTP status 409 - Conflict
                    // Along with a piece of JSON to point out the reason for failure
                    res.status(409).json({userExists: true});
                    return;
                }
                // Otherwise, proceed with new user creation
                else {
                    db.User.create(req.body)
                        // After creating the new user, return it
                        .then(newUser => {
                            req.session.username = newUser.username;
                            console.log("Updated session");
                            console.log(req.session);
                        })
                        // And then redirect the user through the login route to be authenticated and logged in
                        .then(res.redirect("/api/users/login"))
                        // If there's an error, send it to the client
                        .catch(err => res.status(422).json(err));
                }
            });
    },
    update: function (req, res) {
        db.User
            .update(req.body, { where: { id: req.params.id } })
            .then(user => res.json(user))
            .catch(err => res.status(422).json(err));
    },
    remove: function (req, res) {
        db.User
            .destroy({ where: { id: req.params.id } })
            .then(res.json({ userRemoved: true }))
            .catch(err => res.status(422).json(err));
    },
    pullTransactions: function (req, res) {
        db.User
            .findByPk(req.params.id)
            .then(user => user.getTransactions())
            .then(transactions => res.send(transactions))
            .catch(err => res.status(422).json(err));
    },
    pullReports: function (req, res) {
        db.User
            .findByPk(req.params.id)
            .then(user => user.getReports())
            .then(reports => res.send(reports))
            .catch(err => res.status(422).json(err));
    }

};
