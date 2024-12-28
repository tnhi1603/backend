const express = require("express");
const {
  getUser,
  getAllUser,
  updateUser,
  deleteUser,
  changePassword,
} = require("../controllers/userController");
const router = express.Router();

router.get("/:id", getUser);
router.get("/", getAllUser);
router.put("/:id/update", updateUser);
router.post("/:id/delete", deleteUser);
router.put("/:id/changepassword", changePassword);

module.exports = router;
