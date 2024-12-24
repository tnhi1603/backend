const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: false,
  }, // Liên kết tới nhiệm vụ
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  type: {
    type: String,
    enum: [
      "Reminder", // Nhắc nhở
      "Overdue", // Trễ hạn
      "Update", // Cập nhật
      "Project", // Liên quan đến dự án
      "System", // Thông báo hệ thống
      "Comment", // Bình luận
      "Assignment", // Phân công
    ],
    default: "Update", // Giá trị mặc định
    required: true,
  }, // Loại thông báo
});

module.exports = mongoose.model("Notification", NotificationSchema);
