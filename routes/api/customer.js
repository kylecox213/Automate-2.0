const router = require("express").Router();
const customerController = require("../../controllers/customerController");

// Matches with "/api/customers"
router.route("/")
    .get(customerController.findAll)
    .post(customerController.create);

// Matches with "api/customers/find"
router.route("/find/q?")
    .get(customerController.findByParams);

// Matches with "api/customers/find"
router.route("/findMultiple/q?")
    .get(customerController.findMultipleByParams);

// Matches with "api/customers/add/withVehicle"
router.route("/addNewWithVehicle")
    .post(customerController.addNewWithVehicle);

// Matches with "/api/customers/:id"
router.route("/:id")
    .get(customerController.findById)
    .put(customerController.update)
    .delete(customerController.remove);

// Matches with "/api/customers/:id/transactions"
router.route("/:id/transactions")
    .get(customerController.pullTransactions);

// Matches with "/api/customers/:id/vehicles"
router.route("/:id/vehicles")
    .get(customerController.pullVehicles);

// Matches with "/api/customers/:id/vehicles"
router.route("/:id/relatives")
    .get(customerController.pullRelatives);

module.exports = router;
