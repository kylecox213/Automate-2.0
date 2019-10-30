const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");
const authRoutes = require("./auth");

// API Routes
router.use("/api", apiRoutes);

// Authentication Routes
router.use("/auth", authRoutes);

// If no other routes are hit, send the React app
router.use(function (req, res) {
  // If in production...
  if (process.env.NODE_ENV === "production") {
    // Send the client the index inside the build directory
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  }
  // Otherwise...
  else {
    res.sendFile(path.join(__dirname, "../client/public/index.html"));
  }
});

module.exports = router;
