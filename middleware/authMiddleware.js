const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }

  const token = authHeader.split(" ")[1]; // Lấy token từ Header
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Kiểm tra token
    req.user = decoded; // Lưu thông tin user vào request
    next(); // Cho phép request tiếp tục
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }
};

module.exports = verifyToken; // Đảm bảo export đúng
