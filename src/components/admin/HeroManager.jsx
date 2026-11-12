import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Upload, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";
import { fetchHero, updateHero } from "../../api/hero";
import { getFullImageUrl } from "../../api/config";

export default function HeroManager() {
  const [formData, setFormData] = useState({
    greeting: "",
    description: "",
    marquee_text: "",
    image_url: "",
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

  // 1. GET data Hero dari backend saat pertama kali dimuat
  const loadHeroData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchHero();
      if (data) {
        setFormData({
          greeting: data.greeting || "",
          description: data.description || "",
          marquee_text: data.marquee_text || "",
          image_url: data.image_url || "",
        });
        setImagePreview(data.image_url ? getFullImageUrl(data.image_url) : null);
      }
    } catch (err) {
      console.error("Gagal memuat data Hero:", err);
      showAlert("error", err.message || "Gagal memuat pengaturan Hero.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHeroData();
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
        showAlert("error", "Ukuran gambar hero maksimal adalah 2MB.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 2. POST update data Hero menggunakan FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append("greeting", formData.greeting);
      dataToSend.append("description", formData.description);
      dataToSend.append("marquee_text", formData.marquee_text);

      if (imageFile) {
        dataToSend.append("image", imageFile);
      } else if (formData.image_url) {
        dataToSend.append("image_url", formData.image_url);
      }

      const res = await updateHero(dataToSend);

      if (res && (res.data || res.image_url)) {
        const heroData = res.data?.data || res.data || res;
        const newImageUrl = heroData.image_url || "";
        setFormData({
          greeting: heroData.greeting || "",
          description: heroData.description || "",
          marquee_text: heroData.marquee_text || "",
          image_url: newImageUrl,
        });
        setImagePreview(newImageUrl ? getFullImageUrl(newImageUrl) : null);
        setImageFile(null);
      }

      showAlert("success", "Pengaturan Hero Section berhasil diperbarui!");
    } catch (err) {
      console.error("Gagal menyimpan data Hero:", err);
      showAlert("error", err.message || "Gagal menyimpan perubahan ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
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

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Pengaturan Hero Section</h2>
            <p className="text-xs text-zinc-400">
              Konfigurasi teks salam pembuka, deskripsi, teks berjalan (marquee), dan gambar hero.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadHeroData}
          disabled={isLoading || isSubmitting}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700/60 rounded-xl transition-colors cursor-pointer disabled:opacity-50 self-start sm:self-auto"
          title="Muat ulang data dari API"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
          <p className="text-sm text-zinc-400">Memuat data Hero dari server...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Greeting */}
            <div className="space-y-2">
              <label htmlFor="hero_greeting_field" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Hero Greeting / Salam Pembuka <span className="text-emerald-400">*</span>
              </label>
              <input
                id="hero_greeting_field"
                type="text"
                name="greeting"
                required
                value={formData.greeting}
                onChange={handleChange}
                placeholder="Contoh: Hi I'm Fajar"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              <p className="text-[11px] text-zinc-500">Teks judul sapaan di bagian pembuka beranda.</p>
            </div>

            {/* Marquee Text */}
            <div className="space-y-2">
              <label htmlFor="hero_marquee_field" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Teks Berjalan (Marquee Ticker) <span className="text-emerald-400">*</span>
              </label>
              <input
                id="hero_marquee_field"
                type="text"
                name="marquee_text"
                required
                value={formData.marquee_text}
                onChange={handleChange}
                placeholder="Contoh: Web Developer • Full-Stack Engineer • UI/UX Enthusiast"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              <p className="text-[11px] text-zinc-500">Teks animasi bergerak di antara area hero dan konten berikutnya.</p>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="hero_description_field" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Deskripsi Singkat Hero <span className="text-emerald-400">*</span>
              </label>
              <textarea
                id="hero_description_field"
                name="description"
                rows={3}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="A passionate web and application developer dedicated to crafting modern digital experiences..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-y leading-relaxed"
              />
              <p className="text-[11px] text-zinc-500">Paragraf pengantar yang tampil tepat di bawah salam pembuka.</p>
            </div>

            {/* Gambar Hero Upload */}
            <div className="md:col-span-2 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Gambar Hero / Foto Beranda
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-zinc-950/70 border border-zinc-800 rounded-xl">
                {/* Preview Box */}
                <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-zinc-700/80 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-inner">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-zinc-600" />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="hero_image_input"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{imagePreview ? "Ganti Gambar Hero" : "Unggah Gambar Hero"}</span>
                    </label>
                    <input
                      id="hero_image_input"
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

          </div>

          {/* Action Button Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={loadHeroData}
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
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}

