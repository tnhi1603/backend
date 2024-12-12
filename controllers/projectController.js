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

// Lấy dự án theo ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
