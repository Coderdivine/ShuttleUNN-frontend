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
    // Try to get token based on userType (student or driver)
    const userType = localStorage.getItem('userType');
    let token = null;
    
    if (userType === 'student') {
      token = localStorage.getItem('shuttleunn-token-student');
    } else if (userType === 'driver') {
      token = localStorage.getItem('shuttleunn-token-driver');
    }
    
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
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
      
      // Clear userType-specific storage
      if (userType === 'student') {
        localStorage.removeItem('shuttleunn-token-student');
        localStorage.removeItem('appUser_student');
        localStorage.removeItem('isAuthenticated_student');
        localStorage.removeItem('appStats_student');
      } else if (userType === 'driver') {
        localStorage.removeItem('shuttleunn-token-driver');
        localStorage.removeItem('appUser_driver');
        localStorage.removeItem('isAuthenticated_driver');
        localStorage.removeItem('appStats_driver');
      }
      localStorage.removeItem('userType');
      
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
