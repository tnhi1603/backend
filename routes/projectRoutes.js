const express = require("express");
const {
  getProjects,
  getProjectByUserId,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.get("/", getProjects); // Lấy danh sách dự án
router.get("/user/:userId", getProjectByUserId); // Lấy dự án theo UserID
router.post("/", createProject); // Tạo dự án
router.put("/:id", updateProject); // Cập nhật dự án
router.delete("/:id", deleteProject); // Xóa dự án

module.exports = router;
