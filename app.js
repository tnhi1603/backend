const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");
const notiRoutes = require("./routes/notiRoutes");
const checkTaskDeadlines = require("./jobs/cronJobs");

const app = express();

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notification", notiRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

checkTaskDeadlines();

app.get("/", (req, res) => {
  res.send("API is running...");
});
