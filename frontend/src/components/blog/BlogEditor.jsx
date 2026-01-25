// src/components/blog/BlogEditor.jsx
import React, { useState } from 'react';
import { useCreateBlog } from '../../hooks/useBlogs';
import ReactMarkdown from 'react-markdown';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MarkdownHelpModal from "./MarkdownHelpModal";

const queryClient = new QueryClient();

function BlogEditorContent() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  
  const { mutate: createPost, isPending } = useCreateBlog();

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert("Vui lòng nhập tiêu đề và nội dung!");
      return;
    }

    createPost(
      { title, content, isPublic }, 
      {
        onSuccess: () => {
          alert("🎉 Đăng bài thành công!");
          window.location.href = '/blog'; 
        },
        onError: (err) => {
          alert(err.response?.data?.message || "Có lỗi xảy ra.");
        }
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      
      {/* Header input */}
      <div className="mb-8 space-y-4">
        <input 
          className="w-full text-4xl font-bold border-b-2 border-gray-100 p-2 outline-none focus:border-blue-500 placeholder-gray-300 transition"
          placeholder="Tiêu đề bài viết..."
          value={title} 
          onChange={e => setTitle(e.target.value)}
        />

        <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
            <input 
                type="checkbox" 
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
            />
            <span className="text-gray-700 font-medium">
                {isPublic ? "🌍 Công khai" : "🔒 Riêng tư"}
            </span>
        </label>
      </div>
       
      {/* Khu vực soạn thảo - BỎ chiều cao cố định, dùng min-h */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cột trái: Soạn thảo */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-500 mb-2 uppercase">Soạn thảo Markdown</label>
            <textarea 
              className="w-full min-h-[500px] p-4 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none font-mono text-sm leading-relaxed" 
              placeholder="# Viết nội dung của bạn tại đây..."
              value={content} 
              onChange={e => setContent(e.target.value)} 
            />
          </div>

          {/* Cột phải: Preview */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-500 mb-2 uppercase">Xem trước</label>
            <div className="w-full min-h-[500px] border rounded-lg p-6 bg-gray-50 prose prose-blue max-w-none break-words">
               {content ? (
                   <ReactMarkdown>{content}</ReactMarkdown>
               ) : (
                   <p className="text-gray-400 italic mt-20 text-center">Nội dung xem trước sẽ hiện tại đây...</p>
               )}
            </div>
          </div>
      </div>

      {/* Footer: Nút đăng bài */}
      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button 
            onClick={handleSubmit} 
            disabled={isPending} 
            className={`px-8 py-3 rounded-lg text-white font-bold text-lg shadow-md transition transform active:scale-95
                ${isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"}
            `}
        >
          {isPending ? " Đang xuất bản..." : " Đăng bài ngay"}
        </button>
      </div>
      <button
  onClick={() => setShowHelp(true)}
  className="cursor-pointer font-bold fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-105 transition"
  title="Xem hướng dẫn Markdown"
>
  ?
</button>

<MarkdownHelpModal
  isOpen={showHelp}
  onClose={() => setShowHelp(false)}
/>
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