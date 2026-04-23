import React, { useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine, RiArticleFill, RiSearchLine } from 'react-icons/ri';
import BlogCard from './BlogCard';
import Button from '../base-ui/Button';
import TextField from '../base-ui/TextField';

export default function BlogList({
  blogs: initialBlogs,
  totalPages,
  currentPage,
  keyword: initialKeyword,
  errorMessage,
}) {
  const [searchValue, setSearchValue] = useState(initialKeyword || '');

  return (
    <>
      {/* HEADER ACTION ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        {/* SEARCH */}
        <form method="GET" action="/blog" className="relative w-full sm:max-w-md">
          <TextField
            icon={RiSearchLine}
            label="Tìm kiếm bài viết"
            name="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>

        <Button render={<a href="/blog/create" />} intent="primary" className="shrink-0">
          <RiArticleFill size={16} /> Viết bài mới
        </Button>
      </div>

      {/* ERROR */}
      {errorMessage && (
        <div className="mb-8 rounded-sm border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-6 py-4 max-w-2xl">
          <strong className="font-bold">Lỗi:</strong> {errorMessage}
        </div>
      )}

      {/* BLOG GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialBlogs.map((blog) => (
          <BlogCard key={blog._id || blog.slug} blog={blog} />
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-16" aria-label="Pagination">
          <Button
            render={<a href={`/blog?search=${initialKeyword}&page=${currentPage - 1}`} />}
            intent="ghost"
            size="sm"
            className={currentPage === 1 ? 'opacity-40 pointer-events-none' : ''}
          >
            <RiArrowLeftSLine size={18} /> Trước
          </Button>

          <span className="px-4 py-2 text-sm font-bold text-grey-700 dark:text-grey-300">
            {currentPage} / {totalPages}
          </span>

          <Button
            render={<a href={`/blog?search=${initialKeyword}&page=${currentPage + 1}`} />}
            intent="ghost"
            size="sm"
            className={currentPage === totalPages ? 'opacity-40 pointer-events-none' : ''}
          >
            Sau <RiArrowRightSLine size={18} />
          </Button>
        </nav>
      )}

      {/* EMPTY STATE */}
      {!errorMessage && initialBlogs.length === 0 && (
        <div className="text-center py-24">
          <p className="text-grey-500 dark:text-grey-400 font-medium text-lg">
            {initialKeyword ? `Không tìm thấy bài viết nào chứa từ khóa "${initialKeyword}"` : 'Chưa có bài viết nào.'}
          </p>
          {!initialKeyword && (
            <Button render={<a href="/blog/create" />} intent="primary" className="mt-6">
              Viết bài đầu tiên
            </Button>
          )}
        </div>
      )}
    </>
  );
}
