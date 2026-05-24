import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('avidusUser');

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {
      localStorage.removeItem('avidusUser');
    }
  }

  return config;
});

export default api;
