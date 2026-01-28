import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { newsService } from '../../services/newsService';
import { Newspaper, Globe, TrendingUp, Loader2 } from 'lucide-react';

export default function NewsFeed() {
  const [activeTab, setActiveTab] = useState('symbol');
  const loadMoreRef = useRef(null);

  const fetchNews = async ({ pageParam = 1 }) => {
    const params = { page: pageParam, limit: 12 };
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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['news_infinite', activeTab],
    queryFn: fetchNews,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < 12) return undefined;
      return allPages.length + 1;
    },
    staleTime: 60000
  });

   useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -30% 0px',  
        threshold: 0
      }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'  
    });
  }, [activeTab]);

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">

      {/* TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
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
          label="Quốc tế"
        />
      </div>

      {/* ERROR */}
      {isError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded border border-red-200 dark:border-red-800 text-center">
          Lỗi tải tin: {error.message}
        </div>
      )}

      {/* LIST */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
        ) : (
          data?.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.map((article, index) => (
                <NewsItem key={`${article.url}-${index}`} article={article} />
              ))}
            </React.Fragment>
          ))
        )}

        {!isLoading && data?.pages[0]?.length === 0 && (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
            Chưa có tin tức nào.
          </div>
        )}
      </div>

      {/* LOAD MORE */}
      <div ref={loadMoreRef} className="py-6 text-center ">
        {isFetchingNextPage ? (
          <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-sm font-medium">Đang tải thêm tin...</span>
          </div>
        ) : hasNextPage ? (
          <span className="text-xs text-slate-400">Cuộn xuống để xem thêm</span>
        ) : (
          !isLoading && data?.pages[0]?.length > 0 && (
            <span className="text-xs text-slate-400">
              — Bạn đã xem hết tin —
            </span>
          )
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function TabButton({ isActive, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2 cursor-pointer
        ${isActive
          ? 'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
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
      className="
        group block rounded-xl overflow-hidden transition-all
        bg-white dark:bg-slate-800/60 backdrop-blur
        border border-slate-200 dark:border-slate-700
        hover:shadow-xl hover:-translate-y-0.5
      "
    >
      <div className="flex flex-col sm:flex-row h-full">

        <div className="sm:w-48 h-48 sm:h-auto bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              onError={e => (e.target.style.display = 'none')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
              No Image
            </div>
          )}

          <span className="absolute top-2 left-2 bg-blue-600 dark:bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow">
            {article.source}
          </span>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold mb-2 line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {article.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 flex-1">
            {article.content}
          </p>

          <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700 pt-3">
            {article.author && (
              <span className="font-medium text-slate-600 dark:text-slate-300">
                Tác giả: {article.author}
              </span>
            )}
            <span>{article.published || 'Mới cập nhật'}</span>
          </div>
        </div>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div className="flex h-32 rounded-xl overflow-hidden animate-pulse bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div className="w-32 bg-slate-200 dark:bg-slate-700"></div>
      <div className="flex-1 p-4 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mt-auto"></div>
      </div>
    </div>
  );
}
