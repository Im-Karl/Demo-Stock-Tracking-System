import React from 'react'; // Bỏ useState, useEffect thừa
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useStockSocket } from '../../hooks/useStockSocket'; // Import Hook

export default function StockBoard() {
  const stocks = useStockSocket(); // Code gọn hẳn

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {stocks.length === 0 ? (
        Array(4).fill(0).map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />)
      ) : (
        stocks.map((stock) => (
           // ... Giữ nguyên phần render UI ...
           <div key={stock.symbol} className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold">{stock.symbol}</h3>
              <div className="text-2xl font-bold">{stock.price.toLocaleString('vi-VN')}</div>
           </div>
        ))
      )}
    </div>
  );
}