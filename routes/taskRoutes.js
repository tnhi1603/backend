const express = require("express");
const router = express.Router();
const {
  getTaskList,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.get("/", getTaskList);
router.get("/:id", getTask);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
