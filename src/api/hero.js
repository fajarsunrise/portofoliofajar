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
 * GET /api/heroes
 * Mengambil data konten Hero & Marquee
 */
export const fetchHero = async () => {
  const response = await fetch(`${API_BASE_URL}/heroes`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil data Hero.");
  }
  return data.data;
};

/**
 * POST /api/heroes
 * Memperbarui atau menyimpan data Hero & Marquee
 * Menggunakan FormData untuk mendukung pengunggahan gambar ke Cloudinary.
 */
export const updateHero = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/heroes`, {
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
    throw new Error(data.message || "Gagal memperbarui pengaturan Hero.");
  }
  return data;
};
