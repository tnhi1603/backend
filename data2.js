const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Import các models
const User = require("./models/User");
const Project = require("./models/Project");
const Task = require("./models/Task");
const Notification = require("./models/Notification");
const Attachment = require("./models/Attachment");

// Load biến môi trường
dotenv.config();

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Seed dữ liệu
const seedData = async () => {
  try {
    // Xóa dữ liệu cũ
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Notification.deleteMany();
    await Attachment.deleteMany();

    console.log("Old data cleared.");

    // Tạo Users
    const hashedPassword = await bcrypt.hash("123456", 10);
    const users = await User.insertMany([
      {
        name: "James",
        email: "james@e.com",
        password: hashedPassword,
        avatar: "https://via.placeholder.com/150",
      },
      {
        name: "Bob",
        email: "bob@e.com",
        password: hashedPassword,
        avatar: "https://via.placeholder.com/150",
      },
    ]);

    console.log("2 Users added.");

    // Tạo Projects
    const projects = await Project.insertMany([
      {
        name: "James' Project",
        description: "This is a project managed by James",
        owner: users[0]._id,
        members: [users[0]._id, users[1]._id], // Bob là thành viên
        startDate: new Date("2024-01-01"),
        dueDate: new Date("2024-06-01"),
      },
      {
        name: "Bob's Project",
        description: "This is a project managed by Bob",
        owner: users[1]._id,
        members: [users[1]._id, users[0]._id], // James là thành viên
        startDate: new Date("2024-02-01"),
        dueDate: new Date("2024-07-01"),
      },
    ]);

    console.log("2 Projects added.");

    // Tạo Tasks
    const tasks = await Task.insertMany([
      {
        title: "Set up Git repository",
        description: "Initialize Git for James' Project",
        priority: "High",
        status: "In Progress",
        project: projects[0]._id,
        startDate: new Date("2024-01-15"),
        dueDate: new Date("2024-02-15"),
        idUser: users[0]._id,
      },
      {
        title: "Create project schema",
        description: "Define schema for Bob's Project",
        priority: "Medium",
        status: "In Progress",
        project: projects[1]._id,
        startDate: new Date("2024-02-20"),
        dueDate: new Date("2024-03-15"),
        idUser: users[1]._id,
      },
    ]);

    console.log("Tasks added.");

    // Tạo Notifications
    const notifications = await Notification.insertMany([
      {
        userId: users[0]._id,
        content: "You have been assigned a task in Bob's Project",
        isRead: false,
      },
      {
        userId: users[1]._id,
        content: "You have been added to James' Project",
        isRead: true,
      },
    ]);

    console.log("Notifications added.");

    // Tạo Attachments
    const attachments = await Attachment.insertMany([
      {
        taskId: tasks[0]._id,
        fileUrl: "https://example.com/file1.pdf",
        uploadedBy: users[0]._id,
      },
      {
        taskId: tasks[1]._id,
        fileUrl: "https://example.com/file2.docx",
        uploadedBy: users[1]._id,
      },
    ]);

    console.log("Attachments added.");
    console.log("Seeding completed.");
    process.exit();
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
};

seedData();
