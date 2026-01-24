const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const authorName = req.username; 
    const slug = title.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

    const newBlog = new Blog({
      title, slug, content, 
      author: authorName, 
      isPublic,
      publishedDate: isPublic ? new Date() : null,
    });

    await newBlog.save();
    res.json({ success: true, blog: newBlog });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    // Logic: Lấy bài public HOẶC bài của chính mình (nếu đang login, đoạn này có thể mở rộng sau)
    const blogs = await Blog.find({ isPublic: true }).sort({ publishedDate: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.togglePublic = async (req, res) => {
    try {
      const { slug } = req.params;
      const requesterName = req.username; 
      const blog = await Blog.findOne({ slug });
      
      if (!blog) return res.status(404).json({ message: "Không tìm thấy bài viết" });
      if (blog.author !== requesterName) return res.status(403).json({ message: "Không có quyền" });
  
      blog.isPublic = !blog.isPublic;
      if (blog.isPublic) blog.publishedDate = new Date();
      await blog.save();
  
      res.json({ success: true, message: "Đã cập nhật trạng thái", isPublic: blog.isPublic });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};