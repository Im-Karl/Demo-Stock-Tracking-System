// src/components/blog/EditBlogForm.jsx
import React, { useState, useEffect } from "react";
import { blogService } from "../../services/blogService";
import { navigate } from "astro:transitions/client";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { FileEdit } from "lucide-react";
import MarkdownHelpModal from "./MarkdownHelpModal";

export default function EditBlogForm({ blogId }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPublic: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blogService.getBlogById(blogId);

        setFormData({
          title: res.data.title,
          content: res.data.content,
          isPublic: res.data.isPublic ?? true,
        });
      } catch (error) {
        toast.error("Không tìm thấy bài viết");
        navigate("/blog/manage");
      } finally {
        setLoading(false);
      }
    };

    if (blogId) fetchBlog();
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Vui lòng nhập tiêu đề và nội dung!");
      return;
    }

    setSaving(true);

    try {
      await blogService.updateBlog(blogId, formData);
      toast.success("Cập nhật thành công!");

      setTimeout(() => {
        navigate("/blog/manage");
      }, 1000);
    } catch (err) {
      toast.error("Lỗi khi lưu bài viết");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 dark:text-slate-400">
        Đang tải bài viết...
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto my-12 px-6">
      <div
        className="relative p-8 rounded-2xl
                   bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl
                   border border-slate-200 dark:border-slate-700
                   shadow-xl
                   text-slate-800 dark:text-slate-100"
      >
        {/* ===== HELP BUTTON ===== */}
        <button
          onClick={() => setShowHelp(true)}
          title="Hướng dẫn Markdown"
          className="absolute top-6 right-6 z-20
                     w-11 h-11 rounded-full
                     bg-gradient-to-br from-blue-600 to-violet-600
                     text-white font-bold
                     flex items-center justify-center
                     shadow-lg hover:scale-105 transition cursor-pointer"
        >
          ?
        </button>

        {/* ===== HEADER ===== */}
        <h2
          className="text-3xl font-extrabold mb-10 flex items-center gap-3
                     bg-gradient-to-r from-blue-600 to-violet-600
                     bg-clip-text text-transparent"
        >
          <FileEdit className="text-blue-600" />
          Chỉnh sửa bài viết
        </h2>

        <form onSubmit={handleSubmit}>
          {/* ===== TITLE ===== */}
          <div className="mb-8">
            <input
              className="w-full text-4xl font-extrabold
                         bg-transparent border-b border-slate-300 dark:border-slate-600
                         pb-3 outline-none
                         text-slate-900 dark:text-slate-100
                         placeholder:text-slate-400
                         focus:border-blue-500 transition"
              placeholder="Tiêu đề bài viết..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* ===== PUBLIC TOGGLE ===== */}
          <div className="mb-10">
            <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({ ...formData, isPublic: e.target.checked })
                }
                className="w-5 h-5 rounded
                           border-slate-300 dark:border-slate-600
                           text-blue-600 focus:ring-blue-500"
              />
              {/* <span className="font-medium text-slate-700 dark:text-slate-300">
                {formData.isPublic ? "Công khai" : "Riêng tư"}
              </span> */}
            </label>
          </div>

          {/* ===== EDITOR + PREVIEW ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            {/* Editor */}
            <div className="flex flex-col">
              <label className="mb-3 text-xs font-bold uppercase
                                text-slate-500 dark:text-slate-400">
                Soạn thảo Markdown
              </label>

              <textarea
                className="w-full min-h-[520px] p-5 rounded-xl
                           bg-white dark:bg-slate-900
                           border border-slate-300 dark:border-slate-600
                           font-mono text-sm leading-relaxed
                           focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="# Viết nội dung của bạn tại đây..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>

            {/* Preview */}
            <div className="flex flex-col">
              <label className="mb-3 text-xs font-bold uppercase
                                text-slate-500 dark:text-slate-400">
                Xem trước
              </label>

              <div
                className="w-full min-h-[520px] p-6 rounded-xl
                           bg-slate-50 dark:bg-slate-900
                           border border-slate-300 dark:border-slate-600
                           overflow-y-auto
                           prose prose-lg max-w-none
                           prose-slate dark:prose-invert"
              >
                {formData.content ? (
                  <ReactMarkdown>{formData.content}</ReactMarkdown>
                ) : (
                  <p className="text-slate-400 italic mt-24 text-center">
                    Nội dung xem trước sẽ hiển thị tại đây…
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ===== FOOTER ===== */}
          <div className="flex justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate("/blog/manage")}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold
                         bg-slate-200 dark:bg-white/10
                         text-slate-700 dark:text-slate-300
                         hover:bg-slate-300 dark:hover:bg-white/20
                         transition cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={saving}
              className={`px-8 py-3 rounded-xl font-bold text-white transition
                          shadow-lg active:scale-95 cursor-pointer
                          ${
                            saving
                              ? "bg-slate-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90"
                          }`}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>

        <MarkdownHelpModal
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
        /> 
      </div>
    </div>
  );
}