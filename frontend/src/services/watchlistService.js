import axiosClient from '../lib/axiosClient';

export const watchlistService = {
  getWatchlist: () => axiosClient.get('/watchlist'),
  addToWatchlist: (data) => axiosClient.post('/watchlist', data),
  removeFromWatchlist: (symbol) => axiosClient.delete(`/watchlist/${symbol}`),
  toggleAlert: (symbol, alertEnabled) => axiosClient.patch(`/watchlist/${symbol}/toggle`, { alertEnabled }),
};
