const express = require("express");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.get("/", getProjects); // Lấy danh sách dự án
router.get("/:id", getProjectById); // Lấy dự án theo ID
router.post("/", createProject); // Tạo dự án
router.put("/:id", updateProject); // Cập nhật dự án
router.delete("/:id", deleteProject); // Xóa dự án

module.exports = router;
