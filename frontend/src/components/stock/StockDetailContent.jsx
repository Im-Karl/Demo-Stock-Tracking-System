import React, { useMemo } from 'react';
import { useStockSocket } from '../../hooks/useStockSocket';
import { RiPulseFill, RiStackFill, RiDatabase2Fill, RiSparklingFill, RiErrorWarningFill } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { Area, CartesianGrid, ComposedChart, Line, Tooltip, XAxis, YAxis } from 'recharts';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import GlassCard from '../base-ui/GlassCard';
import Button from '../base-ui/Button';

const DigitTicker = ({ value }) => {
  const characters = String(value).split('');

  return (
    <div className="flex overflow-hidden h-[1em] leading-[1em] font-mono w-max">
      {characters.map((char, index) => {
        if (isNaN(parseInt(char))) {
          return <span key={index}>{char}</span>;
        }
        return (
          <div key={index} className="relative w-[0.7em] h-[1em] -mr-1 shrink-0">
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: `-${parseInt(char) * 10}%` }}
              transition={{ ease: 'easeOut', duration: 0.8 }}
              className="absolute top-0 left-0 flex flex-col"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <span key={num} className="h-[1em] flex items-center justify-center">
                  {num}
                </span>
              ))}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

const formatUSD = (val) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <GlassCard className="!p-4 min-w-[200px]">
        <p className="text-[10px] font-black uppercase tracking-widest text-grey-500 mb-2">
          {dayjs(label).format('DD/MM/YYYY')}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-bold text-grey-700 dark:text-grey-300 uppercase tracking-tight">
                  {entry.name}
                </span>
              </div>
              <span className="text-[11px] font-mono font-black text-grey-900 dark:text-white">
                {Array.isArray(entry.value)
                  ? `${formatUSD(entry.value[0])} - ${formatUSD(entry.value[1])}`
                  : formatUSD(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    );
  }
  return null;
};

const PredictionsGraph = ({ forecast }) => {
  const processedData = useMemo(() => {
    if (!forecast) return [];

    const historyPoints = (forecast.history || []).map((p) => ({
      date: p.date,
      exact: p.close,
      isHistory: true,
    }));

    const predictionPoints = (forecast.predictions || []).map((p) => ({
      date: p.date,
      estimated: p.quantiles['0.5'],
      bands: [p.quantiles['0.1'], p.quantiles['0.9']],
      isHistory: false,
    }));

    if (historyPoints.length > 0 && predictionPoints.length > 0) {
      const lastHistory = historyPoints[historyPoints.length - 1];
      const firstPrediction = predictionPoints[0];
      // Create a separate connection segment
      lastHistory.connection = lastHistory.exact;
      firstPrediction.connection = firstPrediction.estimated;
    }

    return [...historyPoints, ...predictionPoints];
  }, [forecast]);

  return (
    <div className="w-full h-[400px]">
      <ComposedChart
        style={{ width: '100%', height: '100%' }}
        data={processedData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-grey-600)" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => dayjs(date).format('DD/MM')}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: 'var(--color-grey-400)', fontWeight: 600 }}
          minTickGap={30}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: 'var(--color-grey-400)', fontWeight: 600 }}
          tickFormatter={formatUSD}
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          name="Khoảng tin cậy (90%)"
          isAnimationActive={false}
          dataKey="bands"
          stroke="none"
          fill="var(--color-emerald-500)"
          fillOpacity={0.1}
          connectNulls
          legendType="none"
        />
        {/* Bridge Line */}
        <Line
          name="Chuyển tiếp"
          isAnimationActive={false}
          dataKey="connection"
          stroke="var(--color-emerald-500)"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
          activeDot={false}
          legendType="none"
          tooltipType="none"
          connectNulls
        />
        <Line
          name="Giá thực tế"
          isAnimationActive={false}
          dataKey="exact"
          stroke="var(--color-primary-600)"
          strokeWidth={2}
          dot={true}
          activeDot={{ r: 6, strokeWidth: 0 }}
          connectNulls
        />
        <Line
          name="AI Dự báo"
          isAnimationActive={false}
          dataKey="estimated"
          stroke="var(--color-emerald-500)"
          strokeWidth={2}
          dot={true}
          connectNulls
        />
      </ComposedChart>
    </div>
  );
};

const LoadingState = ({ message, className }) => (
  <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
    <div className="relative">
      {/* Base Icon */}
      <RiSparklingFill size={96} className="text-grey-200 dark:text-grey-800" />
      {/* Shimmering Overlay Icon with Gradient Mask */}
      <motion.div
        className="absolute inset-0 text-grey-500 opacity-50"
        style={{
          WebkitMaskImage: 'linear-gradient(90deg, transparent 30%, #fff 50%, transparent 70%)',
          maskImage: 'linear-gradient(90deg, transparent 30%, #fff 50%, transparent 70%)',
          WebkitMaskSize: '200% 100%',
          maskSize: '200% 100%',
        }}
        initial={{
          WebkitMaskPosition: '200% 0',
          maskPosition: '200% 0',
        }}
        animate={{
          WebkitMaskPosition: '-200% 0',
          maskPosition: '-200% 0',
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        }}
      >
        <RiSparklingFill size={96} />
      </motion.div>
    </div>
    <span className="text-xs font-black uppercase tracking-[0.2em] text-grey-400 animate-pulse text-center">
      {message}
    </span>
  </div>
);

