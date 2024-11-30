const taskModel = require("../models/Task");

const getTaskList = async (req, res) => {
  try {
    const taskList = await taskModel.find({});
    res.status(200).send(taskList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskModel.findById(id);
    if (!task) {
      res.status(404).json("No task found!");
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await taskModel.create(req.body);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskModel.findByIdAndUpdate(id, req.body);
    if (!task) {
      res.status(404).json("Update fail!");
    }
    const updatedTask = await taskModel.findById(id);
    res.status(200).send(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskModel.findByIdAndDelete(id);
    if (!task) {
      res.status(404).json({ message: "Task not found!" });
    }
    res.status(200).json("Product deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTaskList,
  getTask,
  updateTask,
  deleteTask,
  createTask,
};
