import { useState, useEffect } from "react";
import { 
  Plus, 
  Briefcase, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Calendar,
  Building2
} from "lucide-react";
import { 
  fetchExperiences, 
  createExperience, 
  updateExperience, 
  deleteExperience 
} from "../../api/experiences";

export default function ExperienceTable() {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Alert State
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    id: null,
    role: "",
    company: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const [experienceToDelete, setExperienceToDelete] = useState(null);
  const [modalError, setModalError] = useState("");

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 4500);
  };

  // 1. READ: Ambil seluruh data pengalaman kerja
  const loadExperiences = async () => {
    try {
      setIsLoading(true);
      const res = await fetchExperiences();
      if (res && res.data) {
        setExperiences(Array.isArray(res.data) ? res.data : []);
      } else {
        setExperiences([]);
      }
    } catch (err) {
      console.error("Gagal memuat data pengalaman:", err);
      showAlert("error", err.message || "Gagal mengambil data pengalaman.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const resetForm = () => {
    setFormData({
      id: null,
      role: "",
      company: "",
      start_date: "",
      end_date: "",
      description: "",
    });
    setModalError("");
  };

  // 2. CREATE: Tambah Pengalaman Baru
  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!formData.role.trim() || !formData.company.trim() || !formData.start_date.trim() || !formData.end_date.trim() || !formData.description.trim()) {
      setModalError("Semua kolom (Posisi, Perusahaan, Tanggal Mulai, Tanggal Selesai, Deskripsi) wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createExperience({
        role: formData.role.trim(),
        company: formData.company.trim(),
        start_date: formData.start_date.trim(),
        end_date: formData.end_date.trim(),
        description: formData.description.trim(),
      });

      setIsAddModalOpen(false);
      resetForm();
      showAlert("success", `Pengalaman "${formData.role}" di ${formData.company} berhasil ditambahkan!`);
      await loadExperiences();
    } catch (err) {
      setModalError(err.message || "Gagal membuat data pengalaman.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. UPDATE: Edit Pengalaman
  const handleOpenEdit = (item) => {
    setFormData({
      id: item.id,
      role: item.role || "",
      company: item.company || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      description: item.description || "",
    });
    setModalError("");
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!formData.role.trim() || !formData.company.trim()) {
      setModalError("Posisi dan Perusahaan wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateExperience(formData.id, {
        role: formData.role.trim(),
        company: formData.company.trim(),
        start_date: formData.start_date.trim(),
        end_date: formData.end_date.trim(),
        description: formData.description.trim(),
      });

      setIsEditModalOpen(false);
      showAlert("success", `Pengalaman "${formData.role}" berhasil diperbarui!`);
      await loadExperiences();
    } catch (err) {
      setModalError(err.message || "Gagal memperbarui data pengalaman.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. DELETE: Hapus Pengalaman
  const handleOpenDelete = (item) => {
    setExperienceToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!experienceToDelete) return;

    try {
      setIsSubmitting(true);
      await deleteExperience(experienceToDelete.id);

      setIsDeleteModalOpen(false);
      showAlert("success", `Pengalaman di ${experienceToDelete.company} berhasil dihapus.`);
      setExperienceToDelete(null);
      await loadExperiences();
    } catch (err) {
      showAlert("error", err.message || "Gagal menghapus pengalaman.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
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

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <span>Manajemen Riwayat Pengalaman Kerja</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Kelola posisi karier, nama perusahaan, durasi kerja, dan rincian tanggung jawab.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadExperiences}
            disabled={isLoading}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Muat ulang data dari API"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-950/60 hover:shadow-emerald-900/50 transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pengalaman</span>
          </button>
        </div>
      </div>

      {/* Container Tabel Pengalaman */}
      <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
            <p className="text-sm text-zinc-400">Memuat riwayat pengalaman...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-center mb-3 text-zinc-500">
              <Briefcase className="w-7 h-7 text-emerald-400" />
            </div>
            <h4 className="text-base font-semibold text-zinc-200">Belum ada riwayat pengalaman</h4>
            <p className="text-sm text-zinc-500 max-w-sm mt-1 mb-5">
              Tambahkan posisi kerja, magang, atau riwayat karier profesional Anda.
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pengalaman Pertama</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold min-w-[200px]">Posisi</th>
                  <th scope="col" className="px-6 py-4 font-semibold min-w-[180px]">Perusahaan</th>
                  <th scope="col" className="px-6 py-4 font-semibold min-w-[170px]">Durasi</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {experiences.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-zinc-800/30 transition-colors group"
                  >
                    {/* Kolom 1: Posisi */}
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-semibold text-white text-base group-hover:text-emerald-400 transition-colors">
                          {item.role}
                        </span>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2 max-w-md">
                          {item.description}
                        </p>
                      </div>
                    </td>

                    {/* Kolom 2: Perusahaan */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="font-medium text-zinc-200">{item.company}</span>
                      </div>
                    </td>

                    {/* Kolom 3: Durasi */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{item.start_date} – {item.end_date}</span>
                      </div>
                    </td>

                    {/* Kolom 4: Aksi */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-500 rounded-lg transition-all duration-150 cursor-pointer shadow-sm"
                          title="Edit Pengalaman"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleOpenDelete(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 rounded-lg transition-all duration-150 cursor-pointer shadow-sm"
                          title="Hapus Pengalaman"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-3.5 bg-zinc-950/60 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>Total {experiences.length} pengalaman kerja</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: TAMBAH PENGALAMAN BARU */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-white text-base">Tambah Pengalaman Kerja</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Posisi */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-300">
                    Posisi / Role <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Frontend Developer"
                    value={formData.role}
                    onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                {/* Perusahaan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-300">
                    Nama Perusahaan <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT Teknologi Bangsa"
                    value={formData.company}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                {/* Tanggal Mulai */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-300">
                    Tanggal Mulai <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jan 2022 atau 2022"
                    value={formData.start_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                {/* Tanggal Selesai */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-300">
                    Tanggal Selesai <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sekarang / Des 2023"
                    value={formData.end_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Deskripsi Pekerjaan & Tanggung Jawab <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Jelaskan kontribusi, teknologi yang digunakan, serta pencapaian Anda selama memegang posisi ini..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-y leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer shadow-lg shadow-emerald-950/60 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Pengalaman</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT PENGALAMAN */}
      {/* ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-white text-base">Edit Pengalaman Kerja</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Posisi */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-300">
                    Posisi / Role <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                {/* Perusahaan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-300">
                    Nama Perusahaan <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                {/* Tanggal Mulai */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-300">
                    Tanggal Mulai <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                {/* Tanggal Selesai */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-300">
                    Tanggal Selesai <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Deskripsi Pekerjaan & Tanggung Jawab <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-y leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer shadow-lg shadow-emerald-950/60 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Perubahan</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: KONFIRMASI HAPUS */}
      {/* ======================================================== */}
      {isDeleteModalOpen && experienceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Hapus Pengalaman?</h4>
                <p className="text-xs text-zinc-400">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>

            <p className="text-sm text-zinc-300">
              Apakah Anda yakin ingin menghapus posisi <strong className="text-white">"{experienceToDelete.role}"</strong> di <strong className="text-white">"{experienceToDelete.company}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setExperienceToDelete(null);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-colors cursor-pointer shadow-lg shadow-red-950/60 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