export default function StockDetailContent({ symbol }) {
  const stocks = useStockSocket();

  const stockData = useMemo(() => stocks.find((s) => s.symbol === symbol), [stocks, symbol]);

  const {
    data: forecast,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['forecast', symbol],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/v1/forecast/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: symbol,
          interval: 'daily',
          lookback_days: 30,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Dịch vụ AI hiện không khả dụng');
      }
      return res.json();
    },
  });

  if (!stockData) {
    return <LoadingState message="Đang đồng bộ thị trường..." className="h-[400px]" />;
  }

  const isUp = stockData.percentChange >= 0;

  return (
    <div className="space-y-6">
      {/* PRICE & CHANGE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-grey-200 dark:bg-grey-800 border border-grey-200 dark:border-grey-800 rounded-sm overflow-hidden relative font-mono shadow-sm">
        {/* PRICE CARD */}
        <div className="bg-white dark:bg-grey-900 p-8 relative col-span-1 overflow-hidden">
          <div className="absolute -top-4 -right-4 text-grey-100 dark:text-grey-800 opacity-50 dark:opacity-30">
            <RiDatabase2Fill size={140} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-400 mb-4">Giá khớp lệnh</p>
          <div className="flex items-center gap-1 relative z-10 text-3xl font-black text-grey-900 dark:text-white tracking-tighter h-[30px]">
            <DigitTicker value={stockData.price.toLocaleString('vi-VN')} />
            <span>&#8363;</span>
          </div>
          <p className="text-xs font-bold text-grey-400 mt-2 uppercase tracking-wide relative z-10 opacity-0">
            Placeholder
          </p>
        </div>

        {/* VOLATILITY CARD */}
        <div className="bg-white dark:bg-grey-900 p-8 col-span-1 border-l border-grey-200 dark:border-grey-800 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 text-grey-100 dark:text-grey-800 opacity-50 dark:opacity-30">
            <RiPulseFill size={140} />
          </div>
          <p
            className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 relative z-10 ${isUp ? 'text-emerald-500' : 'text-red-500'}`}
          >
            Biến động phiên
          </p>
          <div
            className={`flex items-center gap-1 text-3xl font-black tracking-tighter relative z-10 ${isUp ? 'text-emerald-500' : 'text-red-500'} h-[30px]`}
          >
            <span>{isUp ? '+' : ''}</span>
            <DigitTicker value={stockData.percentChange} />
            <span>%</span>
          </div>
          <p className="text-xs font-bold text-grey-400 mt-2 uppercase tracking-wide relative z-10">
            Ref: {stockData.refPrice?.toLocaleString()}
          </p>
        </div>

        {/* VOLUME CARD */}
        <div className="bg-white dark:bg-grey-900 p-8 relative col-span-1 sm:col-span-2 lg:col-span-1 border-t sm:border-t lg:border-t-0 border-grey-200 dark:border-grey-800 lg:border-l overflow-hidden">
          <div className="absolute -top-4 -right-4 text-grey-100 dark:text-grey-800 opacity-50 dark:opacity-30">
            <RiStackFill size={140} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-400 mb-4 relative z-10">
            Khối lượng (cổ phiếu)
          </p>
          <div className="text-3xl font-black text-grey-900 dark:text-white tracking-tighter relative z-10 h-[30px]">
            <DigitTicker value={stockData.volume?.toLocaleString() || 0} />
          </div>
          <p className="text-xs font-bold text-grey-400 mt-2 uppercase tracking-wide relative z-10">
            GTGD: {(stockData.volume * stockData.price).toLocaleString('vi-VN')}₫
          </p>

          {/* FLUID PROGRESS BAR (BOTTOM) */}
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-grey-100 dark:bg-grey-800/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((stockData.volume / 2_000_000) * 100, 100)}%`,
              }}
              transition={{ duration: 1.2, ease: 'circOut' }}
              className="h-full bg-primary-500"
            />
          </div>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-grey-200 dark:border-grey-800 pb-3">
          <h3 className="font-bold text-lg text-grey-800 dark:text-grey-200 uppercase tracking-tight">
            Biểu đồ dự đoán AI
          </h3>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary-500"></div>
              <span className="text-grey-500">Thực tế</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-grey-500">Dự đoán</span>
            </div>
          </div>
        </div>

        <GlassCard>
          {isLoading ? (
            <LoadingState message="AI đang tính toán..." className="h-[400px]" />
          ) : isError ? (
            <div className="h-[400px] flex flex-col items-center justify-center gap-4 text-center p-8 animate-in fade-in duration-500">
              <div className="w-12 h-12 rounded-sm bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-grey-800 dark:text-grey-300">
                <RiErrorWarningFill size={28} />
              </div>
              <div className="flex flex-col items-center gap-2">
                <h4 className="font-sans! font-bold text-grey-900 dark:text-white uppercase tracking-tight">
                  Lỗi hệ thống AI
                </h4>
                <p className="text-sm text-grey-500 max-w-[280px] leading-relaxed">
                  {error?.message || 'Không thể kết nối với dịch vụ dự đoán Sprint AI.'}
                </p>
              </div>
              <Button onClick={() => refetch()}>Thử lại</Button>
            </div>
          ) : (
            <PredictionsGraph forecast={forecast} />
          )}
        </GlassCard>
      </div>
    </div>
  );
}
