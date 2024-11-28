const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra email đã tồn tại
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already exists' });

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user
        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Đăng nhập
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        // Tạo token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login };
