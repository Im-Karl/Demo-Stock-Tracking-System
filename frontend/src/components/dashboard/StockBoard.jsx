import React, { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, Heart, Trophy, Activity, AlertCircle } from 'lucide-react';
import { useStockSocket } from '../../hooks/useStockSocket';
import { motion, AnimatePresence } from 'framer-motion';


export default function StockBoard() {
  const stocks = useStockSocket();

  const [exchangeFilter, setExchangeFilter] = useState('ALL');

  const exchanges = useMemo(() => {
    const unique = new Set(stocks.map(s => s.exchange).filter(Boolean));
    return ['ALL', ...Array.from(unique)];
  }, [stocks]);

  const [wishlist, setWishlist] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stock_wishlist');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggleWishlist = (symbol) => {
    const newWishlist = wishlist.includes(symbol)
      ? wishlist.filter(item => item !== symbol)
      : [...wishlist, symbol];

    setWishlist(newWishlist);
    localStorage.setItem('stock_wishlist', JSON.stringify(newWishlist));
  };

  const filteredStocks = useMemo(() => {
    const data =
      exchangeFilter === 'ALL'
        ? stocks
        : stocks.filter(s => s.exchange === exchangeFilter);

    return [...data].sort((a, b) => b.price - a.price);
  }, [stocks, exchangeFilter]);

  const getRankStyle = (index) => {
    switch (index) {
      case 0: return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300";
      case 1: return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-500/20 dark:text-slate-300";
      case 2: return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300";
      default: return "text-slate-600 dark:text-slate-400 font-medium";
    }
  };

  const getExchangeBadge = (exchange) => {
    switch (exchange) {
      case 'HOSE': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400';
      case 'HNX': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400';
      case 'UPCOM': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatus = (lastUpdated) => {
    if (!lastUpdated) return { text: 'Đang GD', color: 'text-green-600', icon: Activity };

    const diffTime = Math.abs(Date.now() - new Date(lastUpdated));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      return { text: 'Tạm ngừng', color: 'text-red-500', icon: AlertCircle };
    }
    return { text: 'Đang GD', color: 'text-green-600', icon: Activity };
  };

  if (stocks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="animate-pulse space-y-4 p-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">

      <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        {exchanges.map(ex => {
          const active = exchangeFilter === ex;
          return (
            <button
              key={ex}
              onClick={() => setExchangeFilter(ex)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer
                ${active
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-700'
                }`}
            >
              {ex === 'ALL' ? 'Tất cả' : ex}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
              <th className="px-4 py-4 text-center w-16">#</th>
              <th className="px-6 py-4">Mã CP</th>
              <th className="px-6 py-4 text-center">Sàn</th>
              <th className="px-6 py-4 text-right">Giá (VND)</th>
              <th className="px-6 py-4 text-right">+/-</th>
              <th className="px-6 py-4 text-center">Xu hướng</th>
              <th className="px-6 py-4 text-right">KLGD</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Yêu thích</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence>
              {filteredStocks.map((stock, index) => {
                const isUp = stock.percentChange >= 0;
                const isWishlisted = wishlist.includes(stock.symbol);
                const statusInfo = getStatus(stock.lastUpdated);

                return (
                  <motion.tr
                    key={stock.symbol}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="group hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="px-4 py-4 text-center">
                      <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full border ${getRankStyle(index)}`}>
                        {index < 3 ? <Trophy size={14} /> : index + 1}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <a
                        href={`/stock/${stock.symbol}`}
                        className="flex items-center group/link"
                      >
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold mr-3 shadow-sm group-hover/link:ring-2 ring-blue-400 transition-all">
                          {stock.symbol[0]}
                        </div>

                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100 group-hover/link:text-blue-600 transition">
                            {stock.symbol}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                            Stock
                          </div>
                        </div>
                      </a>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getExchangeBadge(stock.exchange)}`}>
                        {stock.exchange || 'OTC'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right font-bold">
                      {stock.price.toLocaleString('vi-VN')}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border
                          ${
                            isUp
                              ? `
                                bg-green-100 text-green-700 border-green-200
                                dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30
                              `
                              : `
                                bg-red-100 text-red-700 border-red-200
                                dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30
                              `
                          }
                        `}
                      >
                        {isUp ? '+' : ''}
                        {stock.percentChange}%
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {isUp
                        ? <ArrowUp className="w-5 h-5 text-green-500 inline" />
                        : <ArrowDown className="w-5 h-5 text-red-500 inline" />
                      }
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-mono">
                      {stock.volume?.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className={`flex items-center justify-center gap-1 text-xs ${statusInfo.color}`}>
                        <statusInfo.icon size={14} />
                        {statusInfo.text}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => toggleWishlist(stock.symbol)}
                        className={`p-2 rounded-full
                          ${isWishlisted ? 'text-pink-500' : 'text-slate-400 hover:text-pink-400'}
                        `}
                      >
                        <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 px-6 py-3 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 flex justify-center">
        Đang theo dõi: <b className="ml-1">{wishlist.length}</b> mã
      </div>
    </div>
  );
}
