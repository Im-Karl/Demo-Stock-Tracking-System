import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Thêm timeout để nếu mạng lag quá thì báo lỗi thay vì treo
  timeout: 10000,
});

// 1. Interceptor Request: Gắn Token & Log xem đang gọi API nào
axiosClient.interceptors.request.use(
  (config) => {
    // Check môi trường: Browser hay Server?
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // Nếu chạy trên Server (Astro SSR), ta có thể log ra Terminal để debug
      console.log(`[SSR Request] ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Interceptor Response: Log lỗi chi tiết nếu thất bại
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu có lỗi, log ra chi tiết để biết tại sao
    if (error.response) {
      // Server trả về lỗi (4xx, 5xx)
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      // Không nhận được phản hồi (Backend chưa bật hoặc sai Port)
      console.error('API No Response (Backend off?):', error.request);
    } else {
      console.error(' API Setup Error:', error.message);
    }
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        console.warn('Token đã hết hạn hoặc không hợp lệ. Đang đăng xuất...');

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (!window.location.pathname.includes('/login')) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
