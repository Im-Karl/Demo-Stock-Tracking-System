import axios from 'axios';

const crawlerClient = axios.create({
  baseURL: 'http://localhost:4000', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const newsService = {
  // 1. Tin Quốc Tế (/searchWorld)
  searchWorld: (params = {}) => {
    return crawlerClient.get('/searchWorld', { params });
  },

  // 2. Tin VN - Có mã chứng khoán (/searchVN_hasSymbols)
  searchBySymbol: (params = {}) => {
    return crawlerClient.get('/searchVN_hasSymbols', { params });
  },

  // 3. Tin VN - Không có mã (/searchVN_noSymbols)
  searchNoSymbol: (params = {}) => {
    return crawlerClient.get('/searchVN_noSymbols', { params });
  }
};