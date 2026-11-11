/**
 * Centralized API configuration for Suryakiran's Portfolio.
 * Priority:
 * 1. Explicit VITE_API_BASE (used in production deployments such as Vercel -> Render/Railway Django API)
 * 2. Local Vite dev proxy ('/api' when running on :5173)
 * 3. Direct LAN host Django backend (:8000/api)
 */

export const getApiBase = () => {
  const configured = import.meta.env.VITE_API_BASE;
  if (configured && configured.trim()) {
    return configured.trim().replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location) {
    const { port, hostname, protocol } = window.location;

    if (port === '5173') {
      return '/api';
    }

    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      if (!port || port === '80' || port === '443') {
        return '/api';
      }
      return `${protocol}//${hostname}:8000/api`;
    }
  }

  return 'http://127.0.0.1:8000/api';
};

export const API_BASE = getApiBase();
export default API_BASE;
