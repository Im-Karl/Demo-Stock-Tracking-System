import React, { useState, useEffect, useMemo } from 'react';

import { ArrowUp, ArrowDown, Heart, Trophy } from 'lucide-react';

import { useStockSocket } from '../../hooks/useStockSocket';

import { motion, AnimatePresence } from 'framer-motion'; // Import thư viện animation



export default function StockBoard() {

  const stocks = useStockSocket();

 

  const [wishlist, setWishlist] = useState(() => {

    if (typeof window !== 'undefined') {

      const saved = localStorage.getItem('stock_wishlist');

      return saved ? JSON.parse(saved) : [];

    }

    return [];

  });



  // 1. LOGIC SẮP XẾP: Giá cao nhất lên đầu

  // Dùng useMemo để không sort lại nếu stocks không đổi

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



  // Helper: Chọn màu cho Top 3

  const getRankStyle = (index) => {

    switch (index) {

      case 0: return "bg-yellow-100 text-yellow-700 border-yellow-200"; // Gold

      case 1: return "bg-gray-100 text-gray-700 border-gray-200";       // Silver

      case 2: return "bg-orange-100 text-orange-800 border-orange-200"; // Bronze

      default: return "text-gray-500 font-medium";

    }

  };



  if (stocks.length === 0) {

    return (

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="animate-pulse space-y-4 p-6">

           {[1, 2, 3, 4, 5].map(i => (

             <div key={i} className="h-10 bg-gray-100 rounded w-full"></div>

           ))}

        </div>

      </div>

    );

  }



  return (

    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full text-left border-collapse">

          <thead>

            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">

              <th className="px-4 py-4 text-center w-16">#</th> {/* Cột Xếp hạng */}

              <th className="px-6 py-4">Symbol</th>

              <th className="px-6 py-4 text-right">Price (VND)</th>

              <th className="px-6 py-4 text-right">Change 24h</th>

              <th className="px-6 py-4 text-center">Trend</th>

              <th className="px-6 py-4 text-right">Volume</th>

              <th className="px-6 py-4 text-center">Wishlist</th>

            </tr>

          </thead>

         

          {/* component="tbody" để Framer Motion hiểu đây là tbody */}

          <tbody className="divide-y divide-gray-100">

            <AnimatePresence>

              {sortedStocks.map((stock, index) => {

                const isUp = stock.percentChange >= 0;

                const isWishlisted = wishlist.includes(stock.symbol);



                return (

                  <motion.tr

                    key={stock.symbol} // Key cực kỳ quan trọng để animation hoạt động đúng

                    layout // <-- THUỘC TÍNH QUAN TRỌNG: Tự động animate khi vị trí thay đổi

                    initial={{ opacity: 0, y: 20 }}

                    animate={{ opacity: 1, y: 0 }}

                    exit={{ opacity: 0, scale: 0.9 }}

                    transition={{

                        type: "spring",

                        stiffness: 500,

                        damping: 30

                    }}

                    className="hover:bg-blue-50 transition-colors duration-150 group bg-white"

                  >

                   

                    {/* 0. RANKING */}

                    <td className="px-4 py-4 whitespace-nowrap text-center">

                        <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full border ${getRankStyle(index)}`}>

                            {index < 3 ? <Trophy size={14} /> : <span>{index + 1}</span>}

                        </div>

                    </td>



                    {/* 1. SYMBOL */}

                    <td className="px-6 py-4 whitespace-nowrap">

                      <a href={`/stock/${stock.symbol}`} className="flex items-center group/link cursor-pointer">

                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3 shadow-sm">

                          {stock.symbol[0]}

                        </div>

                        <div>

                          <div className="font-bold text-gray-900">{stock.symbol}</div>

                          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Stock</div>

                        </div>

                      </a>

                    </td>



                    {/* 2. PRICE (Sắp xếp theo cột này) */}

                    <td className="px-6 py-4 whitespace-nowrap text-right">

                         <div className="font-bold text-gray-800 text-base">

                            {stock.price.toLocaleString('vi-VN')}

                         </div>

                    </td>



                    {/* 3. CHANGE % */}

                    <td className="px-6 py-4 whitespace-nowrap text-right">

                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold

                        ${isUp ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}

                      `}>

                        {isUp ? '+' : ''}{stock.percentChange}%

                      </span>

                    </td>



                    {/* 4. TREND ICON */}

                    <td className="px-6 py-4 whitespace-nowrap text-center">

                      {isUp ? (

                        <ArrowUp className="inline w-5 h-5 text-green-500" />

                      ) : (

                        <ArrowDown className="inline w-5 h-5 text-red-500" />

                      )}

                    </td>



                    {/* 5. VOLUME */}

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 font-mono">

                      {Math.floor(Math.random() * 1000000).toLocaleString()}

                    </td>



                    {/* 6. WISHLIST */}

                    <td className="px-6 py-4 whitespace-nowrap text-center">

                      <motion.button

                        whileTap={{ scale: 0.8 }} // Hiệu ứng nhún khi click

                        onClick={() => toggleWishlist(stock.symbol)}

                        className={`cursor-pointer p-2 rounded-full focus:outline-none transition-colors

                          ${isWishlisted

                            ? 'bg-pink-50 text-pink-500 hover:bg-pink-100'

                            : 'bg-gray-50 text-gray-300 hover:bg-gray-100 hover:text-pink-300'

                          }

                        `}

                      >

                        <Heart

                          size={20}

                          fill={isWishlisted ? "currentColor" : "none"}

                          strokeWidth={2}

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

     

      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500 text-center flex justify-between">

         <span>Sắp xếp: <b>Giá giảm dần</b></span>

         <span>Đang theo dõi: <b>{wishlist.length}</b> mã</span>

      </div>

    </div>

  );

}