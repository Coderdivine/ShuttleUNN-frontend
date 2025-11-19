import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2060';

console.log('[Axios] API URL:', apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shuttleunn-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const userType = localStorage.getItem('userType');
      localStorage.removeItem('shuttleunn-token');
      localStorage.removeItem('appUser');
      localStorage.removeItem('userType');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('appStats');
      
      // Redirect to appropriate login page based on user type
      if (userType === 'driver') {
        window.location.href = '/driver/auth/login';
      } else {
        window.location.href = '/student/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
