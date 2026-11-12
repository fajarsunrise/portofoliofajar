import { API_BASE_URL } from "./config";

/**
 * Menyusun Header dengan otorisasi Bearer Token Sanctum
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

  // Jika multipart/form-data, jangan pasang Content-Type agar browser otomatis menyisipkan boundary
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

/**
 * GET /api/projects
 * Mengambil semua daftar projek dari backend database
 */
export const fetchProjects = async (search = "") => {
  const url = search 
    ? `${API_BASE_URL}/projects?search=${encodeURIComponent(search)}` 
    : `${API_BASE_URL}/projects`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil daftar projek.");
  }
  return data;
};

/**
 * POST /api/projects
 * Membuat projek baru (menggunakan FormData untuk mendukung upload file gambar)
 */
export const createProject = async (formData) => {
  const isMultipart = formData instanceof FormData;
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: getAuthHeaders(isMultipart),
    body: isMultipart ? formData : JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok) {
    if (data.errors) {
      const firstErr = Object.values(data.errors)[0];
      throw new Error(Array.isArray(firstErr) ? firstErr[0] : data.message);
    }
    throw new Error(data.message || "Gagal menyimpan projek baru.");
  }
  return data;
};

/**
 * POST /api/projects/{id} dengan _method=PUT
 * Memperbarui projek (menggunakan POST + _method=PUT agar upload file gambar baru didukung oleh Laravel)
 */
export const updateProject = async (id, formData) => {
  const isMultipart = formData instanceof FormData;
  // Tambahkan _method = PUT jika menggunakan FormData
  if (isMultipart && !formData.has("_method")) {
    formData.append("_method", "PUT");
  }

  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "POST",
    headers: getAuthHeaders(isMultipart),
    body: isMultipart ? formData : JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok) {
    if (data.errors) {
      const firstErr = Object.values(data.errors)[0];
      throw new Error(Array.isArray(firstErr) ? firstErr[0] : data.message);
    }
    throw new Error(data.message || "Gagal memperbarui projek.");
  }
  return data;
};

/**
 * DELETE /api/projects/{id}
 * Menghapus projek dari backend database
 */
export const deleteProject = async (id) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal menghapus projek.");
  }
  return data;
};

