import React, { useMemo } from 'react';
import { useStockSocket } from '../../hooks/useStockSocket';
import { ArrowUp, ArrowDown, Activity, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../base-ui/GlassCard';  

export default function StockDetailClient({ symbol }) {
  const stocks = useStockSocket();

  const stockData = useMemo(
    () => stocks.find(s => s.symbol === symbol),
    [stocks, symbol]
  );

  if (!stockData) {
    return (
      <GlassCard className="flex flex-col items-center justify-center gap-3 animate-pulse py-12">
        <Activity className="text-blue-500 animate-spin" />
        <span className="text-neutral-500 text-sm font-medium">
          Đang kết nối dữ liệu realtime...
        </span>
      </GlassCard>
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
          className="relative p-6 h-40 rounded-2xl bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700/50 shadow-xl overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-6 text-neutral-300 dark:text-neutral-600 opacity-10 select-none pointer-events-none">
                <span className="text-[160px] font-extrabold leading-none">₫</span>
            </div>  

          <p className="text-xs uppercase tracking-wider font-bold text-neutral-500 mb-2">
            Giá khớp lệnh
          </p>

          <div className="flex items-end gap-2">
            <motion.h3
              key={stockData.price}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-4xl font-extrabold text-neutral-900 dark:text-white"
            >
              {stockData.price.toLocaleString('vi-VN')}
            </motion.h3>
            <span className="text-neutral-400 mb-2 font-medium">VND</span>
          </div>
        </motion.div>

        {/* CHANGE */}
        <motion.div
          layout
          className="relative p-6 h-40 rounded-2xl bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700/50 shadow-xl overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-6 text-blue-300 dark:text-blue-700 opacity-10 pointer-events-none">
                <Activity size={140} />
            </div>

          <p className={`text-xs uppercase font-bold tracking-wider mb-2 ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
            Biến động
          </p>

          <div className={`flex items-center gap-2 text-4xl font-extrabold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
            {isUp ? <ArrowUp /> : <ArrowDown />}
            {stockData.percentChange}%
          </div>

          <p className="text-sm text-neutral-400">So với tham chiếu</p>
        </motion.div>
      </div>

      {/* THỂ TÍCH GIAO DỊCH - Dùng GlassCard */}
      <GlassCard padding="md">
        <div className="flex justify-between items-end mb-3">
          <span className="text-sm font-medium text-neutral-500">
            Khối lượng giao dịch
          </span>
          <span className="text-xl font-bold text-neutral-900 dark:text-white">
            {stockData.volume?.toLocaleString() || 0}
          </span>
        </div>

        <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min((stockData.volume / 2_000_000) * 100, 100)}%`
            }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
          />
        </div>
      </GlassCard>

      {/* BIỂU ĐỒ - Dùng GlassCard */}
      <GlassCard className="min-h-[300px] flex flex-col items-center justify-center gap-3 text-neutral-400">
        <BarChart3 size={64} className="opacity-30" />
        <p className="font-medium">
          Biểu đồ nến {symbol} đang được xây dựng...
        </p>
      </GlassCard>
    </div>
  );
}