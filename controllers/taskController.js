const mongoose = require("mongoose");
const taskModel = require("../models/Task");
const projectModel = require("../models/Project");
const Notification = require("../models/Notification");

const getTaskList = async (req, res) => {
  try {
    const taskList = await taskModel.aggregate([
      // Lookup từ "users" để lấy thông tin assigned_users
      {
        $lookup: {
          from: "users",
          localField: "idUser",
          foreignField: "_id",
          as: "assigned_users",
        },
      },
      {
        $addFields: {
          assigned_users: {
            $arrayElemAt: ["$assigned_users", 0], // Lấy phần tử đầu tiên của mảng
          },
        },
      },
      // Lookup từ "projects" để lấy thông tin project name
      {
        $lookup: {
          from: "projects", // Tên collection projects
          localField: "project", // Trường project trong taskModel
          foreignField: "_id", // Trường _id trong collection projects
          as: "project_details",
        },
      },
      {
        $addFields: {
          project_name: {
            $arrayElemAt: ["$project_details.name", 0], // Lấy field "name" từ project_details
          },
        },
      },
      // Loại bỏ trường không cần thiết (nếu cần)
      {
        $project: {
          project_details: 0, // Ẩn toàn bộ project_details
        },
      },
    ]);

    res.status(200).send(taskList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await taskModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "idUser",
          foreignField: "_id",
          as: "assigned_users",
        },
      },
      {
        $unwind: "$assigned_users",
      },
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "project_details",
        },
      },
      {
        $unwind: "$project_details",
      },
      {
        $lookup: {
          from: "users",
          localField: "project_details.owner",
          foreignField: "_id",
          as: "project_owner",
        },
      },
      {
        $unwind: "$project_owner",
      },
      {
        $addFields: {
          project_owner: {
            _id: "$project_owner._id",
            name: "$project_owner.name",
            email: "$project_owner.email",
          },
        },
      },
    ]);

    if (!task || task.length === 0) {
      return res.status(404).json({ message: "Task not found!" });
    }

    res.status(200).json(task[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// http://localhost:5001/api/task/sort?value=1
const getTaskListByPrioritySort = async (req, res) => {
  try {
    const { value } = req.query;
    console.log(typeof value);
    const task = await taskModel.aggregate([
      {
        $sort: { priority: Number(value) },
      },
      {
        $lookup: {
          from: "users",
          localField: "idUser",
          foreignField: "_id",
          as: "assigned_users",
        },
      },
      {
        $addFields: {
          assigned_users: {
            $arrayElemAt: ["$assigned_users", 0],
          },
        },
      },
    ]);
    if (!task) {
      res.status(403).json("Something wrong!");
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskListByStatusSort = async (req, res) => {
  try {
    const { value } = req.query;
    console.log(typeof value);
    const task = await taskModel.aggregate([
      {
        $sort: { status: Number(value) },
      },
      {
        $lookup: {
          from: "users",
          localField: "idUser",
          foreignField: "_id",
          as: "assigned_users",
        },
      },
      {
        $addFields: {
          assigned_users: {
            $arrayElemAt: ["$assigned_users", 0],
          },
        },
      },
    ]);
    if (!task) {
      res.status(403).json("Something wrong!");
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// http://localhost:5001/api/task/filter?value=High
const getTaskListByPriorityFilter = async (req, res) => {
  try {
    const { value } = req.query;
    // const task = await taskModel.where(field).equals(value);
    const task = await taskModel.aggregate([
      {
        $match: { priority: `${value}` },
      },
      {
        $lookup: {
          from: "users",
          localField: "idUser",
          foreignField: "_id",
          as: "assigned_users",
        },
      },
      {
        $addFields: {
          assigned_users: {
            $arrayElemAt: ["$assigned_users", 0],
          },
        },
      },
    ]);
    if (!task) {
      res.status(403).json("Something wrong!");
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskListByStatusFilter = async (req, res) => {
  try {
    const { value } = req.query;
    // const task = await taskModel.where(field).equals(value);
    const task = await taskModel.aggregate([
      {
        $match: { status: `${value}` },
      },
      {
        $lookup: {
          from: "users",
          localField: "idUser",
          foreignField: "_id",
          as: "assigned_users",
        },
      },
      {
        $addFields: {
          assigned_users: {
            $arrayElemAt: ["$assigned_users", 0],
          },
        },
      },
    ]);
    if (!task) {
      res.status(403).json("Something wrong!");
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await taskModel.create(req.body);
    if (task.idUser) {
      Notification.create({
        userId: task.idUser,
        content: `Bạn đã được giao một Task mới: ${task.title}`,
        isRead: false,
      });
    }

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

// input pattern-matching with title or description
const getTaskByUserInput = async (value) => {
  const task = await taskModel.aggregate([
    {
      $match: {
        $or: [{ title: { $regex: value } }, { description: { $regex: value } }],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "idUser",
        foreignField: "_id",
        as: "assigned_users",
      },
    },
    {
      $addFields: {
        assigned_users: {
          // $first: "$assigned_users",
          $arrayElemAt: ["$assigned_users", 0],
        },
      },
    },
  ]);
  return task;
};

// input pattern-matching with name or description
const getProjectByUserInput = async (value) => {
  const project = await projectModel.aggregate([
    {
      $match: {
        $or: [{ name: { $regex: value } }, { description: { $regex: value } }],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner_users",
      },
      $lookup: {
        from: "users",
        localField: "members",
        foreignField: "_id",
        as: "member_users",
      },
    },
    {
      $addFields: {
        owner_users: {
          // $first: "$assigned_users",
          $arrayElemAt: ["$owner_users", 0],
        },
      },
      $addFields: {
        member_users: {
          // $first: "$assigned_users",
          $arrayElemAt: ["$member_users", 0],
        },
      },
    },
  ]);
  return project;
};

// find by user input
// http://localhost:5001/api/task/find?value=Project Alpha
const findByUserInput = async (req, res) => {
  try {
    const { value } = req.query;
    const task = await getTaskByUserInput(value);
    const project = await getProjectByUserInput(value);
    const result = {
      tasks: task,
      projects: project,
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskListByUser = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ tham số URL

    const tasks = await taskModel.aggregate([
      {
        $match: { idUser: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "project_details",
        },
      },
      {
        $unwind: "$project_details",
      },
      {
        $lookup: {
          from: "users",
          localField: "project_details.owner",
          foreignField: "_id",
          as: "project_owner",
        },
      },
      {
        $unwind: "$project_owner",
      },
      {
        $addFields: {
          project_owner: {
            _id: "$project_owner._id",
            name: "$project_owner.name",
            email: "$project_owner.email",
          },
        },
      },
    ]);

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user." });
    }

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by userId:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch tasks. Please try again later." });
  }
};

// Cập nhật trạng thái task
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Tìm và cập nhật task
    const task = await taskModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate("project", "owner members");

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Gửi thông báo tới owner và các thành viên được giao task
    const ownerId = task.project.owner;
    const memberIds = task.project.members;

    const recipients = [
      ownerId.toString(),
      ...memberIds.map((id) => id.toString()),
    ];

    const notifications = recipients.map((userId) => ({
      userId: userId,
      content: `Task "${task.title}" đã được cập nhật trạng thái thành "${status}".`,
      task: task._id,
    }));

    await Notification.insertMany(notifications);

    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Failed to update task status." });
  }
};

const updateTaskMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { idUser } = req.body; // User ID của thành viên mới

    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.idUser = idUser;
    await task.save();

    // Tạo thông báo cho thành viên mới
    Notification.create({
      userId: idUser,
      content: `Bạn đã được giao một Task mới: ${task.title}`,
      isRead: false,
    });

    res.status(200).json(task);
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
  getTaskListByPrioritySort,
  getTaskListByStatusSort,
  getTaskListByPriorityFilter,
  getTaskListByStatusFilter,
  findByUserInput,
  getTaskListByUser,
  updateTaskStatus,
  updateTaskMember,
};
