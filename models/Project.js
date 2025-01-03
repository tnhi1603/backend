const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  avatar: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  startDate: Date,
  dueDate: Date,
  status: {
    type: String,
    enum: ["In Progress", "Completed", "Closed"],
    default: "In Progress",
  },
});
// Virtual để populate tasks liên quan đến dự án
ProjectSchema.virtual("tasks", {
  ref: "Task", // Model Task
  localField: "_id", // Trường trong Project
  foreignField: "project", // Trường trong Task
});

// Đảm bảo virtuals được bao gồm trong JSON và Object
ProjectSchema.set("toObject", { virtuals: true });
ProjectSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Project", ProjectSchema);
