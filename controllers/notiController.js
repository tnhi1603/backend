const Notification = require("../models/Notification");

// Lấy danh sách thông báo
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("userId", "name") // Lấy thông tin tên và email người tạo thông báo
      .sort({ createdAt: -1 }); // Sắp xếp từ mới nhất đến cũ nhất
    res.json(notifications);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: err.message });
  }
};

// Cập nhật nội dung thông báo
const updateNotification = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID của thông báo từ params
    const { content } = req.body; // Dữ liệu cần cập nhật

    const notification = await Notification.findByIdAndUpdate(
      id,
      { content },
      { new: true } // Trả về đối tượng đã cập nhật
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating notification", error: err.message });
  }
};

// Đánh dấu thông báo là đã đọc
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error marking notification as read",
        error: err.message,
      });
  }
};

// Xóa thông báo (chỉ người tạo được phép xóa)
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // ID của người thực hiện yêu cầu

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Chỉ cho phép người tạo thông báo xóa nó
    if (notification.userId.toString() !== userId) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to delete this notification",
        });
    }

    await Notification.findByIdAndDelete(id);
    res.json({ message: "Notification deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting notification", error: err.message });
  }
};

// API thêm thông báo mới
const createNotification = async (req, res) => {
  try {
    const { userId, taskId, content, type } = req.body;

    const newNotification = await Notification.create({
      userId,
      taskId,
      content,
      type,
    });

    res.status(201).json({ success: true, notification: newNotification });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error creating notification",
        error: error.message,
      });
  }
};

module.exports = {
  getNotifications,
  updateNotification,
  markNotificationAsRead,
  deleteNotification,
};
