import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUp, ArrowDown, Heart, Trophy } from 'lucide-react';
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

  // 🎨 Rank style (light + dark)
  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30";
      case 1:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-500/30";
      case 2:
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30";
      default:
        return "text-slate-600 dark:text-slate-400 font-medium";
    }
  };

  if (stocks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="animate-pulse space-y-4 p-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="h-10 bg-slate-100 dark:bg-slate-800 rounded w-full"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg
                    border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className="bg-slate-50 dark:bg-slate-800
                         border-b border-slate-200 dark:border-slate-700
                         text-xs uppercase
                         text-slate-500 dark:text-slate-400
                         font-semibold tracking-wider"
            >
              <th className="px-4 py-4 text-center w-16">#</th>
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4 text-right">Price (VND)</th>
              <th className="px-6 py-4 text-right">Change 24h</th>
              <th className="px-6 py-4 text-center">Trend</th>
              <th className="px-6 py-4 text-right">Volume</th>
              <th className="px-6 py-4 text-center">Wishlist</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence>
              {sortedStocks.map((stock, index) => {
                const isUp = stock.percentChange >= 0;
                const isWishlisted = wishlist.includes(stock.symbol);

                return (
                  <motion.tr
                    key={stock.symbol}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="group
                               bg-white dark:bg-slate-900
                               hover:bg-blue-50 dark:hover:bg-slate-800
                               transition-colors duration-150"
                  >
                    {/* RANK */}
                    <td className="px-4 py-4 text-center">
                      <div
                        className={`w-8 h-8 mx-auto flex items-center justify-center
                                    rounded-full border ${getRankStyle(index)}`}
                      >
                        {index < 3 ? <Trophy size={14} /> : <span>{index + 1}</span>}
                      </div>
                    </td>

                    {/* SYMBOL */}
                    <td className="px-6 py-4">
                      <a href={`/stock/${stock.symbol}`} className="flex items-center">
                        <div
                          className="h-10 w-10 rounded-full
                                     bg-blue-100 dark:bg-blue-500/20
                                     text-blue-700 dark:text-blue-300
                                     flex items-center justify-center
                                     font-bold mr-3 shadow-sm"
                        >
                          {stock.symbol[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {stock.symbol}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                            Stock
                          </div>
                        </div>
                      </a>
                    </td>

                    {/* PRICE */}
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-800 dark:text-slate-100">
                        {stock.price.toLocaleString('vi-VN')}
                      </div>
                    </td>

                    {/* CHANGE */}
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md
                                    text-xs font-bold border
                          ${
                            isUp
                              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30"
                              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30"
                          }`}
                      >
                        {isUp ? "+" : ""}
                        {stock.percentChange}%
                      </span>
                    </td>

                    {/* TREND */}
                    <td className="px-6 py-4 text-center">
                      {isUp ? (
                        <ArrowUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowDown className="w-5 h-5 text-red-500" />
                      )}
                    </td>

                    {/* VOLUME */}
                    <td className="px-6 py-4 text-right text-sm font-mono
                                   text-slate-500 dark:text-slate-400">
                      {Math.floor(Math.random() * 1000000).toLocaleString()}
                    </td>

                    {/* WISHLIST */}
                    <td className="px-6 py-4 text-center">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => toggleWishlist(stock.symbol)}
                        className={`p-2 rounded-full transition-colors cursor-pointer
                          ${
                            isWishlisted
                              ? "bg-pink-50 text-pink-500 hover:bg-pink-100 dark:bg-pink-500/10 dark:text-pink-400"
                              : "bg-slate-50 text-slate-300 hover:bg-slate-100 hover:text-pink-300 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700"
                          }`}
                      >
                        <Heart
                          size={20}
                          fill={isWishlisted ? "currentColor" : "none"}
                        />
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div
        className="bg-slate-50 dark:bg-slate-800
                   px-6 py-3 border-t border-slate-200 dark:border-slate-700
                   text-sm text-slate-500 dark:text-slate-400
                   flex justify-center"
      >
        <span>
          Đang theo dõi: <b>{wishlist.length}</b> mã
        </span>
      </div>
    </div>
  );
}
