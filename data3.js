// JavaScript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");
const Project = require("./models/Project");
const Task = require("./models/Task");
const Notification = require("./models/Notification");
const Attachment = require("./models/Attachment");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const seedData = async () => {
  try {
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Notification.deleteMany();
    await Attachment.deleteMany();

    console.log("Old data cleared.");

    // Hash password "123456" for all users
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Create 10 users
    const userNames = [
      "James Nguyen",
      "Alice Tran",
      "Bob Le",
      "Charlie Pham",
      "Diana Vo",
      "Evan Nguyen",
      "Fiona Huynh",
      "George Lam",
      "Hannah Truong",
      "Ian Ly",
    ];

    const users = await User.insertMany(
      userNames.map((name, i) => ({
        name,
        email: `james${i + 1}@e.com`,
        password: hashedPassword,
        avatar: `https://via.placeholder.com/150?text=User${i + 1}`,
      }))
    );

    console.log("Users added.");

    // Create 15 projects, each with a unique owner
    const projectData = [
      {
        name: "AI Data Analysis",
        description: "Develop AI solutions for big data analysis.",
      },
      {
        name: "E-commerce Platform",
        description: "Build a scalable e-commerce website.",
      },
      {
        name: "Mobile App Development",
        description: "Create a user-friendly mobile application.",
      },
      {
        name: "Healthcare System",
        description: "Develop a system for managing healthcare data.",
      },
      {
        name: "Educational Portal",
        description: "Build an online learning platform.",
      },
      {
        name: "Social Media App",
        description: "Design and develop a social media application.",
      },
      {
        name: "Finance Tracker",
        description: "Develop a tool for personal finance tracking.",
      },
      {
        name: "Project Management Tool",
        description: "Create a system to manage projects effectively.",
      },
      {
        name: "Travel Booking System",
        description: "Build a platform for booking travel services.",
      },
      {
        name: "Inventory Management",
        description: "Develop a system to manage inventory.",
      },
      {
        name: "Online Marketplace",
        description: "Create a marketplace for local products.",
      },
      {
        name: "Fitness Tracker App",
        description: "Build an app for tracking fitness activities.",
      },
      {
        name: "Customer Support System",
        description: "Develop a system for customer support.",
      },
      {
        name: "Restaurant Management",
        description: "Create a system to manage restaurant operations.",
      },
      {
        name: "Event Planning Tool",
        description: "Build a platform for planning and managing events.",
      },
    ];

    const projects = await Project.insertMany(
      projectData.map((project, i) => ({
        ...project,
        owner: users[i % 10]._id,
        members: [
          users[i % 10]._id,
          ...users.slice(i % 10, (i % 10) + 3).map((u) => u._id),
        ],
        startDate: new Date(`2025-01-${String(i + 1).padStart(2, "0")}`),
        dueDate: new Date(`2025-02-${String(i + 15).padStart(2, "0")}`),
      }))
    );

    console.log("Projects added.");

    // Function to assign task status based on dates
    const assignStatus = (task) => {
      const today = new Date("2025-01-10");
      if (task.dueDate < today) return "Completed";
      if (task.startDate <= today && task.dueDate >= today)
        return "In Progress";
      return "Not Started";
    };

    // Create 30 tasks, distributed across projects
    const taskData = [
      {
        title: "Data Collection",
        description: "Gather data for AI analysis.",
        projectIndex: 0,
      },
      {
        title: "Model Training",
        description: "Train the AI model with the collected data.",
        projectIndex: 0,
      },
      {
        title: "Frontend Development",
        description: "Develop the user interface for the e-commerce platform.",
        projectIndex: 1,
      },
      {
        title: "Backend Integration",
        description: "Integrate the frontend with backend APIs.",
        projectIndex: 1,
      },
      {
        title: "App Design",
        description: "Design the mobile application interface.",
        projectIndex: 2,
      },
      {
        title: "API Development",
        description: "Build APIs for the mobile app.",
        projectIndex: 2,
      },
      {
        title: "Database Setup",
        description: "Set up the database for the healthcare system.",
        projectIndex: 3,
      },
      {
        title: "Security Implementation",
        description: "Ensure data security for healthcare records.",
        projectIndex: 3,
      },
      {
        title: "Course Creation",
        description: "Develop courses for the educational portal.",
        projectIndex: 4,
      },
      {
        title: "Platform Deployment",
        description: "Deploy the educational portal.",
        projectIndex: 4,
      },
      {
        title: "UI Optimization",
        description: "Optimize the UI for the social media app.",
        projectIndex: 5,
      },
      {
        title: "Feature Enhancement",
        description: "Add new features to the social media app.",
        projectIndex: 5,
      },
      {
        title: "Expense Tracking",
        description: "Implement tracking for personal expenses.",
        projectIndex: 6,
      },
      {
        title: "Reporting Module",
        description: "Develop reporting features for finance tracking.",
        projectIndex: 6,
      },
      {
        title: "Team Collaboration",
        description:
          "Enable collaboration features in the project management tool.",
        projectIndex: 7,
      },
      {
        title: "Progress Dashboard",
        description: "Build a dashboard to track project progress.",
        projectIndex: 7,
      },
      {
        title: "Booking Interface",
        description: "Create an interface for travel bookings.",
        projectIndex: 8,
      },
      {
        title: "Payment Gateway",
        description: "Integrate payment gateways for travel bookings.",
        projectIndex: 8,
      },
      {
        title: "Inventory Monitoring",
        description: "Monitor stock levels in the inventory system.",
        projectIndex: 9,
      },
      {
        title: "Order Fulfillment",
        description: "Automate order processing in the inventory system.",
        projectIndex: 9,
      },
      {
        title: "Vendor Onboarding",
        description: "Onboard vendors to the online marketplace.",
        projectIndex: 10,
      },
      {
        title: "Product Listings",
        description: "Enable product listings for the marketplace.",
        projectIndex: 10,
      },
      {
        title: "Workout Tracking",
        description: "Track workout sessions in the fitness app.",
        projectIndex: 11,
      },
      {
        title: "User Goals",
        description: "Set and monitor fitness goals for users.",
        projectIndex: 11,
      },
      {
        title: "Support Tickets",
        description: "Manage customer support tickets.",
        projectIndex: 12,
      },
      {
        title: "Feedback System",
        description: "Implement a feedback mechanism for customers.",
        projectIndex: 12,
      },
      {
        title: "Menu Management",
        description: "Manage restaurant menus in the system.",
        projectIndex: 13,
      },
      {
        title: "Reservation System",
        description:
          "Enable reservations through the restaurant management tool.",
        projectIndex: 13,
      },
      {
        title: "Event Templates",
        description: "Provide templates for event planning.",
        projectIndex: 14,
      },
      {
        title: "Guest List Management",
        description: "Manage guest lists for events.",
        projectIndex: 14,
      },
    ].map((task, i) => {
      const project = projects[task.projectIndex];
      const user = users[i % users.length];
      const startDate = new Date(
        `2025-01-${String((i % 20) + 1).padStart(2, "0")}`
      );
      const dueDate = new Date(
        `2025-01-${String((i % 20) + 10).padStart(2, "0")}`
      );

      return {
        title: task.title,
        description: task.description,
        priority: ["Low", "Medium", "High"][i % 3],
        status: assignStatus({ startDate, dueDate }),
        project: project._id,
        idUser: user._id,
        startDate,
        dueDate,
      };
    });

    const tasks = await Task.insertMany(taskData);

    console.log("Tasks added.");

    console.log("Seeding completed.");
    process.exit();
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
};

seedData();
