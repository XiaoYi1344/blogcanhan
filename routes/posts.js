const express = require("express");
const mongoose = require("mongoose");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

// Định nghĩa schema bài viết
const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    category: { type: String, required: true },
    video: { type: String },
    image: { type: String },
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

// Tránh lỗi OverwriteModelError
const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

// 1. Lấy danh sách bài viết đã được duyệt
router.get("/check", async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "name email");
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết", error: error.message });
    }
});
router.get("/", async (req, res) => {
    try {
        // Chỉ lấy bài viết có status === "approve"
        const posts = await Post.find({ status: "approved" }).populate("author", "name email");
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết", error: error.message });
    }
});


// 2. Thêm bài viết (Yêu cầu xác thực)
router.post("/create", verifyToken, async (req, res) => {
    try {
        const { title, content, category, video, image } = req.body;
        if (!title || !content || !category) {
            return res.status(400).json({ message: "Tiêu đề, nội dung và danh mục là bắt buộc" });
        }

        const newPost = new Post({
            title,
            content,
            category,
            video,
            image,
            author: req.user.userId, // Lấy ID người dùng từ token
            status: "pending",
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm bài viết", error: error.message });
    }
});

// 3. Duyệt bài viết (Chỉ Admin)
router.put("/:id/approve", verifyToken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Bạn không có quyền duyệt bài viết" });
        }

        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: "Bài viết không tồn tại" });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi duyệt bài viết", error: error.message });
    }
});

// 4. Like / Unlike bài viết
router.post("/:id/like", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.status !== "approved") {
            return res.status(404).json({ message: "Bài viết không tồn tại hoặc chưa được duyệt" });
        }

        const index = post.likes.indexOf(req.user.userId);
        if (index === -1) {
            post.likes.push(req.user.userId);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        res.json({ likes: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thích bài viết", error: error.message });
    }
});

// 5. Lưu / Bỏ lưu bài viết
router.post("/:id/save", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.status !== "approved") {
            return res.status(404).json({ message: "Bài viết không tồn tại hoặc chưa được duyệt" });
        }

        const index = post.saves.indexOf(req.user.userId);
        if (index === -1) {
            post.saves.push(req.user.userId);
        } else {
            post.saves.splice(index, 1);
        }

        await post.save();
        res.json({ saves: post.saves.length });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lưu bài viết", error: error.message });
    }
});

// 6. Sửa bài viết (Chỉ tác giả hoặc admin mới có quyền)
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Bài viết không tồn tại" });
        }

        if (post.author.toString() !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Bạn không có quyền sửa bài viết này" });
        }

        Object.assign(post, req.body);
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi sửa bài viết", error: error.message });
    }
});

// 7. Xóa bài viết (Chỉ tác giả hoặc admin mới có quyền)
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Bài viết không tồn tại" });
        }

        if (post.author.toString() !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Bạn không có quyền xóa bài viết này" });
        }

        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: "Bài viết không tồn tại" });
        }

        res.status(200).json({ message: "Xóa bài viết thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa bài viết", error: error.message });
    }
});



// Xuất router
module.exports = router;
