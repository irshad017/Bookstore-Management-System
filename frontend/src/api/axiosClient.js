import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('bookstore_user');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error('Failed to parse user info token:', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract clean error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    // If token expired, clear local storage and redirect to login
    if (error.response?.status === 401) {
      if (localStorage.getItem('bookstore_user')) {
        localStorage.removeItem('bookstore_user');
        window.location.href = '/login?session_expired=true';
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
