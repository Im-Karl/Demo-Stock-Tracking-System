import React from 'react';
import ArticleCard from '../base-ui/ArticleCard';

export default function BlogCard({ blog, hideAuthor = false }) {
  if (!blog) return null;

  const authorName = blog.author?.displayName || blog.author?.username;
  const authorAvatar = blog.author?.avatar || null;
  const authorFallback = authorName ? authorName.charAt(0) : '';
  const authorHref = `/author/${blog.author?._id}`;
  
  const imageFallback = (
    <img
      src="/images/fin_savvy.svg"
      alt="FinSavvy Logo"
      className="w-24 h-auto opacity-50 drop-shadow-md group-hover:scale-105 transition-all duration-500"
    />
  );

  return (
    <ArticleCard
      href={`/blog/${blog.slug}`}
      image={blog.thumbnail}
      imageFallback={imageFallback}
      title={blog.title}
      authorName={!hideAuthor && authorName ? authorName : undefined}
      authorAvatar={!hideAuthor && authorName ? authorAvatar : undefined}
      authorFallback={!hideAuthor && authorName ? authorFallback : undefined}
      authorHref={!hideAuthor && authorName ? authorHref : undefined}
      date={blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString('vi-VN') : 'Nháp'}
    />
  );
}
