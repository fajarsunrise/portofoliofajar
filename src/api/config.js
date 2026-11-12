// src/api/config.js

// GANTI URL INI dengan URL asli dari backend Render Anda!
// Pastikan berakhiran dengan /api
// export const API_BASE_URL = 'https://api-artikel-portofolio.onrender.com/api';
export const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Helper untuk memastikan URL gambar selalu lengkap dengan origin backend
 * jika API mengembalikan relative path (seperti /storage/heroes/...)
 */
export const getFullImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Jika URL mengarah ke storage local backend 127.0.0.1:8000, localhost:8000, atau sudah relative /storage/
  // Ubah/pertahankan menjadi relative path /storage/... agar melalui Vite proxy (bebas kendala CORS di Canvas/WebGL)
  if (trimmed.includes('/storage/')) {
    const match = trimmed.match(/\/storage\/.+$/);
    if (match) return match[0];
  }

  // Jika mengarah ke aset lokal frontend Vite di folder /public
  if (
    trimmed.startsWith('/default-avatar') ||
    trimmed.startsWith('default-avatar') ||
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('assets/') ||
    trimmed.startsWith('/preview') ||
    trimmed.startsWith('/vite.svg')
  ) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

  // Jika sudah URL absolut (http, https, blob:, data:)
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  // Bersihkan origin backend dari API_BASE_URL (misal: http://127.0.0.1:8000)
  const backendOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${backendOrigin}${cleanPath}`;
};

export const fetchArticles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles`);
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari server');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    return null;
  }
};