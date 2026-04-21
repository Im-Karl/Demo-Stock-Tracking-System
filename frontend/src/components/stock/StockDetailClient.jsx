import React, { useMemo } from 'react';
import { useStockSocket } from '../../hooks/useStockSocket';
import { ArrowUp, ArrowDown, Activity, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../base-ui/GlassCard';
import { Area, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';
import dayjs from 'dayjs';

export default function StockDetailClient({ symbol }) {
  const stocks = useStockSocket();

  const stockData = useMemo(() => stocks.find((s) => s.symbol === symbol), [stocks, symbol]);

  const forecast = {
    predictions: [
      {
        step: 1,
        quantiles: { 0.1: 30.8246, 0.5: 40.0799, 0.9: 57.4146 },
      },
      {
        step: 5,
        quantiles: { 0.1: 32.279, 0.5: 42.9604, 0.9: 53.5482 },
      },
      {
        step: 10,
        quantiles: { 0.1: 30.7611, 0.5: 35.5878, 0.9: 59.7114 },
      },
      {
        step: 20,
        quantiles: { 0.1: 32.5877, 0.5: 36.8659, 0.9: 59.8161 },
      },
    ],
    history: [
      { date: '2025-09-22', close: 61.55 },
      { date: '2025-09-23', close: 61.75 },
      { date: '2025-09-24', close: 62.25 },
      { date: '2025-09-25', close: 62.55 },
      { date: '2025-09-26', close: 62.55 },
      { date: '2025-09-29', close: 62.15 },
      { date: '2025-09-30', close: 61.55 },
      { date: '2025-10-01', close: 61.95 },
      { date: '2025-10-02', close: 61.65 },
      { date: '2025-10-03', close: 61.7 },
      { date: '2025-10-06', close: 64.0 },
      { date: '2025-10-07', close: 63.7 },
      { date: '2025-10-08', close: 64.6 },
      { date: '2025-10-09', close: 63.8 },
      { date: '2025-10-10', close: 64.2 },
      { date: '2025-10-13', close: 63.1 },
      { date: '2025-10-14', close: 63.1 },
      { date: '2025-10-15', close: 62.5 },
      { date: '2025-10-16', close: 62.9 },
      { date: '2025-10-17', close: 61.9 },
      { date: '2025-10-20', close: 59.4 },
      { date: '2025-10-21', close: 59.3 },
      { date: '2025-10-22', close: 59.6 },
      { date: '2025-10-23', close: 59.8 },
      { date: '2025-10-24', close: 59.5 },
      { date: '2025-10-27', close: 59.2 },
      { date: '2025-10-28', close: 60.0 },
      { date: '2025-10-29', close: 60.7 },
      { date: '2025-10-30', close: 60.6 },
      { date: '2025-10-31', close: 59.6 },
    ],
  };

  // const { data: forecast } = useQuery({
  //   queryKey: ["forecast", symbol],
  //   queryFn: () =>
  // fetch("http://localhost:3000/api/v1/forecast", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     ticker: symbol,
  //     interval: "daily",
  //     include_history: true,
  //   }),
  // })
  //   .then((res) => res.json())
  //   .then((data) => data),
  // });

  const PredictionsGraph = () => {
    if (forecast === undefined) return <></>;
    const lastDate = dayjs(forecast.history.at(-1)?.date);
    const data = [
      ...forecast.history.map((datapoint) => ({
        x: dayjs(datapoint.date).valueOf(),
        exact: datapoint.close,
      })),
      ...forecast.predictions.map((prediction) => ({
        x: lastDate.add(prediction.step, 'day').valueOf(),
        estimated: prediction.quantiles['0.5'],
        bands: [prediction.quantiles['0.1'], prediction.quantiles['0.9']],
      })),
    ];
    return (
      <ComposedChart
        style={{
          aspectRatio: 2,
          width: '100%',
          maxWidth: 800,
        }}
        responsive
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="x"
          type="number"
          domain={['auto', 'auto']}
          tickFormatter={(timestamp) => dayjs(timestamp).format('DD/MM/YYYY')}
        />
        <YAxis />
        <Legend
          formatter={(label) => {
            switch (label) {
              case 'exact':
                return 'Past close prices';
              case 'estimated':
                return 'Predictions';
              case 'bands':
                return '';
            }
          }}
        />
        <Tooltip labelFormatter={(timestamp) => dayjs(timestamp).format('DD/MM/YYYY')} />
        <Line dataKey="exact" stroke="#000000" strokeWidth={2} dot={false} />
        <Line dataKey="estimated" stroke="#82ca9d" strokeWidth={2} dot={true} />
        <Area
          dataKey="bands"
          stroke="none"
          fill="#82ca9d"
          opacity={0.5}
          connectNulls
          dot={false}
          activeDot={false}
          legendType="none"
        />
      </ComposedChart>
    );
  };

  if (!stockData) {
    return (
      <GlassCard className="flex flex-col items-center justify-center gap-3 animate-pulse py-12">
        <Activity className="text-blue-500 animate-spin" />
        <span className="text-neutral-500 text-sm font-medium">Đang kết nối dữ liệu realtime...</span>
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

          <p className="text-xs uppercase tracking-wider font-bold text-neutral-500 mb-2">Giá khớp lệnh</p>

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

          <p
            className={`text-xs uppercase font-bold tracking-wider mb-2 ${isUp ? 'text-emerald-500' : 'text-red-500'}`}
          >
            Biến động
          </p>

          <div
            className={`flex items-center gap-2 text-4xl font-extrabold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}
          >
            {isUp ? <ArrowUp /> : <ArrowDown />}
            {stockData.percentChange}%
          </div>

          <p className="text-sm text-neutral-400">So với tham chiếu</p>
        </motion.div>
      </div>

      {/* THỂ TÍCH GIAO DỊCH - Dùng GlassCard */}
      <GlassCard padding="md">
        <div className="flex justify-between items-end mb-3">
          <span className="text-sm font-medium text-neutral-500">Khối lượng giao dịch</span>
          <span className="text-xl font-bold text-neutral-900 dark:text-white">
            {stockData.volume?.toLocaleString() || 0}
          </span>
        </div>

        <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min((stockData.volume / 2_000_000) * 100, 100)}%`,
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
          <PredictionsGraph />
        </p>
      </GlassCard>
    </div>
  );
}
