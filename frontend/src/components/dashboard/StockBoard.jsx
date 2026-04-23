import React, { useState, useMemo } from 'react';
import {
  RiArrowUpFill,
  RiArrowDownFill,
  RiHeartFill,
  RiTrophyFill,
  RiPulseFill,
  RiErrorWarningFill,
  RiSearchLine,
  RiVipDiamondFill,
  RiMedalFill,
} from 'react-icons/ri';
import { useStockSocket } from '../../hooks/useStockSocket';
import { motion, AnimatePresence } from 'framer-motion';
import TextField from '../base-ui/TextField';
import Badge from '../base-ui/Badge';

export default function StockBoard() {
  const stocks = useStockSocket();

  const [exchangeFilter, setExchangeFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const exchanges = useMemo(() => {
    const unique = new Set(stocks.map((s) => s.exchange).filter(Boolean));
    return ['ALL', 'FAVOURITES', ...Array.from(unique)];
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
    let data;
    if (exchangeFilter === 'ALL') {
      data = stocks;
    } else if (exchangeFilter === 'FAVOURITES') {
      data = stocks.filter((s) => wishlist.includes(s.symbol));
    } else {
      data = stocks.filter((s) => s.exchange === exchangeFilter);
    }

    if (searchTerm.trim() !== '') {
      data = data.filter((s) => s.symbol.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return [...data].sort((a, b) => b.price - a.price);
  }, [stocks, exchangeFilter, searchTerm, wishlist]);

  const getRankStyle = (index) => {
    switch (index) {
      case 0: // Diamond
        return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300';
      case 1: // Gold
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 2: // Copper
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'text-grey-600 dark:text-grey-400 font-medium';
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <RiVipDiamondFill size={14} />;
      case 1:
        return <RiTrophyFill size={14} />;
      case 2:
        return <RiMedalFill size={14} />;
      default:
        return index + 1;
    }
  };

  const getExchangeIntent = (exchange) => {
    switch (exchange) {
      case 'HOSE':
        return 'success';
      case 'HNX':
        return 'warning';
      case 'UPCOM':
        return 'primary';
      default:
        return 'neutral';
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
        color: 'text-red-600 dark:text-red-400',
        icon: RiErrorWarningFill,
      };
    return {
      text: 'Hoạt động',
      color: 'text-emerald-600 dark:text-emerald-400',
      icon: RiPulseFill,
    };
  };

  if (stocks.length === 0) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-4 p-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-grey-100 dark:bg-grey-800 rounded-sm w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-5">
        <div className="flex flex-wrap gap-2">
          {exchanges.map((ex) => {
            const active = exchangeFilter === ex;
            const isFav = ex === 'FAVOURITES';
            return (
              <Badge
                key={ex}
                intent={active ? (isFav ? 'danger' : 'primary') : 'neutral'}
                variant={active ? 'solid' : 'soft'}
                size="md"
                onClick={() => setExchangeFilter(ex)}
                className="!px-3.5 !py-1.5"
              >
                {ex === 'ALL' ? (
                  'Tất cả'
                ) : isFav ? (
                  <span className="flex items-center gap-1.5">
                    <RiHeartFill className={active ? '' : 'text-pink-500'} /> Yêu thích
                  </span>
                ) : (
                  ex
                )}
              </Badge>
            );
          })}
        </div>

        <div className="w-full sm:w-64">
          <TextField
            icon={RiSearchLine}
            type="text"
            label="Tìm mã cổ phiếu"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto overflow-y-hidden custom-scrollbar p-2 -m-2">
        <table className="w-full text-left border-separate border-spacing-0 min-w-[800px]">
          <thead className="relative z-10 drop-shadow">
            <tr className="text-xs uppercase text-grey-500 dark:text-grey-400 font-bold tracking-wider *:bg-white dark:*:bg-grey-900 *:py-5">
              <th className="px-4 text-center w-16 rounded-l-sm">#</th>
              <th className="px-6">Mã cổ phiếu</th>
              <th className="px-6 text-center">Sàn</th>
              <th className="px-6 text-right">Giá (VND)</th>
              <th className="px-6 text-right">+/-</th>
              <th className="px-6 text-center">Xu hướng</th>
              <th className="px-6 text-right">Khối lượng</th>
              <th className="px-6 text-center">Trạng thái</th>
              <th className="px-6 text-center rounded-r-sm">Yêu thích</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="9" className="h-4"></td>
            </tr>
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
                    className="group even:bg-grey-50/50 odd:bg-white dark:even:bg-grey-800/30 dark:odd:bg-transparent hover:bg-grey-100 dark:hover:bg-grey-800/60 transition-colors"
                  >
                    <td className="px-4 py-4 text-center">
                      <div
                        className={`w-8 h-8 mx-auto flex items-center justify-center rounded-sm ${getRankStyle(index)}`}
                      >
                        {getRankIcon(index)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <a href={`/stock/${stock.symbol}`} className="flex items-center group/link outline-none">
                        <div>
                          <div className="font-bold text-grey-900 dark:text-grey-100 group-hover/link:text-primary-600 dark:group-hover/link:text-primary-400 transition-colors">
                            {stock.symbol}
                          </div>
                          <div className="text-[10px] text-grey-500 uppercase tracking-wide">{stock.organ_name_en}</div>
                        </div>
                      </a>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Badge intent={getExchangeIntent(stock.exchange)} size="sm">
                        {stock.exchange || 'OTC'}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-grey-900 dark:text-white">
                      {stock.price.toLocaleString('vi-VN')}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Badge intent={isUp ? 'success' : 'danger'} size="md">
                        {isUp ? '+' : ''}
                        {stock.percentChange}%
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {isUp ? (
                        <RiArrowUpFill className="w-5 h-5 text-emerald-600 dark:text-emerald-500 inline" />
                      ) : (
                        <RiArrowDownFill className="w-5 h-5 text-red-600 dark:text-red-500 inline" />
                      )}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-mono font-medium text-grey-700 dark:text-grey-300">
                      {stock.volume?.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div
                        className={`flex items-center justify-center gap-1.5 text-xs font-medium ${statusInfo.color}`}
                      >
                        <statusInfo.icon size={20} />
                        {statusInfo.text}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => toggleWishlist(stock.symbol)}
                        className={`p-2 rounded-full cursor-pointer transition-colors outline-none focus-visible:ring-2 ring-primary-500 ${isWishlisted ? 'text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10' : 'text-grey-400 hover:text-pink-500 hover:bg-grey-100 dark:hover:bg-grey-800'}`}
                      >
                        <RiHeartFill size={18} />
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
