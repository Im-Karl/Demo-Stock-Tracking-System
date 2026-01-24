import React from 'react';
import { useNewsVN } from '../../hooks/useNews'; // Import Hook
import { NewsCardSkeleton } from '../ui/Skeleton';

export default function NewsFeed() {
  // Hook đã bao gồm logic fetch và auto-refetch
  const { data, isLoading, isError } = useNewsVN(10);

  if (isLoading) {
    return <div className="space-y-4"><NewsCardSkeleton /><NewsCardSkeleton /></div>;
  }

  if (isError) return <div className="text-red-500">Không thể tải tin tức.</div>;

  return (
    <div className="space-y-4">
      {data.map((article, index) => (
        <a key={index} href={article.url} target="_blank" rel="noreferrer" className="block group">
          {/* ... Giữ nguyên phần render UI của bạn ... */}
           <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
             <img src={article.image || '/placeholder.jpg'} alt={article.title} className="w-32 h-24 object-cover rounded-md" />
             <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{article.content}</p>
             </div>
           </div>
        </a>
      ))}
    </div>
  );
}