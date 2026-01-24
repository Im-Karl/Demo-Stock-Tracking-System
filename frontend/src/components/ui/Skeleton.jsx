//components/ui/Skeleton.jsx


import React from 'react';

// Component Skeleton đa năng
export const Skeleton = ({ className, ...props }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-300 rounded-md ${className}`} 
      {...props} 
    />
  );
};

// Component Skeleton chuyên cho thẻ tin tức (Ví dụ)
export const NewsCardSkeleton = () => {
  return (
    <div className="flex gap-4 p-4 border rounded shadow-sm bg-white">
      <Skeleton className="w-32 h-24 flex-shrink-0" /> {/* Ảnh */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" /> {/* Tiêu đề dòng 1 */}
        <Skeleton className="h-4 w-1/2" /> {/* Tiêu đề dòng 2 */}
        <div className="mt-4 flex gap-2">
           <Skeleton className="h-3 w-16" /> {/* Source */}
           <Skeleton className="h-3 w-16" /> {/* Date */}
        </div>
      </div>
    </div>
  );
};