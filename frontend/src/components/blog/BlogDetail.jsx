import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Skeleton } from '../ui/Skeleton';
import { Heart } from 'lucide-react';  
import { toast } from 'react-hot-toast';
import { blogService } from '../../services/blogService'; 

export default function BlogDetail({ slug }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    let userObj = null;
    if (userStr) {
      userObj = JSON.parse(userStr);
      setCurrentUser(userObj);
    }

    fetch(`http://localhost:3000/api/blogs/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setBlog(data);
        setLikesCount(data.likes?.length || 0);
        if (userObj && data.likes) {
          setIsLiked(data.likes.includes(userObj._id));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để thích bài viết!");
      return;
    }

    try {
      const res = await blogService.toggleLike(blog._id); 
      setIsLiked(res.data.isLiked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      toast.error("Lỗi khi tương tác");
    }
  };

  const handleTogglePublic = async () => {
    if (!currentUser) return;
    setIsUpdating(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:3000/api/blogs/${slug}/toggle-public`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });
      
      const data = await res.json();
      
      if (res.ok) { 
        setBlog(prev => ({ ...prev, isPublic: data.isPublic }));
      } else {
      }
    } catch (error) {
    } finally {
      setIsUpdating(false);
    }
  };


  if (loading) return (
    <div className="p-10 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full" />
    </div>
  );
  
  if (!blog) return <div className="text-center py-10">Bài viết không tồn tại.</div>;
 
  const isAuthor = currentUser && blog.author && (currentUser.username === blog.author.username);

  return (
    <article className="relative max-w-3xl mx-auto mt-8 mb-20 px-6 py-10 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-xl text-slate-800 dark:text-slate-100">

      {isAuthor && (
        <div
          className="mb-8 p-4 rounded-xl
                    bg-blue-50 dark:bg-blue-500/10
                    border border-blue-200 dark:border-blue-500/30
                    flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center"
        >
          <div className="text-sm">
            <span className="font-bold text-blue-700 dark:text-blue-400">
               Quản lý bài viết
            </span>
            <span
              className={`ml-2 px-2 py-1 rounded text-xs font-semibold
                ${
                  blog.isPublic
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-600/40 dark:text-slate-300"
                }`}
            >
              {blog.isPublic ? "Đang Công Khai " : "Đang Riêng Tư "}
            </span>
          </div>

          <button
            onClick={handleTogglePublic}
            disabled={isUpdating}
            className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition cursor-pointer
              ${
                blog.isPublic
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }
              ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {isUpdating
              ? "Đang xử lý..."
              : blog.isPublic
                ? " Chuyển thành Riêng tư"
                : " Công khai ngay"}
          </button>
        </div>
      )}

      <header className="mb-10 text-center border-b border-slate-200 dark:border-slate-700 pb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div>
            Đăng bởi{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              <a href={`/author/${blog.author._id}`} className="hover:underline cursor-pointer">
                {blog.author.displayName || blog.author.username}
              </a>
            </span>
            {" • "}
            <span>
              {blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString("vi-VN") : "Chưa xuất bản"}
            </span>
          </div>

          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 border cursor-pointer
              ${isLiked 
                ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-500" 
                : "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-500 hover:text-red-500 hover:border-red-200 dark:hover:border-red-500/50"
              }`}
          >
            <Heart size={16} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-red-500" : ""} />
            {likesCount} Hữu ích
          </button>

        </div>
      </header>

      {/* ===== CONTENT ===== */}
      <div className="prose prose-lg max-w-none prose-slate dark:prose-invert prose-headings:text-slate-800 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-a:text-blue-600 dark:prose-a:text-blue-400">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>

    </article>
  );
}