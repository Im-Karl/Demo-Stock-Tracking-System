import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { newsService } from '../../services/newsService';
import { Newspaper, Globe, TrendingUp, Loader2 } from 'lucide-react';

export default function NewsFeed() {
  const [activeTab, setActiveTab] = useState('symbol');
  
  // Ref để theo dõi phần tử cuối trang (để trigger load more)
  const loadMoreRef = useRef(null);

  // Hàm fetch data chuẩn cho useInfiniteQuery
  const fetchNews = async ({ pageParam = 1 }) => {
    const params = { 
        page: pageParam, // Trang hiện tại
        limit: 12        // Số lượng bài mỗi lần tải
    };

    let res;
    switch (activeTab) {
      case 'world':
        res = await newsService.searchWorld(params);
        break;
      case 'general':
        res = await newsService.searchNoSymbol(params);
        break;
      case 'symbol':
      default:
        res = await newsService.searchBySymbol(params);
        break;
    }
    return res.data;
  };

  // --- LOGIC INFINITE QUERY ---
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['news_infinite', activeTab], // Key đổi thì reset list
    queryFn: fetchNews,
    getNextPageParam: (lastPage, allPages) => {
      // Logic xác định trang tiếp theo:
      // Nếu trang vừa tải về rỗng hoặc ít hơn limit (12) -> Hết dữ liệu -> return undefined
      if (!lastPage || lastPage.length < 12) return undefined;
      // Ngược lại: Trang tiếp theo = Số lượng trang hiện có + 1
      return allPages.length + 1;
    },
    staleTime: 60000, 
  });

  // --- LOGIC TỰ ĐỘNG LOAD KHI CUỘN XUỐNG ĐÁY ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Nếu thấy phần tử loadMoreRef VÀ có trang tiếp theo VÀ không đang tải
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 } // 1.0 nghĩa là thấy toàn bộ element mới kích hoạt
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  // --- GIAO DIỆN ---
  return (
    <div className="space-y-6">
      
      {/* 1. THANH TAB */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
        <TabButton 
          isActive={activeTab === 'symbol'} 
          onClick={() => setActiveTab('symbol')} 
          icon={<TrendingUp size={18} />}
          label="Chứng khoán VN"
        />
        <TabButton 
          isActive={activeTab === 'general'} 
          onClick={() => setActiveTab('general')} 
          icon={<Newspaper size={18} />}
          label="Kinh tế Vĩ mô"
        />
        <TabButton 
          isActive={activeTab === 'world'} 
          onClick={() => setActiveTab('world')} 
          icon={<Globe size={18} />}
          label="Quốc Tế"
        />
      </div>

      {/* 2. ERROR STATE */}
      {isError && (
        <div className="p-4 bg-red-50 text-red-600 rounded border border-red-200 text-center">
          Lỗi tải tin: {error.message}
        </div>
      )}

      {/* 3. LIST BÀI VIẾT */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
             // Skeleton khi mới vào lần đầu
             [1,2,3,4].map(i => <SkeletonCard key={i} />)
        ) : (
             // Render dữ liệu (Phải dùng flatMap vì data chia theo từng trang)
             data?.pages.map((group, i) => (
                <React.Fragment key={i}>
                    {group.map((article, index) => (
                        <NewsItem key={`${article.url}-${index}`} article={article} />
                    ))}
                </React.Fragment>
             ))
        )}
        
        {/* Nếu tải xong hết mà không có bài nào */}
        {!isLoading && data?.pages[0]?.length === 0 && (
            <div className="text-center py-10 text-gray-500">Chưa có tin tức nào.</div>
        )}
      </div>

      {/* 4. LOADING INDICATOR CUỐI TRANG (Trigger Lazy Load) */}
      <div ref={loadMoreRef} className="py-4 text-center">
        {isFetchingNextPage ? (
            <div className="flex items-center justify-center gap-2 text-blue-600">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-sm font-medium">Đang tải thêm tin cũ...</span>
            </div>
        ) : hasNextPage ? (
            <span className="text-xs text-gray-400">Cuộn xuống để xem thêm</span>
        ) : (
            !isLoading && data?.pages[0]?.length > 0 && 
            <span className="text-xs text-gray-400">-- Bạn đã xem hết tin --</span>
        )}
      </div>

    </div>
  );
}


function TabButton({ isActive, onClick, icon, label }) {
    return (
      <button
        onClick={onClick}
        className={`cursor-pointer flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2
          ${isActive 
            ? 'border-blue-600 text-blue-700 bg-blue-50' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        {icon}
        {label}
      </button>
    );
  }
  
  function NewsItem({ article }) {
    return (
      <a 
        href={article.url} 
        target="_blank" 
        rel="noreferrer" 
        className="group block bg-white border border-gray-200 rounded-lg hover:shadow-md transition overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row h-full">
           <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gray-100 relative overflow-hidden">
              {article.image ? (
                 <img 
                   src={article.image} 
                   alt={article.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                   onError={(e) => e.target.style.display = 'none'}
                 />
              ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
              )}
              <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider shadow">
                 {article.source}
              </span>
           </div>
  
           <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 leading-tight mb-2 line-clamp-2">
                 {article.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
                 {article.content}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
                 <div className="flex items-center gap-2">
                    {article.author && <span className="font-medium text-gray-600">✍️ {article.author}</span>}
                 </div>
                 <span>{article.published || 'Mới cập nhật'}</span>
              </div>
           </div>
        </div>
      </a>
    );
  }
  
  function SkeletonCard() {
    return (
      <div className="flex border border-gray-100 rounded-lg overflow-hidden h-32 animate-pulse">
         <div className="w-32 bg-gray-200"></div>
         <div className="flex-1 p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 mt-auto"></div>
         </div>
      </div>
    );
  }