const taskModel = require("../models/Task");
const projectModel = require("../models/Project");

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
    // const task = await taskModel.findById(id);
    const task = await taskModel
      .aggregate([
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
          $addFields: {
            assigned_users: {
              $arrayElemAt: ["$assigned_users", 0],
            },
          },
        },
      ])
      .then(([result]) => {
        return result;
      });
    if (!task) {
      res.status(404).json("No task found!");
    }
    res.status(200).send(task);
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
    const { userId } = req.params; // Lấy userId từ request params
    const taskList = await taskModel.aggregate([
      {
        $match: { idUser: new mongoose.Types.ObjectId(userId) }, // Lọc các task thuộc user
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
            $arrayElemAt: ["$assigned_users", 0], // Lấy user đầu tiên từ danh sách assigned_users
          },
        },
      },
    ]);

    if (!taskList || taskList.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user." });
    }

    res.status(200).json(taskList);
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
};
