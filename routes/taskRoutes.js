const express = require("express");
const router = express.Router();
const {
  getTaskList,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskListByPrioritySort,
  getTaskListByStatusSort,
  getTaskListByPriorityFilter,
  getTaskListByStatusFilter,
  findByUserInput,
} = require("../controllers/taskController");

router.get("/", getTaskList);
router.get("/sort/priority", getTaskListByPrioritySort);
router.get("/sort/status", getTaskListByStatusSort);
router.get("/filter/priority", getTaskListByPriorityFilter);
router.get("/filter/status", getTaskListByStatusFilter);
router.get("/find", findByUserInput);
router.get("/:id", getTask);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
