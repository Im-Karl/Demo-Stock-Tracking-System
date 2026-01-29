import React, { useMemo } from 'react';
import { useStockSocket } from '../../hooks/useStockSocket';
import { ArrowUp, ArrowDown, Activity, BarChart3} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StockDetailClient({ symbol }) {
  const stocks = useStockSocket();

  const stockData = useMemo(
    () => stocks.find(s => s.symbol === symbol),
    [stocks, symbol]
  );

  if (!stockData) {
    return (
      <div className="p-8 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl
                      border border-slate-200 dark:border-slate-700
                      flex flex-col items-center justify-center gap-3 animate-pulse">
        <Activity className="text-blue-500 animate-spin" />
        <span className="text-slate-500 text-sm font-medium">
          Đang kết nối dữ liệu realtime...
        </span>
      </div>
    );
  }

  const isUp = stockData.percentChange >= 0;

  return (
    <div className="space-y-6">
      {/* PRICE & CHANGE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* PRICE */}
        <motion.div
          layout
          className="relative p-6 h-40 rounded-2xl
                     bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl
                     border border-slate-200 dark:border-slate-700
                     shadow-xl overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-6 text-slate-300 dark:text-slate-600 opacity-10 select-none pointer-events-none">
                <span className="text-[160px] font-extrabold leading-none">₫</span>
            </div>  

          <p className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">
            Giá khớp lệnh
          </p>

          <div className="flex items-end gap-2">
            <motion.h3
              key={stockData.price}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-4xl font-extrabold text-slate-900 dark:text-white"
            >
              {stockData.price.toLocaleString('vi-VN')}
            </motion.h3>
            <span className="text-slate-400 mb-2 font-medium">VND</span>
          </div>
        </motion.div>

        {/* CHANGE */}
        <motion.div
          layout
          className="relative p-6 h-40 rounded-2xl
                     bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl
                     border border-slate-200 dark:border-slate-700
                     shadow-xl overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-6 
                text-blue-300 dark:text-blue-700 
                opacity-10 pointer-events-none">
                <Activity size={140} />
            </div>

          <p className={`text-xs uppercase font-bold tracking-wider mb-2
            ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
            Biến động
          </p>

          <div className={`flex items-center gap-2 text-4xl font-extrabold
            ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
            {isUp ? <ArrowUp /> : <ArrowDown />}
            {stockData.percentChange}%
          </div>

          <p className="text-sm text-slate-400">So với tham chiếu</p>
        </motion.div>
      </div>


      <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl
                      border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="flex justify-between items-end mb-3">
          <span className="text-sm font-medium text-slate-500">
            Khối lượng giao dịch
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            {stockData.volume?.toLocaleString() || 0}
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min((stockData.volume / 2_000_000) * 100, 100)}%`
            }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
          />
        </div>
      </div>

      <div className="min-h-[300px] rounded-2xl
                      bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl
                      border border-slate-200 dark:border-slate-700
                      flex flex-col items-center justify-center gap-3 text-slate-400">
        <BarChart3 size={64} className="opacity-30" />
        <p className="font-medium">
          Biểu đồ nến {symbol} đang được xây dựng...
        </p>
      </div>
    </div>
  );
}
