const express = require("express");
const router = express.Router();
const {
  addNewDish,
  getDishes,
  getDishesByLocation,
  getDishById,
  updateDish,
  deleteDish,
} = require("../controllers/dishControllers");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(getDishes).post(protect, admin, addNewDish);
router.route("/location/:lat/:long").get(getDishesByLocation)
router
  .route("/:id")
  .get(getDishById)
  .put(protect, admin, updateDish)
  .delete(protect, admin, deleteDish);

module.exports = router;
