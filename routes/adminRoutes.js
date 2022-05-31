const express = require("express");
const router = express.Router();
const {
  signUp,
  logIn,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/adminControllers");
const { protect, admin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, admin, getAllAdmins)
  .post(protect, admin, signUp);
router.route("/login").post(logIn);
router
  .route("/:id")
  .get(protect, admin, getAdminById)
  .put(protect, admin, updateAdmin)
  .delete(protect, admin, deleteAdmin);

module.exports = router;
