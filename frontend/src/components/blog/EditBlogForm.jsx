import React, { useState, useEffect } from "react";
import { blogService } from "../../services/blogService";
import { navigate } from "astro:transitions/client";
import ReactMarkdown from "react-markdown";
import { toast } from "react-hot-toast";
import { FileEdit, HelpCircle } from "lucide-react";
import MarkdownHelpModal from "./MarkdownHelpModal";
import Button from "../base-ui/Button";
import PageLayout from "../base-ui/PageLayout";
import GlassCard from "../base-ui/GlassCard";

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
      <PageLayout showAmbient={false} className="py-20 text-center">
        <div className="text-neutral-500">Đang tải bài viết...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showAmbient={false} className="py-12 px-6">
      <GlassCard className="relative max-w-6xl mx-auto p-8">
        
        {/* Nút Help */}
        <div className="absolute top-6 right-6 z-20">
          <Button
            intent="primary"
            size="icon"
            className="!rounded-full shadow-lg"
            onClick={() => setShowHelp(true)}
            title="Hướng dẫn Markdown"
          >
            <HelpCircle size={20} />
          </Button>
        </div>

        {/* Tiêu đề trang Edit */}
        <h2 className="text-3xl font-extrabold mb-10 flex items-center gap-3 text-blue-600 dark:text-blue-400">
          <FileEdit />
          Chỉnh sửa bài viết
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Khu vực Tiêu đề bài viết */}
          <div className="mb-10 space-y-5">
            <input
              className="w-full text-4xl md:text-5xl font-extrabold bg-transparent border-b border-neutral-300 dark:border-neutral-700 pb-3 outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-blue-500 transition"
              placeholder="Tiêu đề bài viết..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({ ...formData, isPublic: e.target.checked })
                }
                className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                {formData.isPublic ? "Công khai" : "Riêng tư"}
              </span>
            </label>
          </div>

          {/* Khu vực Markdown và Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            <div className="flex flex-col">
              <label className="mb-3 text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">
                Soạn thảo Markdown
              </label>
              <textarea
                className="w-full min-h-[520px] p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="# Viết nội dung của bạn tại đây..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-3 text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">
                Xem trước
              </label>
              <div className="w-full min-h-[520px] p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 overflow-y-auto prose prose-lg max-w-none prose-neutral dark:prose-invert">
                {formData.content ? (
                  <ReactMarkdown>{formData.content}</ReactMarkdown>
                ) : (
                  <p className="text-neutral-400 italic mt-24 text-center">
                    Nội dung xem trước sẽ hiển thị tại đây…
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Form */}
          <div className="flex justify-between items-center pt-8 border-t border-neutral-200 dark:border-neutral-700">
            <Button
              type="button"
              intent="neutral"
              onClick={() => navigate("/blog/manage")}
            >
              Hủy bỏ
            </Button>

            <Button type="submit" intent="primary" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>

        <MarkdownHelpModal
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
        />
      </GlassCard>
    </PageLayout>
  );
}