import axiosClient from '../lib/axiosClient';

export const newsService = {
  searchVN: (limit = 10) => axiosClient.get(`/news/searchVN?limit=${limit}`)
};