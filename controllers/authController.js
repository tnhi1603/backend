// Import các module cần thiết
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Đăng ký
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra các trường nhập vào
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Kiểm tra email đã tồn tại
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    // Phản hồi khi đăng ký thành công
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    // Xử lý lỗi server
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    console.log(req.body);

    // Kiểm tra các trường nhập vào
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Tạo token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Phản hồi khi đăng nhập thành công
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    // Xử lý lỗi server
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
// Xuất các hàm để sử dụng ở nơi khác
module.exports = { register, login };
