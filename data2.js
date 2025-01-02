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

    // Mật khẩu đổi thành "123456"
    const hashedPasswordJames = await bcrypt.hash("123456", 10);
    const hashedPasswordAlice = await bcrypt.hash("123456", 10);
    const hashedPasswordBob = await bcrypt.hash("123456", 10);

    // Tạo 3 user
    const james = await User.create({
      name: "James",
      email: "james@e.com",
      password: hashedPasswordJames,
      avatar: "https://via.placeholder.com/150",
    });

    const alice = await User.create({
      name: "Alice",
      email: "alice@e.com",
      password: hashedPasswordAlice,
      avatar: "https://via.placeholder.com/150",
    });

    const bob = await User.create({
      name: "Bob",
      email: "bob@e.com",
      password: hashedPasswordBob,
      avatar: "https://via.placeholder.com/150",
    });

    console.log("Users added.");

    // Tạo các project
    const jamesProject = await Project.create({
      name: "Dự án AI cho James",
      description: "Phát triển AI phục vụ phân tích dữ liệu lớn.",
      owner: james._id,
      members: [james._id],
      startDate: new Date("2025-01-01"),
      dueDate: new Date("2025-06-01"),
    });

    const aliceProject = await Project.create({
      name: "Dự án Web cho Alice",
      description: "Phát triển website thương mại điện tử.",
      owner: alice._id,
      members: [alice._id],
      startDate: new Date("2025-02-01"),
      dueDate: new Date("2025-07-01"),
    });

    const bobProject = await Project.create({
      name: "Dự án Mobile cho Bob",
      description: "Phát triển ứng dụng di động.",
      owner: bob._id,
      members: [bob._id],
      startDate: new Date("2025-03-01"),
      dueDate: new Date("2025-08-01"),
    });

    const sharedProject = await Project.create({
      name: "Dự án chung",
      description: "Dự án hợp tác giữa các thành viên.",
      owner: james._id,
      members: [james._id, alice._id, bob._id],
      startDate: new Date("2025-04-01"),
      dueDate: new Date("2025-09-01"),
    });

    console.log("Projects added.");

    // Define today's date
    const today = new Date("2025-01-02");

    // Function to assign status based on dates
    const assignStatus = (task) => {
      if (task.dueDate < today) return "Completed";
      if (task.startDate <= today && task.dueDate >= today)
        return "In Progress";
      return "Not Started";
    };

    // Tạo nhiều task cho mỗi user
    const tasksForJames = [
      {
        title: "Phân tích yêu cầu",
        description: "Thu thập và phân tích yêu cầu dữ liệu AI",
        priority: "High",
        project: jamesProject._id,
        startDate: new Date("2025-01-05"),
        dueDate: new Date("2025-01-10"),
        idUser: james._id,
      },
      {
        title: "Thiết kế kiến trúc hệ thống",
        description: "Phác thảo mô hình và quy trình xử lý dữ liệu",
        priority: "Medium",
        project: jamesProject._id,
        startDate: new Date("2025-01-11"),
        dueDate: new Date("2025-01-20"),
        idUser: james._id,
      },
      {
        title: "Phát triển mô hình Machine Learning",
        description: "Xây dựng và huấn luyện mô hình học máy",
        priority: "High",
        project: jamesProject._id,
        startDate: new Date("2025-01-21"),
        dueDate: new Date("2025-02-10"),
        idUser: james._id,
      },
      {
        title: "Kiểm thử quy trình",
        description: "Viết test case và kiểm thử toàn bộ hệ thống",
        priority: "Low",
        project: jamesProject._id,
        startDate: new Date("2025-02-11"),
        dueDate: new Date("2025-02-20"),
        idUser: james._id,
      },
      {
        title: "Triển khai môi trường production",
        description: "Cấu hình server và triển khai mô hình AI",
        priority: "Medium",
        project: jamesProject._id,
        startDate: new Date("2025-02-21"),
        dueDate: new Date("2025-03-01"),
        idUser: james._id,
      },
      {
        title: "Tối ưu hiệu năng",
        description: "Tối ưu tốc độ xử lý và tài nguyên hệ thống",
        priority: "High",
        project: jamesProject._id,
        startDate: new Date("2025-03-02"),
        dueDate: new Date("2025-03-10"),
        idUser: james._id,
      },
      {
        title: "Bảo trì hệ thống",
        description: "Đảm bảo hệ thống hoạt động ổn định",
        priority: "Medium",
        project: sharedProject._id,
        startDate: new Date("2025-03-11"),
        dueDate: new Date("2025-03-20"),
        idUser: james._id,
      },
    ];

    const tasksForAlice = [
      {
        title: "Thiết kế giao diện",
        description: "Thiết kế giao diện người dùng cho website",
        priority: "High",
        project: aliceProject._id,
        startDate: new Date("2025-02-05"),
        dueDate: new Date("2025-02-15"),
        idUser: alice._id,
      },
      {
        title: "Phát triển frontend",
        description: "Xây dựng frontend cho website",
        priority: "Medium",
        project: aliceProject._id,
        startDate: new Date("2025-02-16"),
        dueDate: new Date("2025-03-01"),
        idUser: alice._id,
      },
      {
        title: "Phát triển backend",
        description: "Xây dựng backend cho website",
        priority: "High",
        project: aliceProject._id,
        startDate: new Date("2025-03-02"),
        dueDate: new Date("2025-03-20"),
        idUser: alice._id,
      },
      {
        title: "Kiểm thử website",
        description: "Viết test case và kiểm thử toàn bộ website",
        priority: "Low",
        project: aliceProject._id,
        startDate: new Date("2025-03-21"),
        dueDate: new Date("2025-04-01"),
        idUser: alice._id,
      },
      {
        title: "Triển khai website",
        description: "Cấu hình server và triển khai website",
        priority: "Medium",
        project: aliceProject._id,
        startDate: new Date("2025-04-02"),
        dueDate: new Date("2025-04-10"),
        idUser: alice._id,
      },
      {
        title: "Tối ưu SEO",
        description: "Tối ưu hóa công cụ tìm kiếm cho website",
        priority: "High",
        project: sharedProject._id,
        startDate: new Date("2025-04-11"),
        dueDate: new Date("2025-04-20"),
        idUser: alice._id,
      },
      {
        title: "Bảo trì website",
        description: "Đảm bảo website hoạt động ổn định",
        priority: "Medium",
        project: sharedProject._id,
        startDate: new Date("2025-04-21"),
        dueDate: new Date("2025-04-30"),
        idUser: alice._id,
      },
    ];

    const tasksForBob = [
      {
        title: "Thiết kế UI/UX",
        description: "Thiết kế UI/UX cho ứng dụng di động",
        priority: "High",
        project: bobProject._id,
        startDate: new Date("2025-03-05"),
        dueDate: new Date("2025-03-15"),
        idUser: bob._id,
      },
      {
        title: "Phát triển ứng dụng",
        description: "Xây dựng ứng dụng di động",
        priority: "Medium",
        project: bobProject._id,
        startDate: new Date("2025-03-16"),
        dueDate: new Date("2025-04-01"),
        idUser: bob._id,
      },
      {
        title: "Kiểm thử ứng dụng",
        description: "Viết test case và kiểm thử toàn bộ ứng dụng",
        priority: "Low",
        project: bobProject._id,
        startDate: new Date("2025-04-02"),
        dueDate: new Date("2025-04-15"),
        idUser: bob._id,
      },
      {
        title: "Triển khai ứng dụng",
        description: "Cấu hình server và triển khai ứng dụng",
        priority: "Medium",
        project: bobProject._id,
        startDate: new Date("2025-04-16"),
        dueDate: new Date("2025-04-30"),
        idUser: bob._id,
      },
      {
        title: "Tối ưu hiệu năng ứng dụng",
        description: "Tối ưu tốc độ và hiệu năng của ứng dụng",
        priority: "High",
        project: sharedProject._id,
        startDate: new Date("2025-05-01"),
        dueDate: new Date("2025-05-10"),
        idUser: bob._id,
      },
      {
        title: "Bảo trì ứng dụng",
        description: "Đảm bảo ứng dụng hoạt động ổn định",
        priority: "Medium",
        project: sharedProject._id,
        startDate: new Date("2025-05-11"),
        dueDate: new Date("2025-05-20"),
        idUser: bob._id,
      },
    ];

    const tasksForSharedProject = [
      {
        title: "Họp khởi động dự án",
        description: "Tổ chức họp khởi động dự án",
        priority: "High",
        project: sharedProject._id,
        startDate: new Date("2025-04-05"),
        dueDate: new Date("2025-04-05"),
        idUser: james._id,
      },
      {
        title: "Phân công công việc",
        description: "Phân công công việc cho các thành viên",
        priority: "Medium",
        project: sharedProject._id,
        startDate: new Date("2025-04-06"),
        dueDate: new Date("2025-04-10"),
        idUser: alice._id,
      },
      {
        title: "Báo cáo tiến độ",
        description: "Báo cáo tiến độ công việc hàng tuần",
        priority: "Low",
        project: sharedProject._id,
        startDate: new Date("2025-04-11"),
        dueDate: new Date("2025-04-20"),
        idUser: bob._id,
      },
    ];

    // Assign status based on dates
    const allTasks = [
      ...tasksForJames,
      ...tasksForAlice,
      ...tasksForBob,
      ...tasksForSharedProject,
    ].map((task) => ({ ...task, status: assignStatus(task) }));

    await Task.insertMany(allTasks);
    console.log("Nhiều Tasks đã được thêm.");

    console.log("Seeding completed.");
    process.exit();
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
};

seedData();
