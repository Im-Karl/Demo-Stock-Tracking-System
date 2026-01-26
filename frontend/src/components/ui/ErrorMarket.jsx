import React from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Home, AlertCircle } from "lucide-react";

export default function ErrorMarket({ code = 404 }) {
  const titleMap = {
    404: "Mất tín hiệu thị trường",
    500: "Data feed bị gián đoạn",
    403: "Khu vực hạn chế"
  };

  const descMap = {
    404: "Không tìm thấy dữ liệu biểu đồ bạn yêu cầu. Có thể mã chứng khoán không tồn tại.",
    500: "Máy chủ đang gặp sự cố khi xử lý dữ liệu tick. Đội ngũ kỹ thuật đang khắc phục.",
    403: "Bạn không có quyền truy cập vào dữ liệu này. Vui lòng nâng cấp gói hoặc đăng nhập."
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 px-4 overflow-hidden relative">
      
      {/* Background decoration (optional) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-500 rounded-full blur-[100px]" />
      </div>

      {/* Main Chart SVG */}
      <div className="relative z-10 mb-8 p-8 rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-xl">
        <svg
          width="300"
          height="180"
          viewBox="0 0 300 180"
          className="overflow-visible"
        >
          {/* Definitions for Gradients */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid Lines (Animated) */}
          {[40, 80, 120, 160].map((y, i) => (
            <motion.line
              key={y}
              x1="0"
              x2="300"
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeDasharray="4 4"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            />
          ))}

          {/* Chart Line (Success part) */}
          <motion.path
            d="M 10 160 Q 40 140 60 120 T 110 100 T 160 80"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* The "Broken" Candle Animation */}
          <g transform="translate(180, 50)">
            {/* Wick */}
            <motion.line
              x1="10" y1="0" x2="10" y2="80"
              stroke="#ef4444"
              strokeWidth="2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                rotate: [0, 5, -5, 10, 90], // Shake then tip over
                y: [0, 0, 0, 0, 200],       // Fall down eventually
                opacity: [1, 1, 1, 1, 0]    // Fade out
              }}
              transition={{ 
                duration: 2.5, 
                times: [0, 0.2, 0.4, 0.6, 1],
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
            {/* Body */}
            <motion.rect
              x="4" y="20" width="12" height="40"
              fill="#ef4444"
              rx="2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                rotate: [0, 5, -5, 10, 90],
                y: [0, 0, 0, 0, 200],
                opacity: [1, 1, 1, 1, 0]
              }}
              transition={{ 
                duration: 2.5, 
                times: [0, 0.2, 0.4, 0.6, 1],
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
            
            {/* Question marks floating up */}
            {[1, 2].map((i) => (
               <motion.text
                key={i}
                x="20"
                y="10"
                fill="#94a3b8"
                fontSize="16"
                fontWeight="bold"
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  y: -40, 
                  x: i % 2 === 0 ? 20 : -20 
                }}
                transition={{
                  duration: 2,
                  delay: 1.5 + (i * 0.5),
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
               >
                 ?
               </motion.text>
            ))}
          </g>
        </svg>

        {/* Error Badge */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-4 -right-4 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-200 dark:border-red-800 flex items-center gap-1"
        >
          <AlertCircle size={12} />
          {code}
        </motion.div>
      </div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
          {titleMap[code]}
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-8 leading-relaxed">
          {descMap[code] || "Đã có lỗi không xác định xảy ra."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => location.reload()}
            className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all"
          >
            <RefreshCcw size={18} />
            Thử lại ngay
          </motion.button>

          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-all"
          >
            <Home size={18} />
            Về trang chủ
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}