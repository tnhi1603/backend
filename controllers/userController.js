const userModel = require("../models/User");

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      res.status(404).json("No user found!");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndUpdate(id, req.body);
    if (!user) {
      res.status(404).json("Update fail!");
    }
    const updatedUser = await userModel.findById(id);
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json("User deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {getUser, updateUser, deleteUser};
