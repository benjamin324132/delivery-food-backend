const express = require("express");
const router = express.Router();
const {getAnalytics} = require("../controllers/analyticControllers");
const { protect, admin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get( getAnalytics)


module.exports = router;
