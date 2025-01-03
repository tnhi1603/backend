const Project = require("../models/Project");
const Task = require("../models/Task");
const Notification = require("../models/Notification");

// Lấy danh sách dự án
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}); // Lấy tất cả dự án
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy dự án theo Project ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate("owner", "name email")
      .populate("members", "name email")
      .populate({
        path: "tasks",
        populate: { path: "idUser", select: "name email" },
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Tính tiến độ dự án
    const completedTasks = project.tasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const totalTasks = project.tasks.length;
    const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    res.status(200).json({ ...project.toObject(), progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy dự án theo UserID
const getProjectByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ tham số URL

    // Tìm kiếm dự án nơi userId là owner hoặc thuộc danh sách members
    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    })
      .populate("owner", "name email") // Populate để lấy thông tin chi tiết của owner
      .populate("members", "name email"); // Populate để lấy thông tin chi tiết của các members

    // Kiểm tra nếu không có dự án nào được tìm thấy
    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for this user." });
    }

    // Trả về danh sách dự án
    return res.status(200).json(projects);
  } catch (error) {
    // Xử lý lỗi và trả về thông báo lỗi
    console.error("Error fetching projects by userId:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch projects. Please try again later." });
  }
};

// Tạo dự án mới
const createProject = async (req, res) => {
  try {
    const { name, description, members, startDate, dueDate } = req.body;
    const owner = req.user.id; // Lấy từ middleware xác thực

    const newProject = new Project({
      name,
      description,
      owner,
      members, // Có thể thêm logic để kiểm tra sự tồn tại của user
      startDate,
      dueDate,
    });

    await newProject.save();

    // Tạo thông báo cho các thành viên
    members.forEach((memberId) => {
      Notification.create({
        userId: memberId,
        content: `Bạn đã được thêm vào dự án: ${newProject.name}`,
        isRead: false,
      });
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật dự án
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Kiểm tra quyền sở hữu
    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: Not the project owner" });
    }

    const updatedProject = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa dự án
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Kiểm tra quyền sở hữu
    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: Not the project owner" });
    }

    await Project.findByIdAndDelete(id);
    await Task.deleteMany({ project: id });

    res
      .status(200)
      .json({ message: "Project and its tasks deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy task theo Project
const getTasksByProjectId = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ project: id }).populate(
      "idUser",
      "name email"
    );

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ project: id });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const inProgressTasks = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;
    const notStartedTasks = tasks.filter(
      (task) => task.status === "Not Started"
    ).length;

    res.status(200).json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      notStartedTasks,
      progress: totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const filterProjects = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    const projects = await Project.find(filter)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchProjects = async (req, res) => {
  try {
    const { keyword, status, startDate, dueDate } = req.query;
    let query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (startDate) {
      query.startDate = { $gte: new Date(startDate) };
    }

    if (dueDate) {
      query.dueDate = { $lte: new Date(dueDate) };
    }

    const projects = await Project.find(query)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const updateProjectMembers = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { members } = req.body; // Danh sách userId thêm vào

//     const project = await Project.findById(id);
//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     // Kiểm tra quyền sở hữu
//     if (project.owner.toString() !== req.user.id) {
//       return res
//         .status(403)
//         .json({ message: "Forbidden: Not the project owner" });
//     }

//     // Lấy danh sách thành viên hiện tại
//     const currentMembers = project.members.map((member) => member.toString());

//     // Xác định các thành viên bị xóa
//     const removedMembers = currentMembers.filter(
//       (member) => !members.includes(member)
//     );

//     // Cập nhật danh sách thành viên
//     project.members = members;
//     await project.save();

//     // Tạo thông báo cho các thành viên mới
//     members.forEach((memberId) => {
//       if (!currentMembers.includes(memberId)) {
//         Notification.create({
//           userId: memberId,
//           content: `Bạn đã được thêm vào dự án: ${project.name}`,
//           isRead: false,
//         });
//       }
//     });

//     // Xử lý các task của thành viên bị xóa
//     if (removedMembers.length > 0) {
//       await Task.updateMany(
//         { project: id, idUser: { $in: removedMembers } },
//         { $unset: { idUser: "" } }
//       );
//     }

//     res.status(200).json(project);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const updateProjectMembers = async (req, res) => {
  console.log(req.params);
  try {
    const { id } = req.params;
    const { members } = req.body; // Danh sách userId thêm vào

    console.log("Project ID:", id);
    console.log("Members to update:", members);

    const project = await Project.findById(id);
    if (!project) {
      console.log("Project not found");
      return res.status(404).json({ message: "Project not found" });
    }

    // Kiểm tra quyền sở hữu
    if (project.owner.toString() !== req.user.id) {
      console.log("Forbidden: Not the project owner");
      return res
        .status(403)
        .json({ message: "Forbidden: Not the project owner" });
    }

    // Lấy danh sách thành viên hiện tại
    const currentMembers = project.members.map((member) => member.toString());
    console.log("Current members:", currentMembers);

    // Xác định các thành viên bị xóa
    const removedMembers = currentMembers.filter(
      (member) => !members.includes(member)
    );
    console.log("Removed members:", removedMembers);

    // Cập nhật danh sách thành viên
    project.members = members;
    await project.save();
    console.log("Updated project members:", project.members);

    // Tạo thông báo cho các thành viên mới
    members.forEach((memberId) => {
      if (!currentMembers.includes(memberId)) {
        Notification.create({
          userId: memberId,
          content: `Bạn đã được thêm vào dự án: ${project.name}`,
          isRead: false,
        });
        console.log(`Notification created for user: ${memberId}`);
      }
    });

    // Xử lý các task của thành viên bị xóa
    if (removedMembers.length > 0) {
      await Task.updateMany(
        { project: id, idUser: { $in: removedMembers } },
        { $unset: { idUser: "" } }
      );
      console.log("Tasks updated for removed members");
    }

    res.status(200).json(project);
  } catch (error) {
    console.log("Error updating project members:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
