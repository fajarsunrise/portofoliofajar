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
 * GET /api/about
 * Mengambil data pengaturan konten utama (Hero, Marquee, About, dan Kontak)
 */
export const fetchAbout = async () => {
  const response = await fetch(`${API_BASE_URL}/about`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil data pengaturan About.");
  }
  return data.data;
};

/**
 * POST /api/about
 * Memperbarui atau menyimpan data pengaturan konten utama (Hero, Marquee, About, dan Kontak)
 * Menggunakan FormData untuk mendukung pengunggahan file gambar profil ke Cloudinary.
 */
export const updateAbout = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/about`, {
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
    throw new Error(data.message || "Gagal memperbarui pengaturan About.");
  }
  return data;
};

