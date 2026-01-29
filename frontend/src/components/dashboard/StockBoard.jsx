import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUp, ArrowDown, Heart, Trophy, Activity, AlertCircle } from 'lucide-react';
import { useStockSocket } from '../../hooks/useStockSocket';
import { motion, AnimatePresence } from 'framer-motion';

export default function StockBoard() {
  const stocks = useStockSocket();

  const [wishlist, setWishlist] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stock_wishlist');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const sortedStocks = useMemo(() => {
    return [...stocks].sort((a, b) => b.price - a.price);
  }, [stocks]);

  const toggleWishlist = (symbol) => {
    let newWishlist;
    if (wishlist.includes(symbol)) {
      newWishlist = wishlist.filter(item => item !== symbol);
    } else {
      newWishlist = [...wishlist, symbol];
    }
    setWishlist(newWishlist);
    localStorage.setItem('stock_wishlist', JSON.stringify(newWishlist));
  };

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
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded w-full"/>)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
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
              {sortedStocks.map((stock, index) => {
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
                    className="group bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-150"
                  >
                    {/* RANK */}
                    <td className="px-4 py-4 text-center">
                      <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full border ${getRankStyle(index)}`}>
                        {index < 3 ? <Trophy size={14} /> : <span>{index + 1}</span>}
                      </div>
                    </td>

                    {/* SYMBOL */}
                    <td className="px-6 py-4">
                      <a href={`/stock/${stock.symbol}`} className="flex items-center group/link">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold mr-3 shadow-sm group-hover/link:ring-2 ring-blue-400 transition-all">
                          {stock.symbol[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{stock.symbol}</div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wide">Stock</div>
                        </div>
                      </a>
                    </td>

                    {/* EXCHANGE (SÀN) */}
                    <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getExchangeBadge(stock.exchange)}`}>
                            {stock.exchange || 'OTC'}
                        </span>
                    </td>

                    {/* PRICE */}
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-800 dark:text-slate-100">
                        {stock.price.toLocaleString('vi-VN')}
                      </div>
                    </td>

                    {/* CHANGE */}
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${isUp ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30"}`}>
                        {isUp ? "+" : ""}{stock.percentChange}%
                      </span>
                    </td>

                    {/* TREND */}
                    <td className="px-6 py-4 text-center">
                      {isUp ? <ArrowUp className="inline w-5 h-5 text-green-500" /> : <ArrowDown className="inline w-5 h-5 text-red-500" />}
                    </td>

                    {/* VOLUME */}
                    <td className="px-6 py-4 text-right text-sm font-mono text-slate-500 dark:text-slate-400">
                      {stock.volume?.toLocaleString()}
                    </td>

                    {/* STATUS (TRẠNG THÁI) */}
                    <td className="px-6 py-4 text-center">
                        <div className={`flex items-center justify-center gap-1 text-xs font-medium ${statusInfo.color}`}>
                            <statusInfo.icon size={14} />
                            {statusInfo.text}
                        </div>
                    </td>

                    {/* WISHLIST */}
                    <td className="px-6 py-4 text-center">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => toggleWishlist(stock.symbol)}
                        className={`p-2 rounded-full transition-colors cursor-pointer ${isWishlisted ? "bg-pink-50 text-pink-500 hover:bg-pink-100 dark:bg-pink-500/10 dark:text-pink-400" : "bg-slate-50 text-slate-300 hover:bg-slate-100 hover:text-pink-300 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700"}`}
                      >
                        <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="bg-slate-50 dark:bg-slate-800 px-6 py-3 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 flex justify-center">
        <span>Đang theo dõi: <b>{wishlist.length}</b> mã</span>
      </div>
    </div>
  );
}