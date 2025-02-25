const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  category: { type: String, required: true }, 
  video: { type: String }, 
  image: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved'], 
    default: 'pending' // Trạng thái mặc định là "chờ duyệt"
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
