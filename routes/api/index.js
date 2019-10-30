const router = require("express").Router();
const vehicleRoutes = require("./vehicle");
const reportRoutes = require("./report");
const transactionRoutes = require("./transaction");
const userRoutes = require("./user");
const customerRoutes = require("./customer");
const isAuthenticated = require("../../config/middleware/isAuthenticated");

// API routes
// Require the user to be authenticated to use any routes except for the users routes
// Allows people to login without already being authenticated, but prevents other utilities
router.use("/vehicles", vehicleRoutes);
router.use("/reports", reportRoutes);
router.use("/transactions", transactionRoutes);
router.use("/users", userRoutes);
router.use("/customers", customerRoutes);

module.exports = router;
