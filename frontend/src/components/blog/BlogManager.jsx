import React, { useState, useEffect } from "react";
import { blogService } from "../../services/blogService";
import {
  Edit,
  Trash2,
  RotateCcw,
  XCircle,
  Eye,
  FileText,
  Lock,   // Bổ sung icon Lock (Hạ về nháp)
  Globe   // Bổ sung icon Globe (Xuất bản)
} from "lucide-react";
import toast from "react-hot-toast";

export default function BlogManager() {
  const [activeTab, setActiveTab] = useState("published");
  const [blogs, setBlogs] = useState({
    published: [],
    drafts: [],
    trashed: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchMyBlogs = async () => {
    try {
      const res = await blogService.getMyBlogs();
      setBlogs({
        published: res.data.published || [],
        drafts: res.data.drafts || [],
        trashed: res.data.trashed || [],
      });
    } catch (error) {
      toast.error("Lỗi tải danh sách bài viết");
      console.error("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const handleSoftDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn chuyển bài này vào thùng rác?")) return;
    try {
      await blogService.moveToTrash(id);
      toast.success("Đã chuyển vào thùng rác");
      fetchMyBlogs();
    } catch {
      toast.error("Lỗi khi xóa bài");
    }
  };

  const handleRestore = async (id) => {
    try {
      await blogService.restoreBlog(id);
      toast.success("Đã khôi phục bài viết");
      fetchMyBlogs();
    } catch {
      toast.error("Lỗi khôi phục");
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm("CẢNH BÁO: Bài viết sẽ bị xóa vĩnh viễn và không thể khôi phục. Tiếp tục?")) return;
    try {
      await blogService.hardDelete(id);
      toast.success("Đã xóa vĩnh viễn");
      fetchMyBlogs();
    } catch {
      toast.error("Lỗi xóa bài");
    }
  };

  const handleToggleStatus = async (slug) => {
    try {
      const res = await blogService.togglePublic(slug);
      toast.success(res.data.message);
      fetchMyBlogs();
    } catch {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  // Hàm điều hướng sửa bài dùng cho sự kiện onClick thay vì thẻ <a>
  const handleEditClick = (e, id) => {
      e.stopPropagation();
      window.location.href = `/blog/edit/${id}`;
  };

  const renderList = (list, type) => {
    if (list.length === 0) {
      return (
        <div className="text-center text-slate-400 dark:text-slate-500 py-16">
          Không có bài viết nào.
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {list.map((blog) => (
            <div
                key={blog._id}
                onClick={() => {
                  if (type !== "trashed") {
                      window.location.href = `/blog/${blog.slug}`;
                  }
                }}
                className="bg-white dark:bg-slate-900
                        border border-slate-200 dark:border-white/10
                        rounded-xl p-5
                        hover:shadow-xl
                        transform hover:scale-[1.01]
                        transition-all duration-300 ease-out
                        flex flex-col md:flex-row justify-between items-start md:items-center gap-4
                        cursor-pointer"
            >
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg line-clamp-1">
                      {blog.title}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {new Date(blog.createdAt).toLocaleDateString("vi-VN")}

                      {type === "trashed" && blog.deletedAt && (
                      <span className="text-red-400 ml-2 italic">
                          (Tự hủy sau:{" "}
                          {30 -
                          Math.floor(
                              (new Date() - new Date(blog.deletedAt)) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          ngày)
                      </span>
                      )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                
                {/* === CÁC NÚT CHO TAB ĐÃ XUẤT BẢN === */}
                {type === "published" && (
                    <>
                    {/* Nút Hạ về Nháp */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(blog.slug);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded text-sm font-medium transition cursor-pointer"
                        title="Hạ về nháp để sửa"
                    >
                        <Lock size={16} /> Hạ về nháp
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSoftDelete(blog._id);
                        }}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                        title="Chuyển vào thùng rác"
                    >
                        <Trash2 size={18} />
                    </button>
                    </>
                )}

                {/* === CÁC NÚT CHO TAB BẢN NHÁP === */}
                {type === "drafts" && (
                    <>
                    {/* Nút Xuất Bản */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(blog.slug);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded text-sm font-medium transition cursor-pointer"
                        title="Xuất bản bài viết"
                    >
                        <Globe size={16} /> Xuất bản
                    </button>

                    {/* Nút Sửa (Chỉ hiện ở tab Draft) */}
                    <button
                        onClick={(e) => handleEditClick(e, blog._id)}
                        className="p-2 text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-lg transition cursor-pointer"
                        title="Chỉnh sửa bài viết"
                    >
                        <Edit size={18} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSoftDelete(blog._id);
                        }}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                        title="Chuyển vào thùng rác"
                    >
                        <Trash2 size={18} />
                    </button>
                    </>
                )}

                {/* === CÁC NÚT CHO TAB THÙNG RÁC === */}
                {type === "trashed" && (
                    <>
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(blog._id);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 rounded-lg text-sm font-semibold transition cursor-pointer"
                    >
                        <RotateCcw size={16} /> Khôi phục
                    </button>

                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        handleHardDelete(blog._id);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg text-sm font-semibold transition cursor-pointer"
                    >
                        <XCircle size={16} /> Xóa vĩnh viễn
                    </button>
                    </>
                )}
                </div>
            </div>
            ))}
      </div>
    );
  };

  if (loading)
    return (
      <div className="text-center py-20 text-slate-500 dark:text-slate-400">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-10 px-6">
      <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
        <FileText className="text-blue-600" />
        Quản lý bài viết
      </h1>

      <div className="flex gap-3 mb-8 flex-wrap">
        {[
          { key: "published", label: "Đã xuất bản", count: blogs.published.length },
          { key: "drafts", label: "Bản nháp", count: blogs.drafts.length },
          { key: "trashed", label: "Thùng rác", count: blogs.trashed.length },
        ].map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10"
                }`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 min-h-[400px] ">
        {activeTab === "published" && renderList(blogs.published, "published")}
        {activeTab === "drafts" && renderList(blogs.drafts, "drafts")}
        {activeTab === "trashed" && renderList(blogs.trashed, "trashed")}
      </div>
    </div>
  );
}