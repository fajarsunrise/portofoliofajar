import { API_BASE_URL } from "./config";

/**
 * Helper untuk menyusun header dengan token Bearer Sanctum
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("admin_token");
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * POST /api/messages (Publik)
 * Mengirim pesan baru dari form kontak pengunjung
 */
export const sendMessage = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    if (data.errors) {
      const firstErr = Object.values(data.errors)[0];
      throw new Error(Array.isArray(firstErr) ? firstErr[0] : data.message);
    }
    throw new Error(data.message || "Gagal mengirim pesan. Silakan coba beberapa saat lagi.");
  }

  return data;
};

/**
 * GET /api/messages (Privat - Admin)
 * Mengambil seluruh daftar pesan masuk dari database
 */
export const fetchMessages = async (search = "") => {
  const url = search 
    ? `${API_BASE_URL}/messages?search=${encodeURIComponent(search)}` 
    : `${API_BASE_URL}/messages`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil daftar pesan masuk.");
  }

  return data;
};

/**
 * DELETE /api/messages/{id} (Privat - Admin)
 * Menghapus satu pesan masuk dari database
 */
export const deleteMessage = async (id) => {
  const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal menghapus pesan.");
  }

  return data;
};

