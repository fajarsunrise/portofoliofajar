import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  Image as ImageIcon, 
  Upload, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle
} from "lucide-react";
import { fetchAbout, updateAbout } from "../../api/about";
import { getFullImageUrl } from "../../api/config";
import ExperienceTable from "./ExperienceTable";

export default function AboutManager() {
  const [formData, setFormData] = useState({
    bio: "",
    gpa: "",
    projects_completed: "",
    contact_email: "",
    profile_image_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 5000);
  };

  // 1. Fetch data dari API GET /api/about saat pertama kali dimuat
  const loadAboutData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAbout();
      if (data) {
        setFormData({
          bio: data.bio || data.about_bio || "",
          gpa: data.gpa !== null && data.gpa !== undefined ? String(data.gpa) : "",
          projects_completed: data.projects_completed !== null && data.projects_completed !== undefined ? String(data.projects_completed) : "",
          contact_email: data.contact_email || "",
          profile_image_url: data.profile_image_url || "",
        });
        setImagePreview(data.profile_image_url ? getFullImageUrl(data.profile_image_url) : null);
      }
    } catch (err) {
      console.error("Gagal memuat data About:", err);
      showAlert("error", err.message || "Gagal memuat pengaturan About.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAboutData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showAlert("error", "Ukuran foto profil maksimal adalah 2MB.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 2. Simpan Pembaruan Profil menggunakan POST request (FormData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append("bio", formData.bio);
      if (formData.gpa !== "") {
        dataToSend.append("gpa", formData.gpa);
      }
      dataToSend.append("projects_completed", formData.projects_completed);
      dataToSend.append("contact_email", formData.contact_email);

      if (imageFile) {
        dataToSend.append("profile_image", imageFile);
      } else if (formData.profile_image_url) {
        dataToSend.append("profile_image_url", formData.profile_image_url);
      }

      const res = await updateAbout(dataToSend);

      if (res && res.data) {
        setFormData({
          bio: res.data.bio || "",
          gpa: res.data.gpa !== null && res.data.gpa !== undefined ? String(res.data.gpa) : "",
          projects_completed: res.data.projects_completed !== null && res.data.projects_completed !== undefined ? String(res.data.projects_completed) : "",
          contact_email: res.data.contact_email || "",
          profile_image_url: res.data.profile_image_url || "",
        });
        setImagePreview(res.data.profile_image_url ? getFullImageUrl(res.data.profile_image_url) : null);
        setImageFile(null);
      }

      showAlert("success", "Pengaturan Profil About berhasil diperbarui!");
    } catch (err) {
      console.error("Gagal menyimpan data About:", err);
      showAlert("error", err.message || "Gagal menyimpan perubahan profil ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      
      {/* Alert Notification */}
      {alert.show && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium animate-in fade-in slide-in-from-top duration-200 ${
            alert.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-red-950/40 border-red-500/40 text-red-300"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span>{alert.message}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABOUT BAGIAN ATAS: FORM PROFIL */}
      {/* ======================================================== */}
      <section className="space-y-6">
        
        {/* Header Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Profil & Informasi Tentang Saya</h2>
              <p className="text-xs text-zinc-400">
                Kelola biografi naratif, GPA (IPK), total projek selesai, foto avatar, dan surel kontak.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadAboutData}
            disabled={isLoading || isSubmitting}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700/60 rounded-xl transition-colors cursor-pointer disabled:opacity-50 self-start sm:self-auto"
            title="Muat ulang data dari API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
            <span>Segarkan Profil</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
            <p className="text-sm text-zinc-400">Memuat data profil About dari server...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Foto Profil Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Foto Profil / Avatar
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-zinc-950/70 border border-zinc-800 rounded-xl">
                {/* Image Preview Box */}
                <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-zinc-700/80 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-inner">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/150x150/1a1a1a/FFF?text=Avatar";
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-zinc-600" />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="profile_image_input"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{imagePreview ? "Ganti Foto Profil" : "Unggah Foto Profil"}</span>
                    </label>
                    <input
                      id="profile_image_input"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {imageFile && (
                      <span className="text-xs text-emerald-400 truncate max-w-xs">
                        {imageFile.name}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Format: JPG, PNG, WEBP. Maksimal 2MB. Gambar akan otomatis dioptimasi dan disimpan ke Cloudinary.
                  </p>
                </div>
              </div>
            </div>

            {/* About Bio */}
            <div className="space-y-2">
              <label htmlFor="about_bio_field" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Biografi Tentang Saya (Bio) <span className="text-emerald-400">*</span>
              </label>
              <textarea
                id="about_bio_field"
                name="bio"
                rows={5}
                required
                value={formData.bio}
                onChange={handleChange}
                placeholder="Ceritakan latar belakang, fokus teknologi, dan antusiasme Anda dalam pengembangan aplikasi..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-y leading-relaxed"
              />
              <p className="text-[11px] text-zinc-500">Teks narasi panjang yang ditampilkan di bagian "About Me".</p>
            </div>

            {/* Grid 3 Kolom: GPA (IPK), Jumlah Projek, Email Kontak */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* GPA (IPK) */}
              <div className="space-y-2">
                <label htmlFor="gpa_field" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>GPA (IPK) <span className="text-emerald-400">*</span></span>
                </label>
                <input
                  id="gpa_field"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.00"
                  name="gpa"
                  required
                  value={formData.gpa}
                  onChange={handleChange}
                  placeholder="Contoh: 3.85"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <p className="text-[11px] text-zinc-500">Nilai Indeks Prestasi Kumulatif (skala 4.00).</p>
              </div>

              {/* Jumlah Projek Selesai */}
              <div className="space-y-2">
                <label htmlFor="projects_completed_field" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Projek Selesai <span className="text-emerald-400">*</span></span>
                </label>
                <input
                  id="projects_completed_field"
                  type="text"
                  name="projects_completed"
                  required
                  value={formData.projects_completed}
                  onChange={handleChange}
                  placeholder="Contoh: 20 atau 20+"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <p className="text-[11px] text-zinc-500">Total projek yang telah diselesaikan.</p>
              </div>

              {/* Email Kontak */}
              <div className="space-y-2">
                <label htmlFor="contact_email_field" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Email Kontak <span className="text-emerald-400">*</span></span>
                </label>
                <input
                  id="contact_email_field"
                  type="email"
                  name="contact_email"
                  required
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="Contoh: fajar@example.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <p className="text-[11px] text-zinc-500">Tujuan surel untuk tawaran kolaborasi.</p>
              </div>

            </div>

            {/* Tombol Simpan Form Profil */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={loadAboutData}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl border border-zinc-700/80 bg-zinc-900 hover:bg-zinc-800 text-sm font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-sm font-semibold text-white shadow-lg shadow-emerald-950/60 hover:shadow-emerald-900/50 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Profil</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </section>

      {/* ======================================================== */}
      {/* GARIS PEMBATAS RAPI (DIVIDER) */}
      {/* ======================================================== */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-zinc-800/80" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-zinc-950 px-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Riwayat Karier
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ABOUT BAGIAN BAWAH: TABEL MANAJEMEN PENGALAMAN (CRUD) */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <ExperienceTable />
      </section>

    </div>
  );
}
