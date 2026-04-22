import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { newsService } from '../../services/newsService';
import { RiNewspaperFill, RiEarthFill, RiStockFill, RiLoader4Fill, RiInformationFill } from 'react-icons/ri';
import ArticleCard from '../base-ui/ArticleCard';
import Tab from '../base-ui/Tab';
import { Tooltip } from '@base-ui/react/tooltip';

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ['news_infinite', activeTab],
    queryFn: fetchNews,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < 12) return undefined;
      return allPages.length + 1;
    },
    staleTime: 60000,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { root: null, rootMargin: '0px 0px -30% 0px', threshold: 0 },
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  return (
    <div className="space-y-6 text-grey-900 dark:text-grey-100">
      {/* TABS (Underlined) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-grey-200 dark:border-grey-800">
        <Tab
          active={activeTab === 'symbol'}
          onClick={() => setActiveTab('symbol')}
          icon={<RiStockFill size={18} />}
        >
          Chứng khoán VN
        </Tab>
        <Tab
          active={activeTab === 'general'}
          onClick={() => setActiveTab('general')}
          icon={<RiNewspaperFill size={18} />}
        >
          Kinh tế Vĩ mô
        </Tab>
        <Tab
          active={activeTab === 'world'}
          onClick={() => setActiveTab('world')}
          icon={<RiEarthFill size={18} />}
        >
          Quốc tế
        </Tab>

        {/* TOOLTIP TIP */}
        <div className="ml-auto flex items-center pr-2">
          <Tooltip.Root>
            <Tooltip.Trigger delay={50} className="text-grey-400 hover:text-grey-600 dark:hover:text-grey-200 transition-colors cursor-help p-2 rounded-sm outline-none">
              <RiInformationFill size={20} />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner side="bottom" sideOffset={8}>
                <Tooltip.Popup className="bg-white dark:bg-grey-800 text-grey-900 dark:text-grey-100 px-5 py-4 rounded-sm shadow-md text-sm w-72 z-50 outline-none">
                  <h4 className="font-bold mb-3 text-primary-600 dark:text-primary-400 font-heading text-lg">Mẹo theo dõi</h4>
                  <ul className="space-y-3 list-disc pl-5 text-grey-600 dark:text-grey-400">
                    <li>Chọn <b className="text-grey-800 dark:text-grey-200">Chứng khoán VN</b> để xem tin liên quan trực tiếp mã CK.</li>
                    <li>Chọn <b className="text-grey-800 dark:text-grey-200">Quốc Tế</b> để theo dõi FED và thị trường Mỹ. <span className="text-xs text-grey-500 block mt-1">(Một số nguồn quốc tế yêu cầu trả phí)</span></li>
                  </ul>
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </div>

      {/* ERROR */}
      {isError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-sm text-center">
          Lỗi tải tin: {error.message}
        </div>
      )}

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)
          : data?.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.map((article, index) => (
                <NewsItem key={`${article.url}-${index}`} article={article} />
              ))}
            </React.Fragment>
          ))}

        {!isLoading && data?.pages[0]?.length === 0 && (
          <div className="text-center py-10 text-grey-500 dark:text-grey-400 font-medium">Chưa có tin tức nào.</div>
        )}
      </div>

      {/* LOAD MORE */}
      <div ref={loadMoreRef} className="py-6 text-center">
        {isFetchingNextPage ? (
          <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400">
            <RiLoader4Fill className="animate-spin" size={20} />
            <span className="text-sm font-medium">Đang tải thêm tin...</span>
          </div>
        ) : hasNextPage ? (
          <span className="text-xs text-grey-400 dark:text-grey-500 uppercase tracking-widest font-bold">Cuộn xuống để xem thêm</span>
        ) : (
          !isLoading &&
          data?.pages[0]?.length > 0 && (
            <span className="text-xs text-grey-400 dark:text-grey-500 uppercase tracking-widest font-bold">— Bạn đã xem hết tin —</span>
          )
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function NewsItem({ article }) {
  return (
    <ArticleCard
      href={article.url}
      image={article.image}
      title={article.title}
      description={article.content}
      source={article.source}
      authorName={article.author}
      date={article.published || 'Mới cập nhật'}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col h-full min-h-[360px] rounded-sm overflow-hidden animate-pulse bg-white dark:bg-grey-900 shadow-sm">
      <div className="w-full h-48 bg-grey-200 dark:bg-grey-800 shrink-0"></div>
      <div className="flex-1 p-5 flex flex-col">
        <div className="space-y-3 mb-4">
          <div className="h-5 bg-grey-200 dark:bg-grey-800 rounded-sm w-full"></div>
          <div className="h-5 bg-grey-200 dark:bg-grey-800 rounded-sm w-3/4"></div>
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-grey-200 dark:bg-grey-800 rounded-sm w-full"></div>
          <div className="h-4 bg-grey-200 dark:bg-grey-800 rounded-sm w-5/6"></div>
          <div className="h-4 bg-grey-200 dark:bg-grey-800 rounded-sm w-2/3"></div>
        </div>
        <div className="flex justify-between mt-auto pt-4">
          <div className="h-3 bg-grey-200 dark:bg-grey-800 rounded-sm w-1/3"></div>
          <div className="h-3 bg-grey-200 dark:bg-grey-800 rounded-sm w-1/4"></div>
        </div>
      </div>
    </div>
  );
}
