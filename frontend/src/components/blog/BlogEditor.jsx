import React, { useState } from "react";
import { useCreateBlog } from "../../hooks/useBlogs";
import ReactMarkdown from "react-markdown";
import { toast } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelpCircleIcon } from "lucide-react"; 
import MarkdownHelpModal from "./MarkdownHelpModal";
import Button from '../base-ui/Button';
import PageLayout from "../base-ui/PageLayout";
import GlassCard from "../base-ui/GlassCard";

const queryClient = new QueryClient();

function BlogEditorContent() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const { mutate: createPost, isPending } = useCreateBlog();

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return toast.error("Vui lòng nhập tiêu đề và nội dung!");
    createPost({ title, content, isPublic }, {
      onSuccess: () => { toast.success("Đăng bài thành công!"); setTimeout(() => { window.location.href = "/blog"; }, 1200); },
      onError: (err) => { toast.error(err?.response?.data?.message || "Lỗi, thử lại."); },
    });
  };

  return (
    <PageLayout showAmbient={false} className="py-12">
      <GlassCard className="relative max-w-6xl mx-auto p-8">
        
        <div className="absolute top-6 right-6 z-20">
          <Button intent="primary" size="icon" className="!rounded-full shadow-lg" onClick={() => setShowHelp(true)} title="Hướng dẫn Markdown">
            <HelpCircleIcon size={20} />
          </Button>
        </div>

        <div className="mb-10 space-y-5">
          <input className="w-full text-4xl md:text-5xl font-extrabold bg-transparent border-b border-neutral-300 dark:border-neutral-700 pb-3 outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-blue-500 transition" placeholder="Tiêu đề bài viết..." value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-600 text-blue-600 focus:ring-blue-500" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{isPublic ? "Công khai" : "Riêng tư"}</span>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          <div className="flex flex-col">
            <label className="mb-3 text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">Soạn thảo Markdown</label>
            <textarea className="w-full min-h-[520px] p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none" placeholder="# Viết nội dung tại đây..." value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="mb-3 text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">Xem trước</label>
            <div className="w-full min-h-[520px] p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 overflow-y-auto prose prose-lg max-w-none prose-neutral dark:prose-invert">
              {content ? <ReactMarkdown>{content}</ReactMarkdown> : <p className="text-neutral-400 italic mt-24 text-center">Nội dung hiển thị tại đây…</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8 border-t border-neutral-200 dark:border-neutral-700">
          <Button onClick={handleSubmit} disabled={isPending} intent="primary">
            {isPending ? "Đang xuất bản..." : "Đăng bài ngay"}
          </Button>
        </div>

        <MarkdownHelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      </GlassCard>
    </PageLayout>
  );
}

export default function BlogEditor() {
  return <QueryClientProvider client={queryClient}><BlogEditorContent /></QueryClientProvider>;
}