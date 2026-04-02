import React, { useEffect, useRef, useState } from "react";

export default function StockNewsClient({ symbol }) {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef(null);

  const fetchNews = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4000/searchVN?keyword=${symbol}&page=${page}&limit=10`
      );

      const data = await res.json();

      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setNews(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error("Load news error:", err);
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
      entries => {
        if (entries[0].isIntersecting) {
          fetchNews();
        }
      },
      { threshold: 0.2 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNews]);

  const formatDate = date =>
    date
      ? new Date(date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
      {news.map((item, i) => (
        <a
          key={item.url + i}
          href={item.url}
          target="_blank"
          className="group block"
        >
          <div className="flex gap-3 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors">
            {/*  Sửa màu nền ảnh lỗi sang neutral */}
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800">
              <img
                src={
                  item.image ||
                  `https://ui-avatars.com/api/?name=${symbol}&background=random`
                }
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="flex-1">
              {/*  Sửa text-gray sang text-neutral */}
              <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {item.title}
              </h4>

              <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-500">
                <span className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 rounded">
                  {item.source || "Tổng hợp"}
                </span>
                <span>{formatDate(item.published)}</span>
              </div>
            </div>
          </div>
        </a>
      ))}

      <div ref={loadMoreRef} className="py-4 text-center text-xs text-neutral-500">
        {loading
          ? "Đang tải thêm..."
          : hasMore
          ? "Cuộn xuống để xem thêm"
          : "— Hết tin —"}
      </div>
    </div>
  );
}