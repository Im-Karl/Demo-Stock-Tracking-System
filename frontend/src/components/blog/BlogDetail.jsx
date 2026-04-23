import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { RiHeartFill } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import { blogService } from '../../services/blogService';
import Button from '../base-ui/Button';
import Badge from '../base-ui/Badge';
import Avatar from '../base-ui/Avatar';
import CommentSection from './CommentSection';

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
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setBlog(data);
        setLikesCount(data.likes?.length || 0);
        if (userObj && data.likes) setIsLiked(data.likes.includes(userObj._id));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const handleLike = async () => {
    if (!currentUser) return toast.error('Vui lòng đăng nhập để thích bài viết!');
    try {
      const res = await blogService.toggleLike(blog._id);
      setIsLiked(res.data.isLiked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      toast.error('Lỗi khi tương tác');
    }
  };

  const handleTogglePublic = async () => {
    if (!currentUser) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`http://localhost:3000/api/blogs/${slug}/toggle-public`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) setBlog((prev) => ({ ...prev, isPublic: data.isPublic }));
    } catch (error) {
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="animate-pulse space-y-4 py-10">
        <div className="h-10 w-3/4 bg-grey-200 dark:bg-grey-800 rounded-sm" />
        <div className="h-4 w-1/3 bg-grey-200 dark:bg-grey-800 rounded-sm" />
        <div className="h-64 w-full bg-grey-200 dark:bg-grey-800 rounded-sm mt-8" />
      </div>
    );

  if (!blog) return <div className="text-center py-20 text-grey-500">Bài viết không tồn tại.</div>;

  const isAuthor = currentUser && blog.author && currentUser.username === blog.author.username;
  const authorName = blog.author?.displayName || blog.author?.username;

  return (
    <article>
      {/* AUTHOR ADMIN BAR */}
      {isAuthor && (
        <div className="mb-8 flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-4 rounded-sm border-2 border-primary-300 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-primary-700 dark:text-primary-300">Quản lý bài viết</span>
            <Badge intent={blog.isPublic ? 'success' : 'danger'}>{blog.isPublic ? 'Công khai' : 'Riêng tư'}</Badge>
          </div>
          <Button
            onClick={handleTogglePublic}
            disabled={isUpdating}
            intent={blog.isPublic ? 'warning' : 'success'}
            size="sm"
          >
            {isUpdating ? 'Đang xử lý...' : blog.isPublic ? 'Chuyển Riêng tư' : 'Công khai ngay'}
          </Button>
        </div>
      )}

      {/* ARTICLE HEADER */}
      <header className="mb-10 pb-8 border-b border-grey-200 dark:border-grey-800">
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-grey-900 dark:text-grey-50 font-heading mb-6">
          {blog.title}
        </h1>

        <div className="flex items-center justify-between gap-4">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <a href={`/author/${blog.author._id}`}>
              <Avatar src={blog.author.avatar} alt={authorName} fallback={authorName} size="md" />
            </a>
            <div>
              <a
                href={`/author/${blog.author._id}`}
                className="text-sm font-bold text-grey-900 dark:text-grey-100 hover:text-primary-500 transition-colors"
              >
                {authorName}
              </a>
              <p className="text-xs text-grey-500 dark:text-grey-400">
                {blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString('vi-VN') : 'Chưa xuất bản'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer ${
              isLiked
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-grey-100 dark:bg-grey-800 text-grey-600 dark:text-grey-300 hover:bg-grey-200 dark:hover:bg-grey-700'
            }`}
          >
            <RiHeartFill size={16} className={isLiked ? 'text-white' : ''} />
            {likesCount}
          </button>
        </div>
      </header>

      {/* ARTICLE CONTENT */}
      <div className="prose prose-lg max-w-none prose-grey dark:prose-invert prose-headings:font-heading prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>

      {/* COMMENTS */}
      <CommentSection blogId={blog._id} />
    </article>
  );
}
