const cron = require("node-cron");
const Task = require("../models/Task");
const Notification = require("../models/Notification");

// Hàm xử lý kiểm tra deadlines
const checkTaskDeadlines = async () => {
  console.log("Running task deadline checker...");
  const now = new Date();

  try {
    // Lấy tất cả nhiệm vụ "In Progress" có `dueDate`
    const tasks = await Task.find({
      status: "In Progress",
      dueDate: { $exists: true },
    });

    for (const task of tasks) {
      const dueDate = new Date(task.dueDate);
      const timeDiff = (dueDate - now) / (1000 * 60 * 60 * 24); // Chuyển sang ngày

      // Lấy thông báo chưa đọc cho nhiệm vụ này
      const existingNotification = await Notification.findOne({
        taskId: task._id,
        type: "Reminder",
        isRead: false,
      });

      // Logic tạo thông báo
      if (timeDiff <= 2 && timeDiff > 1 && !existingNotification) {
        // Thông báo mới khi còn dưới 2 ngày và chưa có thông báo
        await Notification.create({
          userId: task.idUser,
          taskId: task._id,
          content: `Nhiệm vụ "${task.title}" chỉ còn dưới 2 ngày để hoàn thành.`,
          type: "Reminder",
        });
        console.log(`Reminder notification created for task: ${task.title}`);
      } else if (timeDiff <= 1 && timeDiff > 0 && !existingNotification) {
        // Thông báo khi còn dưới 1 ngày
        await Notification.create({
          userId: task.idUser,
          taskId: task._id,
          content: `Nhiệm vụ "${task.title}" chỉ còn 1 ngày để hoàn thành.`,
          type: "Reminder",
        });
        console.log(
          `Last-day reminder notification created for task: ${task.title}`
        );
      } else if (timeDiff < 0) {
        // Nhiệm vụ đã trễ hạn
        const overdueNotification = await Notification.findOne({
          taskId: task._id,
          type: "Overdue",
        });

        if (!overdueNotification) {
          await Notification.create({
            userId: task.idUser,
            taskId: task._id,
            content: `Nhiệm vụ "${
              task.title
            }" đã trễ hạn từ ngày ${dueDate.toLocaleDateString()}.`,
            type: "Overdue",
          });
          console.log(`Overdue notification created for task: ${task.title}`);
        }
      }
    }
  } catch (error) {
    console.error("Error checking task deadlines:", error);
  }
};

// Đăng ký cron job
const registerCronJobs = async () => {
  // Chạy hàng ngày lúc 00:00
  cron.schedule("0 0 * * *", async () => {
    await checkTaskDeadlines();
  });

  // Chạy ngay khi ứng dụng khởi động
  await checkTaskDeadlines();
};

module.exports = registerCronJobs;
