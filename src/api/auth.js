import { API_BASE_URL } from "./config";

/**
 * Melakukan autentikasi admin ke Backend API (Laravel Sanctum)
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{message: string, access_token: string, token_type: string}>}
 */
export const loginAdmin = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Tangani validasi Laravel (422) atau unauthorized (401)
    if (data.errors) {
      const firstError = Object.values(data.errors)[0];
      throw new Error(Array.isArray(firstError) ? firstError[0] : data.message);
    }
    throw new Error(data.message || "Gagal melakukan login. Silakan coba lagi.");
  }

  return data;
};

/**
 * Mengambil token autentikasi dari localStorage
 */
export const getAuthToken = () => {
  return localStorage.getItem("token") || localStorage.getItem("admin_token");
};

/**
 * Menyimpan token autentikasi ke localStorage
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("admin_token", token);
  }
};

/**
 * Menghapus token autentikasi (Logout)
 */
export const removeAuthToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin_token");
};

/**
 * Mengecek apakah admin sedang login
 */
export const isAuthenticated = () => {
  return Boolean(getAuthToken());
};

