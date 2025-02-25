require("dotenv").config(); // Load biến môi trường từ .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const auth = require("./routes/auth");
const post = require("./routes/posts");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve ảnh upload

// Kết nối MongoDB với xử lý lỗi tốt hơn
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🔗 Kết nối MongoDB thành công"))
    .catch(err => {
        console.error("❌ Lỗi kết nối MongoDB:", err.message);
        process.exit(1); // Thoát app nếu không thể kết nối DB
    });

// Routes
app.use("/api/auth", auth);
app.use("/api/posts", post);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

// Kiểm tra xem port có bị chiếm dụng không trước khi khởi động server
app.listen(PORT, () => console.log(`🚀 Server chạy trên cổng ${PORT}`))
    .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`❌ Lỗi: Cổng ${PORT} đã được sử dụng!`);
            process.exit(1);
        }
    });
