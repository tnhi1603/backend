const checkUserId = (req, res, next) => {
    const userId = req.headers['userid']; // Lấy userId từ headers

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required in headers' });
    }

    req.userId = userId; // Gán userId vào request để các route có thể dùng
    next(); // Tiếp tục xử lý route
};

module.exports = checkUserId;
