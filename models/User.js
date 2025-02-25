const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String, // Mã hóa bcrypt
    role: { type: String, enum: ["admin", "writer"], default: "writer" }
});

module.exports = mongoose.model("User", userSchema);
