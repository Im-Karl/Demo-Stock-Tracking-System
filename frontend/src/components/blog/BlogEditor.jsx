// src/components/blog/BlogEditor.jsx
import React, { useState } from "react";
import { useCreateBlog } from "../../hooks/useBlogs";
import ReactMarkdown from "react-markdown";
import { toast } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MarkdownHelpModal from "./MarkdownHelpModal";
import Button from "../base-ui/Button";

const queryClient = new QueryClient();

function BlogEditorContent() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  const { mutate: createPost, isPending } = useCreateBlog();

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Vui lòng nhập tiêu đề và nội dung!");
      return;
    }

    createPost(
      { title, content, isPublic },
      {
        onSuccess: () => {
          toast.success("Đăng bài thành công!");
          setTimeout(() => {
            window.location.href = "/blog";
          }, 1200);
        },
        onError: (err) => {
          toast.error(
            err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
          );
        },
      },
    );
  };

  return (
    <div
      className="relative max-w-6xl mx-auto my-12 p-8 rounded-2xl
                 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl
                 border border-slate-200 dark:border-slate-700
                 shadow-xl
                 text-slate-800 dark:text-slate-100"
    >
      <Button
        intent="primary"
        size="icon"
        className="!rounded-full shadow-lg"
        onClick={() => setShowHelp(true)}
        title="Hướng dẫn Markdown"
      >
        <HelpCircle size={20} />
      </Button>

      {/* ===== HEADER ===== */}
      <div className="mb-10 space-y-5">
        <input
          className="w-full text-4xl md:text-5xl font-extrabold
                     bg-transparent border-b border-slate-300 dark:border-slate-600
                     pb-3 outline-none
                     text-slate-900 dark:text-slate-100
                     placeholder:text-slate-400
                     focus:border-blue-500 transition"
          placeholder="Tiêu đề bài viết..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-5 h-5 rounded
                       border-slate-300 dark:border-slate-600
                       text-blue-600 focus:ring-blue-500"
          />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {isPublic ? "Công khai" : "Riêng tư"}
          </span>
        </label>
      </div>

      {/* ===== EDITOR / PREVIEW ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Markdown editor */}
        <div className="flex flex-col">
          <label
            className="mb-3 text-xs font-bold uppercase
                            text-slate-500 dark:text-slate-400"
          >
            Soạn thảo Markdown
          </label>

          <textarea
            className="w-full min-h-[520px] p-5 rounded-xl
                       bg-white dark:bg-neutral-900
                       border border-slate-300 dark:border-slate-600
                       text-slate-900 dark:text-slate-100
                       placeholder:text-slate-400
                       font-mono text-sm leading-relaxed
                       focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="# Viết nội dung của bạn tại đây..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Preview */}
        <div className="flex flex-col">
          <label
            className="mb-3 text-xs font-bold uppercase
                            text-slate-500 dark:text-slate-400"
          >
            Xem trước
          </label>

          <div
            className="w-full min-h-[520px] p-6 rounded-xl
                       bg-neutral-50 dark:bg-neutral-900
                       border border-slate-300 dark:border-slate-600
                       overflow-y-auto
                       prose prose-lg max-w-none
                       prose-slate dark:prose-invert
                       prose-headings:text-slate-800 dark:prose-headings:text-slate-100
                       prose-p:text-slate-700 dark:prose-p:text-slate-300
                       prose-a:text-blue-600 dark:prose-a:text-blue-400"
          >
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <p className="text-slate-400 italic mt-24 text-center">
                Nội dung xem trước sẽ hiển thị tại đây…
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="flex justify-end pt-8 border-t border-slate-200 dark:border-slate-700">
        <Button onClick={handleSubmit} disabled={isPending} intent="primary">
          {isPending ? "Đang xuất bản..." : "Đăng bài ngay"}
        </Button>
      </div>

      {/* ===== MARKDOWN HELP MODAL ===== */}
      <MarkdownHelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

export default function BlogEditor() {
  return (
    <QueryClientProvider client={queryClient}>
      <BlogEditorContent />
    </QueryClientProvider>
  );
}
