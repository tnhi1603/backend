const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

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
  getTaskListByUser,
  updateTaskStatus,
  updateTaskMember,
  getUserTaskStatistics,
} = require("../controllers/taskController");

router.get("/", getTaskList);
router.get("/sort/priority", getTaskListByPrioritySort);
router.get("/sort/status", getTaskListByStatusSort);
router.get("/filter/priority", getTaskListByPriorityFilter);
router.get("/filter/status", getTaskListByStatusFilter);
router.get("/find", findByUserInput);
router.get("/statistics", authMiddleware, getUserTaskStatistics);
router.get("/:id", getTask);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/user/:userId", getTaskListByUser);
router.patch("/:id/status", updateTaskStatus); // Cập nhật trạng thái task
router.patch("/:id/members", authMiddleware, updateTaskMember);

module.exports = router;
