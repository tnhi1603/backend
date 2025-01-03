const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware.js");
const {
  getProjects,
  getProjectById,
  getProjectByUserId,
  createProject,
  updateProject,
  deleteProject,
  getTasksByProjectId,
  getProjectStatistics,
  filterProjects,
  searchProjects,
  updateProjectMembers,
} = require("../controllers/projectController");

const router = express.Router();

router.get("/", getProjects); // Lấy danh sách dự án
router.get("/:id", getProjectById); // Lấy dự án theo ID
router.get("/user/:userId", getProjectByUserId); // Lấy dự án theo UserID
router.get("/:id/tasks", getTasksByProjectId);
router.get("/:id/statistics", getProjectStatistics);
router.get("/filter", filterProjects);
router.get("/search", searchProjects);
router.patch("/:id/members", authMiddleware, updateProjectMembers);

// Áp dụng authMiddleware cho các route liên quan đến dự án
router.get("/:id", authMiddleware, getProjectById);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);
router.post("/", authMiddleware, createProject);

module.exports = router;
