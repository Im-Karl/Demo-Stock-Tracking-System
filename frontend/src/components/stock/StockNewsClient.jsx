import React, { useEffect, useRef, useState, useCallback } from 'react';

export default function StockNewsClient({ symbol, hasVideo }) {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef(null);

  const fetchNews = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/searchVN?keyword=${symbol}&page=${page}&limit=10`);

      const data = await res.json();

      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setNews((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Load news error:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [symbol]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNews();
        }
      },
      { threshold: 0.2 },
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNews]);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '';

  return (
    <div
      className={`space-y-4 [&_h4]:font-sans! ${
        hasVideo ? 'lg:max-h-[350px] lg:overflow-y-auto' : 'lg:max-h-[700px] lg:overflow-y-auto'
      }`}
    >
      {news.map((item, i) => (
        <a key={item.url + i} href={item.url} target="_blank" className="group block outline-none">
          <div className="flex gap-4 p-3 rounded-sm hover:bg-grey-100 dark:hover:bg-grey-800/40 transition-all">
            {/* Image Container */}
            <div className="w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden bg-grey-100 dark:bg-grey-800 shadow-inner">
              <img
                src={item.image || `https://ui-avatars.com/api/?name=${symbol}&background=random`}
                alt={item.title}
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between py-0.5">
              <h4 className="text-sm font-bold text-grey-800 dark:text-grey-100 line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {item.title}
              </h4>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400">
                  {item.source || 'Tổng hợp'}
                </span>
                <span className="text-[10px] font-bold text-grey-400 uppercase tracking-tighter">
                  {formatDate(item.published)}
                </span>
              </div>
            </div>
          </div>
        </a>
      ))}

      <div ref={loadMoreRef} className="py-6 text-center">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-primary-500">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-widest">Đang cập nhật...</span>
          </div>
        ) : (
          <span className="text-[10px] font-black uppercase tracking-widest text-grey-300 dark:text-grey-600">
            {hasMore ? 'Cuộn xuống để xem thêm' : '— Đã hết tin tức —'}
          </span>
        )}
      </div>
    </div>
  );
}
