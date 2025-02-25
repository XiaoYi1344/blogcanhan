// Node.js (Express) - Đoạn mã để lấy số liệu thống kê từ cơ sở dữ liệu
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Staff = require('../models/Staff');

router.get('/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    const staffCount = await Staff.countDocuments();

    res.json({
      users: userCount,
      posts: postCount,
      staff: staffCount
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
