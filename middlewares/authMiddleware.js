const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
    // Lấy token từ headers
    const token = req.header('Authorization');

    // Kiểm tra nếu không có token
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Loại bỏ "Bearer " nếu có (ví dụ: Authorization: Bearer <token>)
        const tokenValue = token.split(' ')[1] || token;

        // Xác minh token
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

        // Gán userId và các thông tin khác từ payload vào req để sử dụng trong controller
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;
