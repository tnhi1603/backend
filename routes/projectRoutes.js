const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjectList,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

router.get("/", getProjectList);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
