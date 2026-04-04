import React from 'react';

export default function BlogCard({ blog, hideAuthor = false }) {
  if (!blog) return null;

  return (
    <div className="group h-full rounded-2xl bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700/50 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col overflow-hidden">
      
      {/* KHU VỰC ẢNH BÌA */}
      <a href={`/blog/${blog.slug}`} className="block h-52 relative overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0">
        {blog.thumbnail ? (
          <img 
            src={blog.thumbnail} 
            alt={blog.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 transition-transform duration-500 group-hover:scale-105">
             <img 
               src="/images/fin_savvy.svg" 
               alt="FinSavvy Logo" 
               className="w-24 h-auto opacity-50 drop-shadow-md group-hover:opacity-90 transition-opacity duration-300"
             />
          </div>
        )}
      </a>

      {/* KHU VỰC NỘI DUNG */}
      <div className="p-6 flex flex-col flex-1">
        <a href={`/blog/${blog.slug}`} className="flex-1 block">
          <h2 className="text-xl font-bold mb-4 line-clamp-2 text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
            {blog.title}
          </h2>
        </a>

        {/* THÔNG TIN TÁC GIẢ & NGÀY ĐĂNG */}
        <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-700/50 flex items-center justify-between">
          
          {/* Nếu hideAuthor = true (ở trang cá nhân) thì giấu cục này đi */}
          {!hideAuthor && blog.author ? (
            <a href={`/author/${blog.author._id}`} className="flex items-center gap-2 group/author">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center border border-neutral-200 dark:border-neutral-600 flex-shrink-0">
                {blog.author.avatar ? (
                  <img src={blog.author.avatar} alt="Author" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                     {(blog.author.displayName || blog.author.username)?.charAt(0)}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 group-hover/author:text-blue-600 dark:group-hover/author:text-blue-400 transition-colors truncate max-w-[120px]">
                {blog.author.displayName || blog.author.username}
              </span>
            </a>
          ) : (
            <div></div> 
          )}

          <span className="text-xs text-neutral-500 font-medium">
            {blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString("vi-VN") : "Nháp"}
          </span>
        </div>
      </div>

    </div>
  );
}