import React from 'react';
import { motion } from 'framer-motion';
import { RiRefreshFill, RiHomeFill, RiErrorWarningFill } from 'react-icons/ri';
import Button from '../base-ui/Button';

export default function ErrorMarket({ code = 404 }) {
  const titleMap = {
    404: 'Mất tín hiệu thị trường',
    500: 'Data feed bị gián đoạn',
    403: 'Khu vực hạn chế',
  };

  const descMap = {
    404: 'Không tìm thấy dữ liệu biểu đồ bạn yêu cầu. Có thể mã chứng khoán không tồn tại.',
    500: 'Máy chủ đang gặp sự cố khi xử lý dữ liệu tick. Đội ngũ kỹ thuật đang khắc phục.',
    403: 'Bạn không có quyền truy cập vào dữ liệu này. Vui lòng nâng cấp gói hoặc đăng nhập.',
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-grey-900 dark:text-grey-100 px-4 relative">
      {/* Background decoration has been removed per cardless design logic */}

      {/* Main Chart SVG */}
      <div className="relative z-10 mb-8 p-8 flex flex-col items-center">
        <svg width="300" height="180" viewBox="0 0 300 180" className="overflow-visible">
          {/* Definitions for Gradients */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-primary-500, #3b82f6)" stopOpacity="0.8" />
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
              className="text-grey-300 dark:text-grey-800"
              strokeOpacity="1"
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
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />

          {/* The "Broken" Candle Animation */}
          <g transform="translate(180, 50)">
            {/* Wick */}
            <motion.line
              x1="10"
              y1="0"
              x2="10"
              y2="80"
              className="stroke-red-500"
              strokeWidth="2"
              animate={{
                opacity: [0, 1, 1, 1, 1, 0, 0],
                y: [-20, 0, 0, 0, 0, 200, 200],
                rotate: [0, 0, 15, -15, 20, 90, 90],
              }}
              transition={{
                duration: 4,
                times: [0, 0.05, 0.15, 0.25, 0.35, 0.5, 1],
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Body */}
            <motion.rect
              x="4"
              y="20"
              width="12"
              height="40"
              className="fill-red-500"
              rx="2"
              animate={{
                opacity: [0, 1, 1, 1, 1, 0, 0],
                y: [-20, 0, 0, 0, 0, 200, 200],
                rotate: [0, 0, 15, -15, 20, 90, 90],
              }}
              transition={{
                duration: 4,
                times: [0, 0.05, 0.15, 0.25, 0.35, 0.5, 1],
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Question marks floating up */}
            <motion.text
              x="20"
              y="10"
              className="fill-grey-400 dark:fill-grey-600"
              fontSize="16"
              fontWeight="bold"
              animate={{
                opacity: [0, 0, 1, 0, 0],
                y: [0, 0, -20, -40, -40],
                x: [10, 10, 20, 30, 30],
                scale: [0.5, 0.5, 1.2, 1, 1],
              }}
              transition={{
                duration: 4,
                times: [0, 0.5, 0.65, 0.8, 1],
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              ?
            </motion.text>

            <motion.text
              x="20"
              y="10"
              className="fill-grey-400 dark:fill-grey-600"
              fontSize="16"
              fontWeight="bold"
              animate={{
                opacity: [0, 0, 1, 0, 0],
                y: [0, 0, -20, -40, -40],
                x: [-10, -10, -20, -30, -30],
                scale: [0.5, 0.5, 1.2, 1, 1],
              }}
              transition={{
                duration: 4,
                times: [0, 0.6, 0.75, 0.9, 1],
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              ?
            </motion.text>
          </g>
        </svg>

        {/* Error Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-4 -right-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-sm text-xs font-bold border border-red-200 dark:border-red-800 flex items-center gap-1"
        >
          <RiErrorWarningFill size={12} />
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
        <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-violet-600 dark:from-primary-400 dark:to-violet-400">
          {titleMap[code]}
        </h1>

        <p className="text-grey-600 dark:text-grey-400 text-center max-w-md mb-8 leading-relaxed">
          {descMap[code] || 'Đã có lỗi không xác định xảy ra.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => location.reload()}
            intent="primary"
            className="w-full sm:w-auto min-w-[140px]"
          >
            <RiRefreshFill size={18} />
            Thử lại ngay
          </Button>

          <Button
            render={<a href="/" />}
            intent="neutral"
            className="w-full sm:w-auto min-w-[140px]"
          >
            <RiHomeFill size={18} />
            Về trang chủ
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
