const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Gửi email xác nhận đổi mật khẩu
router.post("/request-password-reset", async (req, res) => {
    const { email } = req.body;
    
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "Email không tồn tại!" });
  
      // Tạo token xác nhận
      const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "15m" });
  
      // Tạo link xác nhận
      const resetLink = `http://localhost:3000/reset-password/${token}`;
  
      // Gửi email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "your-email@gmail.com",
          pass: "your-email-password",
        },
      });
  
      await transporter.sendMail({
        from: '"Hỗ trợ" <your-email@gmail.com>',
        to: email,
        subject: "Xác nhận đổi mật khẩu",
        html: `<p>Bạn đã yêu cầu đổi mật khẩu. Nhấn vào link dưới đây để xác nhận:</p>
               <a href="${resetLink}">Xác nhận đổi mật khẩu</a>`,
      });
  
      res.json({ message: "Vui lòng kiểm tra email của bạn để xác nhận đổi mật khẩu!" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi gửi email!" });
    }
  });
  
  // Xử lý đặt lại mật khẩu
  router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const user = await User.findById(decoded.id);
  
      if (!user) return res.status(404).json({ message: "Người dùng không tồn tại!" });
  
      user.password = newPassword; // Cần mã hóa mật khẩu trước khi lưu
      await user.save();
  
      res.json({ message: "Mật khẩu đã được cập nhật thành công!" });
    } catch (error) {
      res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
  });
  
// Đăng ký tài khoản
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    
    await user.save();
    res.status(201).json({ message: "Đăng ký thành công!" });
});

// Đăng nhập
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user });
});

module.exports = router;
