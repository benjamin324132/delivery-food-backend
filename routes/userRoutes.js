const express = require("express");
const router = express.Router();
const {
  signUp,
  logIn,
  getAllUsers,
  getUserById,
  updateUser,
  updateMe,
  deleteUser,
} = require("../controllers/userControllers");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(protect, admin, getAllUsers).post(signUp);
router.route("/login").post(logIn);
router.route("/update").put(protect, updateMe);
router
  .route("/:id")
  .get(protect, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
