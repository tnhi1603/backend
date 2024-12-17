const express = require('express');
const router = express.Router();
const {
    getNotifications,
    updateNotification,
    markNotificationAsRead,
    deleteNotification,
} = require('../controllers/notiController');

const checkUserId = require('../middlewares/checkUserId');
// Lấy danh sách thông báo
router.get('/', getNotifications);

// Chỉnh sửa thông báo
router.put('/:id', updateNotification);

// Đánh dấu thông báo là đã đọc
router.patch('/:id/read', markNotificationAsRead);

// Xóa thông báo
router.delete('/:id', deleteNotification);

module.exports = router;
