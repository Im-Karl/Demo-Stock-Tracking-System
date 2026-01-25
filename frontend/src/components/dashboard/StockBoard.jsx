import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Heart, Bell } from 'lucide-react';
import { useStockSocket } from '../../hooks/useStockSocket'; // Hook Socket cũ của bạn

export default function StockBoard() {
  const stocks = useStockSocket();
  
  const [wishlist, setWishlist] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stock_wishlist');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggleWishlist = (symbol) => {
    let newWishlist;
    if (wishlist.includes(symbol)) {
      newWishlist = wishlist.filter(item => item !== symbol); // Bỏ theo dõi
    } else {
      newWishlist = [...wishlist, symbol]; // Thêm theo dõi
    }
    setWishlist(newWishlist);
    localStorage.setItem('stock_wishlist', JSON.stringify(newWishlist));
  };

  // Nếu chưa có dữ liệu từ Socket -> Hiện Skeleton loading dạng bảng
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
      {/* Header của bảng */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4 text-right">Price (VND)</th>
              <th className="px-6 py-4 text-right">Change 24h</th>
              <th className="px-6 py-4 text-center">Trend</th>
              <th className="px-6 py-4 text-right">Volume</th>
              <th className="px-6 py-4 text-center">Wishlist</th> {/* Cột Action cuối cùng */}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100">
            {stocks.map((stock) => {
              const isUp = stock.percentChange >= 0;
              const isWishlisted = wishlist.includes(stock.symbol);

              return (
                <tr key={stock.symbol} className="hover:bg-blue-50 transition duration-150 group">
                  
                  {/* 1. SYMBOL */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{stock.symbol}</div>
                        <div className="text-xs text-gray-500">Stock Market</div>
                      </div>
                    </div>
                  </td>

                  {/* 2. PRICE */}
                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-800">
                    {stock.price.toLocaleString('vi-VN')}
                  </td>

                  {/* 3. CHANGE % */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${isUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    `}>
                      {isUp ? '+' : ''}{stock.percentChange}%
                    </span>
                  </td>

                  {/* 4. TREND ICON (Confidence giả lập) */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {isUp ? (
                      <ArrowUp className="inline w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowDown className="inline w-5 h-5 text-red-500" />
                    )}
                  </td>

                  {/* 5. VOLUME (Giả lập số liệu khác trong bảng) */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    {Math.floor(Math.random() * 1000000).toLocaleString()} {/* Demo volume */}
                  </td>

                  {/* 6. ACTION: WISHLIST (Cuối bảng) */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button 
                      onClick={() => toggleWishlist(stock.symbol)}
                      className={`cursor-pointer p-2 rounded-full transition-all duration-200 focus:outline-none
                        ${isWishlisted 
                          ? 'bg-pink-100 text-pink-600 hover:bg-pink-200' 
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-pink-400'
                        }
                      `}
                      title={isWishlisted ? "Bỏ theo dõi" : "Thêm vào danh sách theo dõi"}
                    >
                      <Heart 
                        size={20} 
                        fill={isWishlisted ? "currentColor" : "none"} 
                        strokeWidth={2}
                      />
                    </button>
                    
                    {/* Nút thông báo Email (Demo UI) */}
                    {/* {isWishlisted && (
                         <span className="ml-2 inline-block relative group/tooltip">
                            <Bell size={18} className="text-yellow-500 inline cursor-pointer" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-32 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                                Sẽ gửi email
                            </span>
                         </span>
                    )} */}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer bảng */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500 text-center">
        <span>Đang theo dõi: <b>{wishlist.length}</b> mã</span>
      </div>
    </div>
  );
}