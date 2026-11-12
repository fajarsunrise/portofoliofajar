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
 * GET /api/certificates
 * Mengambil daftar sertifikat (mendukung pencarian)
 */
export const fetchCertificates = async (search = "") => {
  const url = search 
    ? `${API_BASE_URL}/certificates?search=${encodeURIComponent(search)}` 
    : `${API_BASE_URL}/certificates`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil daftar sertifikat.");
  }
  return data;
};

/**
 * POST /api/certificates
 * Membuat sertifikat baru (FormData untuk file gambar)
 */
export const createCertificate = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/certificates`, {
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
    throw new Error(data.message || "Gagal menyimpan sertifikat baru.");
  }
  return data;
};

/**
 * POST /api/certificates/{id} dengan _method=PUT
 * Memperbarui data sertifikat
 */
export const updateCertificate = async (id, formData) => {
  if (!formData.has("_method")) {
    formData.append("_method", "PUT");
  }

  const response = await fetch(`${API_BASE_URL}/certificates/${id}`, {
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
    throw new Error(data.message || "Gagal memperbarui sertifikat.");
  }
  return data;
};

/**
 * DELETE /api/certificates/{id}
 * Menghapus sertifikat
 */
export const deleteCertificate = async (id) => {
  const response = await fetch(`${API_BASE_URL}/certificates/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal menghapus sertifikat.");
  }
  return data;
};

