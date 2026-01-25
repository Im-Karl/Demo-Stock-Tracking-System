import React from 'react';
import { useNewsVN } from '../../hooks/useNews';
import { NewsCardSkeleton } from '../ui/Skeleton';
// 1. Import thêm
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 2. Tạo Client ở ngoài component
const queryClient = new QueryClient();

// 3. Đổi tên component cũ thành Content
function NewsFeedContent() {
  const { data, isLoading, isError, error } = useNewsVN(15);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <NewsCardSkeleton /><NewsCardSkeleton /><NewsCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500 p-4 border border-red-200 rounded bg-red-50">Lỗi tải tin: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-gray-500 p-4 text-center">Chưa có tin tức nào trong Database.</div>;
  }

  return (
    <div className="space-y-4">
      {data.map((article, index) => (
         <a key={index} href={article.url} target="_blank" rel="noreferrer" className="block group">
           <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors shadow-sm">
             <div className="w-32 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                {article.image ? (
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
             </div>
             <div className="flex-1">
                <h3 className="font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2 leading-tight">{article.title}</h3>
                <div className="text-xs text-gray-500 mt-2 flex gap-2">
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{article.source}</span>
                    <span>{new Date(article.published).toLocaleDateString('vi-VN')}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{article.content}</p>
             </div>
           </div>
        </a>
      ))}
    </div>
  );
}

export default function NewsFeed() {
  return (
    <QueryClientProvider client={queryClient}>
      <NewsFeedContent />
    </QueryClientProvider>
  );
}