const router = require("express").Router();
const vehicleController = require("../../controllers/vehicleController");

// Matches with "/api/vehicles"
router.route("/")
    .get(vehicleController.findAll)
    .post(vehicleController.create);


// Matches with "api/customers/find"
router.route("/findMultiple/q?")
    .get(vehicleController.findMultipleByParams);

// Matches with "/api/vehicles/:id"
router.route("/:id")
    .get(vehicleController.findById)
    .put(vehicleController.update)
    .delete(vehicleController.remove);

// Matches with "/api/vehicles/find"
router.route("/find/q?")
    .get(vehicleController.findByParams);

// Matches with "/api/vehicles/:id/transactions"
router.route("/:id/transactions")
    .get(vehicleController.pullTransactions);

module.exports = router;
