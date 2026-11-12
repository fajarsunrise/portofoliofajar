import { API_BASE_URL } from "./config";

/**
 * Helper untuk menyusun header dengan Bearer Token Sanctum
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
 * GET /api/experiences
 * Mengambil seluruh daftar riwayat pengalaman kerja
 */
export const fetchExperiences = async () => {
  const response = await fetch(`${API_BASE_URL}/experiences`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil daftar pengalaman.");
  }
  return data;
};

/**
 * POST /api/experiences
 * Menambah riwayat pengalaman baru
 */
export const createExperience = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/experiences`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    if (data.errors) {
      const firstErr = Object.values(data.errors)[0];
      throw new Error(Array.isArray(firstErr) ? firstErr[0] : data.message);
    }
    throw new Error(data.message || "Gagal membuat data pengalaman.");
  }
  return data;
};

/**
 * PUT /api/experiences/{id}
 * Memperbarui data pengalaman kerja
 */
export const updateExperience = async (id, payload) => {
  const response = await fetch(`${API_BASE_URL}/experiences/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    if (data.errors) {
      const firstErr = Object.values(data.errors)[0];
      throw new Error(Array.isArray(firstErr) ? firstErr[0] : data.message);
    }
    throw new Error(data.message || "Gagal memperbarui data pengalaman.");
  }
  return data;
};

/**
 * DELETE /api/experiences/{id}
 * Menghapus data pengalaman kerja
 */
export const deleteExperience = async (id) => {
  const response = await fetch(`${API_BASE_URL}/experiences/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal menghapus data pengalaman.");
  }
  return data;
};

