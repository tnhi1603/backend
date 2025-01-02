const Project = require("../models/Project");
const Task = require("../models/Task");

// Lấy danh sách dự án
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}); // Lấy tất cả dự án
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy dự án theo UserID
// Lấy thông tin dự án theo userId
const getProjectByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ tham số URL

    // Tìm kiếm dự án nơi userId là owner hoặc thuộc danh sách members
    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    }).populate("owner", "name email") // Populate để lấy thông tin chi tiết của owner
      .populate("members", "name email"); // Populate để lấy thông tin chi tiết của các members

    // Kiểm tra nếu không có dự án nào được tìm thấy
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this user." });
    }

    // Trả về danh sách dự án
    return res.status(200).json(projects);
  } catch (error) {
    // Xử lý lỗi và trả về thông báo lỗi
    console.error("Error fetching projects by userId:", error);
    return res.status(500).json({ message: "Failed to fetch projects. Please try again later." });
  }
};


// Tạo dự án mới
const createProject = async (req, res) => {
  try {
    const { name, description, owner, members, startDate, dueDate } = req.body;
    const newProject = await Project.create({
      name,
      description,
      owner,
      members,
      startDate,
      dueDate,
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
    const updatedProject = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProject)
      return res.status(404).json({ message: "Project not found" });
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa dự án
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm và xóa dự án
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Xóa tất cả task liên quan đến dự án
    // Update mới đúng logic hơn
    await Task.deleteMany({ projectId: id });

    res.status(200).json({
      message: "Project and its tasks deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectByUserId,
  createProject,
  updateProject,
  deleteProject,
};
