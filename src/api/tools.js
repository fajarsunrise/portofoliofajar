import { API_BASE_URL } from "./config";

/**
 * Helper untuk menyusun header dengan Bearer Token Sanctum
 * @param {boolean} isMultipart Apakah request mengirim FormData/file
 */
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("token") || localStorage.getItem("admin_token");
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
 * GET /api/tools
 * Mengambil seluruh daftar tools (mendukung pencarian)
 */
export const fetchTools = async (search = "") => {
  const url = search 
    ? `${API_BASE_URL}/tools?search=${encodeURIComponent(search)}` 
    : `${API_BASE_URL}/tools`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil daftar tools.");
  }
  return data;
};

/**
 * POST /api/tools
 * Membuat tool baru (FormData untuk file ikon/gambar)
 */
export const createTool = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/tools`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    if (data.errors) {
      const firstErr = Object.values(data.errors)[0];
      throw new Error(Array.isArray(firstErr) ? firstErr[0] : data.message);
    }
    throw new Error(data.message || "Gagal membuat tool baru.");
  }
  return data;
};

/**
 * POST /api/tools/{id} dengan _method=PUT
 * Memperbarui data tool
 */
export const updateTool = async (id, formData) => {
  if (!formData.has("_method")) {
    formData.append("_method", "PUT");
  }

  const response = await fetch(`${API_BASE_URL}/tools/${id}`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    if (data.errors) {
      const firstErr = Object.values(data.errors)[0];
      throw new Error(Array.isArray(firstErr) ? firstErr[0] : data.message);
    }
    throw new Error(data.message || "Gagal memperbarui tool.");
  }
  return data;
};

/**
 * DELETE /api/tools/{id}
 * Menghapus tool dari database
 */
export const deleteTool = async (id) => {
  const response = await fetch(`${API_BASE_URL}/tools/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal menghapus tool.");
  }
  return data;
};

