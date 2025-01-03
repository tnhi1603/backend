const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");

const {
  getAllNotifications,
  getNotificationsByUser,
  updateNotification,
  markNotificationAsRead,
  markNotificationAsUnread,
  markMultipleNotificationsAsRead,
  createNotification,
  deleteNotification,
  getUnreadNotificationCount,
} = require("../controllers/notiController");

const checkUserId = require("../middlewares/checkUserId");
// Lấy danh sách thông báo
router.get("/", getAllNotifications);

router.get("/by-user", getNotificationsByUser);

// Chỉnh sửa thông báo
router.put("/:id", updateNotification);

// Đánh dấu thông báo là đã đọc
router.patch("/:id/read", markNotificationAsRead);

// Đánh dấu thông báo là chưa đọc
router.patch("/:id/unread", markNotificationAsUnread);

// Đánh dấu nhiều thông báo là đã đọc
router.patch("/multiple/read", markMultipleNotificationsAsRead);

// Tạo thông báo mới
router.post("/", createNotification);

// Xóa thông báo
router.delete("/:id", deleteNotification);
router.get("/unread/count", authMiddleware, getUnreadNotificationCount);

module.exports = router;
