import { API_BASE_URL } from "./config";
import { getAuthToken } from "./auth";

/**
 * Helper untuk menyusun headers dengan Bearer Token Sanctum
 */
const getAuthHeaders = (isMultipart = false) => {
  const token = getAuthToken();
  const headers = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

/**
 * Mengambil daftar artikel (dengan opsi search & category_id)
 */
export const getAdminArticles = async (search = "", categoryId = "") => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (categoryId) params.append("category_id", categoryId);

  const url = `${API_BASE_URL}/articles${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal memuat artikel.");
  }

  return data;
};

/**
 * Mengambil daftar kategori
 */
export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal memuat kategori.");
  }

  return data;
};

/**
 * Membuat artikel baru (menggunakan FormData untuk mendukung upload gambar ke Cloudinary)
 */
export const createArticle = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/articles`, {
    method: "POST",
    headers: getAuthHeaders(true), // Jangan set Content-Type agar boundary multipart dibuat otomatis oleh browser
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    if (data.errors) {
      const firstError = Object.values(data.errors)[0];
      throw new Error(Array.isArray(firstError) ? firstError[0] : data.message);
    }
    throw new Error(data.message || "Gagal membuat artikel.");
  }

  return data;
};

/**
 * Memperbarui artikel
 */
export const updateArticle = async (id, payload) => {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    if (data.errors) {
      const firstError = Object.values(data.errors)[0];
      throw new Error(Array.isArray(firstError) ? firstError[0] : data.message);
    }
    throw new Error(data.message || "Gagal memperbarui artikel.");
  }

  return data;
};

/**
 * Menghapus artikel berdasarkan ID
 */
export const deleteArticle = async (id) => {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal menghapus artikel.");
  }

  return data;
};

