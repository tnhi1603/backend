const projectModel = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const project = await projectModel.create(req.body);
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectList = async (req, res) => {
  try {
    const projectList = await projectModel.find({});
    res.status(200).send(projectList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectModel.findById(id);
    if (project) {
      res.status(200).send(project);
    } else {
      res.status(404).json("No project found!");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectModel.findByIdAndUpdate(id, req.body);
    if (project) {
      const updateProject = await projectModel.findById(id);
      res.status(200).send(updateProject);
    } else {
      res.status(404).json("Update fail!");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectModel.findByIdAndDelete(id);
    if (project) {
      res.status(200).json("Project deleted successfully!");
    } else {
      res.status(404).json("Project not found!");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjectList,
  getProjectById,
  updateProject,
  deleteProject,
};
