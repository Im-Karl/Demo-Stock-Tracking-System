const Blog = require("../models/Blog");
const User = require("../models/User");

const extractThumbnailFromContent = (content) => {
  if (!content) return null;
  // Tìm chuỗi có dạng ![alt text](url) và lấy cái url
  const match = content.match(/!\[.*?\]\((.*?)\)/);
  return match ? match[1] : null; 
};

exports.createBlog = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const authorId = req.userId;
    const slug = title.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

    const thumbnail = extractThumbnailFromContent(content);

    const newBlog = new Blog({
      title,
      slug,
      content,
      thumbnail, // Lấy được URL thì lưu vào đây
      author: authorId,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9; // Mặc định 9 bài 1 trang
    const keyword = req.query.keyword || "";

    // Điều kiện lọc cơ bản
    const query = { isPublic: true, isDeleted: false };
    
    // Nếu có nhập từ khóa -> Lọc theo tiêu đề (Không phân biệt hoa thường)
    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    // Đếm tổng số bài thỏa mãn để chia trang
    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit) || 1;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .populate("author", "username displayName avatar")
      .sort({ publishedDate: -1 })
      .skip(skip)
      .limit(limit);

    // Trả về kèm thông tin phân trang
    res.json({ blogs, currentPage: page, totalPages, totalBlogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate(
      "author",
      "username displayName avatar",
    );
    if (!blog) return res.status(404).json({ message: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.userId });
    if (!blog)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.togglePublic = async (req, res) => {
  try {
    const { slug } = req.params;
    const requesterId = req.userId;
    const blog = await Blog.findOne({ slug });

    if (!blog)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    if (blog.author.toString() !== requesterId) {
      return res
        .status(403)
        .json({ message: "Không có quyền thay đổi trạng thái bài viết này" });
    }

    blog.isPublic = !blog.isPublic;
    if (blog.isPublic && !blog.publishedDate) {
      blog.publishedDate = new Date();
    }
    await blog.save();

    res.json({
      success: true,
      message: "Đã cập nhật trạng thái",
      isPublic: blog.isPublic,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyBlogs = async (req, res) => {
  try {
    const userId = req.userId;
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });

    const published = blogs.filter((b) => b.isPublic && !b.isDeleted);
    const drafts = blogs.filter((b) => !b.isPublic && !b.isDeleted);
    const trashed = blogs.filter((b) => b.isDeleted);

    res.json({ success: true, published, drafts, trashed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const blog = await Blog.findOne({
      _id: id,
      author: req.userId,
      isDeleted: false,
    });
    
    if (!blog)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    if (blog.isPublic) {
      return res
        .status(400)
        .json({
          message: "Bài viết đang Xuất bản. Vui lòng hạ về Bản nháp trước khi sửa!",
        });
    }

    blog.title = title || blog.title;
    
    // Nếu nội dung thay đổi, cập nhật lại content và trích xuất lại thumbnail
    if (content) {
      blog.content = content;
      blog.thumbnail = extractThumbnailFromContent(content);  
    }

    await blog.save();
    res.json({ success: true, message: "Đã cập nhật bài viết", blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.moveToTrash = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.userId });
    if (!blog)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    blog.isDeleted = true;
    blog.deletedAt = new Date();
    await blog.save();

    res.json({ success: true, message: "Đã chuyển vào thùng rác" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.restoreBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      author: req.userId,
      isDeleted: true,
    });
    if (!blog)
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài viết trong thùng rác" });

    blog.isDeleted = false;
    blog.deletedAt = null;
    await blog.save();

    res.json({ success: true, message: "Đã khôi phục bài viết" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.hardDeleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      author: req.userId,
      isDeleted: true,
    });
    if (!blog)
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài viết để xóa" });

    res.json({ success: true, message: "Đã xóa vĩnh viễn bài viết" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogsByAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6; 
    const keyword = req.query.keyword || "";

    const author = await User.findById(authorId).select("username displayName tagline followers following avatar");
    if (!author) return res.status(404).json({ message: "Không tìm thấy tác giả" });

    const query = { author: authorId, isPublic: true, isDeleted: false };
    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit) || 1;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .populate("author", "username displayName avatar")
      .sort({ publishedDate: -1 })
      .skip(skip)
      .limit(limit);

    const allBlogsForStats = await Blog.find({ author: authorId, isPublic: true, isDeleted: false }).select("likes");
    const totalLikes = allBlogsForStats.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);

    res.json({ 
      success: true, 
      author, 
      blogs, 
      currentPage: page, 
      totalPages, 
      stats: { totalLikes } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.toggleLike = async (req,res) => {
  try {
    const blogId = req.params.id;
    const userId = req.userId;

    const blog = await Blog.findById(blogId);
    if(!blog) return res.status(404).json({message: "Không tìm thấy bài viết"});  

    const isLiked = blog.likes.some(id => id.toString() === userId.toString());

    if(isLiked){
      blog.likes.pull(userId);
    }else{
      blog.likes.push(userId);
    }

    await blog.save();

    res.json({ 
      success: true,
      isLiked: !isLiked,
      likesCount: blog.likes.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
}