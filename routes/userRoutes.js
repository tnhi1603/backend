const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  changeAvatar,
  upload,
  getAllUsers,
} = require("../controllers/userController");
const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id/update", updateUser);
router.post("/:id/delete", deleteUser);
router.put("/:id/changepassword", changePassword);
router.put("/:id/avatar", upload.single("avatar"), changeAvatar);

module.exports = router;
