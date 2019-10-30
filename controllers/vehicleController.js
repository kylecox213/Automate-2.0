const db = require("../models");

// Defining methods for the VehiclesController
module.exports = {
    findAll: function (req, res) {
        db.Vehicle
            .findAll()
            .then(vehicles => res.json(vehicles))
            .catch(err => res.status(422).json(err));
    },
    findById: function (req, res) {
        db.Vehicle
            .findByPk(req.params.id)
            .then(vehicle => res.json(vehicle))
            .catch(err => res.status(422).json(err));
    },
    findMultipleByParams: function (req, res) {
        db.Vehicle
            .findAll({ where: req.query })
            .then(customers => res.json(customers))
            .catch(err => res.json(err));
    },
    findByParams: function (req, res) {
        db.Vehicle
            .findAll({ where: req.query })
            .then(vehicle => res.json(vehicle))
            .catch(err => res.json(err));

    },
    create: function (req, res) {
        console.log(req.body);
        db.Vehicle
            .create(req.body)
            .then(vehicle => res.json(vehicle))
            .catch(err => res.status(422).json(err));
    },
    update: function (req, res) {
        db.Vehicle
            .update(req.body, { where: { id: req.params.id } })
            .then(vehicle => res.json(vehicle))
            .catch(err => res.status(422).json(err));
    },
    remove: function (req, res) {
        db.Vehicle
            .destroy({ where: { id: req.params.id } })
            .then(res.json({ vehicleRemoved: true }))
            .catch(err => res.status(422).json(err));
    },
    pullTransactions: function (req, res) {
        db.Vehicle
            .findByPk(req.params.id)
            .then(vehicle => vehicle.getTransactions())
            .then(transactions => res.send(transactions))
            .catch(err => res.status(422).json(err));
    }
};
