const Notification = require("../models/Notification");

// Lấy danh sách thông báo
// Phần này anh đã đổi tên từ getNotifications thành getAllNotifications
const getAllNotifications = async (req, res) => {
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

const getNotificationsByUser = async (req, res) => {
  try {
    // Lấy userId từ query parameters
    const userId = req.query.userId;
    console.log("Received userId:", userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // Lấy thông báo liên quan đến user
    const limit = parseInt(req.query.limit) || 10; // Giới hạn số lượng trả về
    const isReadFilter = req.query.isRead === "false" ? false : undefined; // Lọc trạng thái đọc

    const notifications = await Notification.find({
      userId: userId, // Chỉ thông báo của user được chỉ định
      //   deletedBy: null, // Không bị xóa
      //   isRead: isReadFilter, // Lọc trạng thái đọc (nếu có)
    })
      .populate("taskId", "title dueDate") // Lấy thông tin nhiệm vụ (nếu có)
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian gần nhất
      .limit(limit); // Giới hạn số lượng trả về

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
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

// Đánh dấu nhiều thông báo đã đọc
const markMultipleNotificationsAsRead = async (req, res) => {
  try {
    const { ids } = req.body; // Lấy danh sách ID của các thông báo cần đánh dấu đã đọc

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid or empty IDs array" });
    }

    const notifications = await Notification.updateMany(
      { _id: { $in: ids } },
      { $set: { isRead: true } },
      { new: true }
    );

    res.json({ message: "Notifications marked as read", notifications });
  } catch (err) {
    res.status(500).json({
      message: "Error marking notifications as read",
      error: err.message,
    });
  }
};

// Đánh dấu thông báo là chưa đọc
const markNotificationAsUnread = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: false },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as unread", notification });
  } catch (err) {
    res.status(500).json({
      message: "Error marking notification as unread",
      error: err.message,
    });
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
    res.status(500).json({
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
      return res.status(403).json({
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
    res.status(500).json({
      success: false,
      message: "Error creating notification",
      error: error.message,
    });
  }
};

const getUnreadNotificationCount = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ middleware xác thực
    const count = await Notification.countDocuments({ userId, isRead: false });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllNotifications,
  getNotificationsByUser,
  updateNotification,
  markNotificationAsRead,
  markNotificationAsUnread,
  markMultipleNotificationsAsRead,
  deleteNotification,
  createNotification,
  getUnreadNotificationCount,
};
