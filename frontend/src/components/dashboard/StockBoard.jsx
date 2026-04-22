import React, { useState, useMemo } from 'react';
import { RiArrowUpFill, RiArrowDownFill, RiHeartFill, RiTrophyFill, RiPulseFill, RiErrorWarningFill, RiSearchLine } from 'react-icons/ri';
import { useStockSocket } from '../../hooks/useStockSocket';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../base-ui/GlassCard';
import Input from '../base-ui/Input';

export default function StockBoard() {
  const stocks = useStockSocket();

  const [exchangeFilter, setExchangeFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const exchanges = useMemo(() => {
    const unique = new Set(stocks.map((s) => s.exchange).filter(Boolean));
    return ['ALL', ...Array.from(unique)];
  }, [stocks]);

  const [wishlist, setWishlist] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stock_wishlist');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggleWishlist = (symbol) => {
    const newWishlist = wishlist.includes(symbol) ? wishlist.filter((item) => item !== symbol) : [...wishlist, symbol];

    setWishlist(newWishlist);
    localStorage.setItem('stock_wishlist', JSON.stringify(newWishlist));
  };

  const filteredStocks = useMemo(() => {
    let data = exchangeFilter === 'ALL' ? stocks : stocks.filter((s) => s.exchange === exchangeFilter);
    if (searchTerm.trim() !== '') {
      data = data.filter((s) => s.symbol.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return [...data].sort((a, b) => b.price - a.price);
  }, [stocks, exchangeFilter, searchTerm]);

  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30';
      case 1:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-500/20 dark:text-neutral-300 dark:border-neutral-500/30';
      case 2:
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30';
      default:
        return 'text-neutral-600 dark:text-neutral-400 font-medium border-transparent';
    }
  };

  const getExchangeBadge = (exchange) => {
    switch (exchange) {
      case 'HOSE':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30';
      case 'HNX':
        return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30';
      case 'UPCOM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30';
      default:
        return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const getStatus = (lastUpdated) => {
    if (!lastUpdated)
      return {
        text: 'Đang GD',
        color: 'text-emerald-600 dark:text-emerald-400',
        icon: RiPulseFill,
      };
    const diffTime = Math.abs(Date.now() - new Date(lastUpdated));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30)
      return {
        text: 'Tạm ngừng',
        color: 'text-red-500 dark:text-red-400',
        icon: RiErrorWarningFill,
      };
    return {
      text: 'Đang GD',
      color: 'text-emerald-600 dark:text-emerald-400',
      icon: RiPulseFill,
    };
  };

  if (stocks.length === 0) {
    return (
      <GlassCard padding="none">
        <div className="animate-pulse space-y-4 p-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg w-full" />
          ))}
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="none">
      <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-5 border-b border-neutral-200 dark:border-neutral-800/50">
        <div className="flex flex-wrap gap-2">
          {exchanges.map((ex) => {
            const active = exchangeFilter === ex;
            return (
              <button
                key={ex}
                onClick={() => setExchangeFilter(ex)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition cursor-pointer
                  ${
                    active
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200 dark:bg-neutral-800/50 dark:text-neutral-400 dark:border-neutral-700 dark:hover:bg-neutral-800'
                  }`}
              >
                {ex === 'ALL' ? 'Tất cả' : ex}
              </button>
            );
          })}
        </div>

        <div className="w-full sm:w-64">
          <Input
            icon={RiSearchLine}
            type="text"
            placeholder="Tìm mã cổ phiếu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="!py-2 !text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-neutral-50/50 dark:bg-neutral-800/30 border-b border-neutral-200 dark:border-neutral-800 text-xs uppercase text-neutral-500 dark:text-neutral-400 font-bold tracking-wider">
              <th className="px-4 py-5 text-center w-16">#</th>
              <th className="px-6 py-5">Mã CP</th>
              <th className="px-6 py-5 text-center">Sàn</th>
              <th className="px-6 py-5 text-right">Giá (VND)</th>
              <th className="px-6 py-5 text-right">+/-</th>
              <th className="px-6 py-5 text-center">Xu hướng</th>
              <th className="px-6 py-5 text-right">KLGD</th>
              <th className="px-6 py-5 text-center">Trạng thái</th>
              <th className="px-6 py-5 text-center">Yêu thích</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
            <AnimatePresence>
              {filteredStocks.map((stock, index) => {
                const isUp = stock.percentChange >= 0;
                const isWishlisted = wishlist.includes(stock.symbol);
                const statusInfo = getStatus(stock.lastUpdated);

                return (
                  <motion.tr
                    key={stock.symbol}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="group hover:bg-blue-50/50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-4 py-4 text-center">
                      <div
                        className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full border ${getRankStyle(index)}`}
                      >
                        {index < 3 ? <RiTrophyFill size={14} /> : index + 1}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <a href={`/stock/${stock.symbol}`} className="flex items-center group/link">
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-neutral-100 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors">
                            {stock.symbol}
                          </div>
                          <div className="text-[10px] text-neutral-500 uppercase tracking-wide">
                            {stock.organ_name_en}
                          </div>
                        </div>
                      </a>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getExchangeBadge(stock.exchange)}`}
                      >
                        {stock.exchange || 'OTC'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-neutral-900 dark:text-white">
                      {stock.price.toLocaleString('vi-VN')}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border
                          ${
                            isUp
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                              : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30'
                          }
                        `}
                      >
                        {isUp ? '+' : ''}
                        {stock.percentChange}%
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {isUp ? (
                        <RiArrowUpFill className="w-5 h-5 text-emerald-500 inline" />
                      ) : (
                        <RiArrowDownFill className="w-5 h-5 text-red-500 inline" />
                      )}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-mono font-medium text-neutral-700 dark:text-neutral-300">
                      {stock.volume?.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div
                        className={`flex items-center justify-center gap-1.5 text-xs font-medium ${statusInfo.color}`}
                      >
                        <statusInfo.icon size={14} />
                        {statusInfo.text}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => toggleWishlist(stock.symbol)}
                        className={`p-2 rounded-full cursor-pointer transition-colors ${isWishlisted ? 'text-pink-500 hover:bg-pink-500/10' : 'text-neutral-400 hover:text-pink-400 hover:bg-neutral-800'}`}
                      >
                        <RiHeartFill size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="bg-neutral-50/50 dark:bg-neutral-800/30 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800/50 text-sm text-neutral-500 flex justify-center">
        Đang theo dõi: <b className="ml-1 text-neutral-900 dark:text-neutral-200">{wishlist.length}</b> &nbsp;mã
      </div>
    </GlassCard>
  );
}
