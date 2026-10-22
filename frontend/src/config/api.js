/**
 * Centralized API configuration for Suryakiran's Portfolio
 * Ensures seamless API resolution across:
 * - Desktop Localhost (http://localhost:5173 -> /api or 127.0.0.1:8000)
 * - Mobile Phones, Tablets & other devices on the same Wi-Fi (e.g. http://192.168.1.25:5173 -> /api proxy)
 * - All Browsers: Google Chrome, Opera, Opera Mini, Safari iOS, Firefox, Edge, Brave
 * - Production deployments & reverse proxies
 */

export const getApiBase = () => {
  if (typeof window !== 'undefined' && window.location) {
    const { port, hostname, protocol } = window.location;

    // When served via Vite dev server (port 5173) or production relative path,
    // using '/api' leverages the Vite proxy / web server proxy, ensuring requests
    // route correctly from ANY device (phones, tablets, PCs) without CORS issues.
    if (port === '5173' || !port || port === '80' || port === '443') {
      return '/api';
    }

    // Direct access to an IP or custom domain on another port:
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${protocol}//${hostname}:8000/api`;
    }
  }

  // Local fallback
  return 'http://127.0.0.1:8000/api';
};

export const API_BASE = getApiBase();
export default API_BASE;
