// CardioSentinel Global API Base URL Configuration

const isProd = import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

export const API_BASE_URL = (import.meta.env.VITE_API_URL || (isProd ? 'https://cardiosentinel-backend.onrender.com' : 'http://localhost:8000')).replace(/\/$/, '');

export const getApiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
