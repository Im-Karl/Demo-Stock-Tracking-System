const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

exports.getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    const comments = await Comment.find({ blog: blogId })
      .populate("author", "username displayName avatar")
      .sort({ createdAt: -1 }); 

    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content, parentComment } = req.body;
    const { blogId } = req.params;
    const userId = req.userId;

    if (!content.trim()) {
      return res.status(400).json({ message: "Nội dung không được để trống" });
    }

    const newComment = new Comment({
      content,
      author: userId,
      blog: blogId,
      parentComment: parentComment || null 
    });

    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id).populate("author", "username displayName avatar");

    res.status(201).json({ success: true, comment: populatedComment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Không tìm thấy bình luận" });

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền xóa bình luận này" });
    }

    comment.isDeleted = true;
    comment.content = "Bình luận này đã bị xóa bởi người dùng.";
    await comment.save();

    res.json({ success: true, message: "Đã xóa bình luận", comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};