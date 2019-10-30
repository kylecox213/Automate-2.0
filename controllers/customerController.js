const db = require("../models");

// Defining methods for the customersController
module.exports = {
    findAll: function (req, res) {
        db.Customer
            .findAll()
            .then(customers => res.json(customers))
            .catch(err => res.status(422).json(err));
    },
    findById: function (req, res) {
        db.Customer
            .findByPk(req.params.id)
            .then(customer => res.json(customer))
            .catch(err => res.status(422).json(err));
    },
    findByParams: function (req, res) {
        db.Customer
            .findOne({ where: req.query })
            .then(customer => res.json(customer))
            .catch(err => res.json(err));
    },
    findMultipleByParams: function (req, res) {
        db.Customer
            .findAll({ where: req.query })
            .then(customers => res.json(customers))
            .catch(err => res.json(err));
    },
    create: function (req, res) {
        db.Customer
            .create(req.body)
            .then(customer => res.json(customer))
            .catch(err => res.status(422).json(err));
    },
    addNewWithVehicle: function (req, res) {
        db.Customer
            .create(req.body.customerData)
            .then(customer => {
                customer.createVehicle(req.body.vehicleData)
                    .then(vehicle => {
                        res.json(customer);
                    })
                    .catch(err => res.status(422).json(err));
            })
            .catch(err => res.status(422).json(err));
    },
    update: function (req, res) {
        db.Customer
            .update(req.body, { where: { id: req.params.id } })
            .then(customer => {
                res.json(customer)
            })
            .catch(err => res.status(422).json(err));
    },
    remove: function (req, res) {
        db.Customer
            .destroy({ where: { id: req.params.id } })
            .then(res.json({ customerRemoved: true }))
            .catch(err => res.status(422).json(err));
    },
    pullTransactions: function (req, res) {
        db.Customer
            .findByPk(req.params.id)
            .then(customer => customer.getTransactions())
            .then(transactions => res.send(transactions))
            .catch(err => res.status(422).json(err));
    },
    pullVehicles: function (req, res) {
        db.Customer
            .findByPk(req.params.id)
            .then(customer => customer.getVehicles())
            .then(vehicles => res.send(vehicles))
            .catch(err => res.status(422).json(err));
    },
    pullRelatives: function (req, res) {
        db.Customer
            .findByPk(req.params.id)
            .then(customer => customer.getCustomers())
            .then(relatives => res.send(relatives))
            .catch(err => res.status(422).json(err));
    }
};
