const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import model User

// Lấy danh sách Writer
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ role: "writer" }); // Lọc user có role là writer
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách user" });
  }
});

// Xem chi tiết Writer
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Không tìm thấy user" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin user" });
  }
});

// Chặn Writer đăng bài / bình luận
router.put("/block/:id", async (req, res) => {
  try {
    const { actionType } = req.body;
    const updateField = actionType === "addPost" ? { canAddPost: false } : { canComment: false };
    
    await User.findByIdAndUpdate(req.params.id, updateField);
    res.json({ message: `Đã chặn quyền ${actionType === "addPost" ? "đăng bài" : "bình luận"}` });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi chặn user" });
  }
});

// Thống kê lượt theo dõi
router.get("/stats/followers", async (req, res) => {
  try {
    const users = await User.find({ role: "writer" }).select("username followers");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thống kê" });
  }
});

module.exports = router;
