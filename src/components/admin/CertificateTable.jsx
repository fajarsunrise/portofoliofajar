import { useState, useEffect } from "react";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Search, 
  X, 
  Award, 
  Upload, 
  Building2, 
  Calendar,
  AlertTriangle,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FileBadge
} from "lucide-react";
import { 
  fetchCertificates, 
  createCertificate, 
  updateCertificate, 
  deleteCertificate 
} from "../../api/certificates";

export default function CertificateTable() {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  
  // Alert Feedback
  const [feedback, setFeedback] = useState({ type: null, message: "" });

  // Modal Tambah State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    issued_by: "",
    issue_date: "",
    imageFile: null,
  });
  const [createImagePreview, setCreateImagePreview] = useState(null);

  // Modal Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    title: "",
    issued_by: "",
    issue_date: "",
    imageFile: null,
    existingImage: "",
  });
  const [editImagePreview, setEditImagePreview] = useState(null);

  // Modal Hapus State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState(null);

  // Modal Error
  const [modalError, setModalError] = useState("");

  const showAlert = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: null, message: "" }), 5000);
  };

  // ==========================================
  // 1. READ: Ambil Data Sertifikat dari API
  // ==========================================
  const loadCertificates = async (searchQuery = "") => {
    try {
      setIsLoading(true);
      const res = await fetchCertificates(searchQuery);
      setCertificates(res?.data || []);
    } catch (err) {
      showAlert("error", err.message || "Gagal memuat data sertifikat dari backend API.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadCertificates(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ==========================================
  // 2. CREATE: Tambah Sertifikat Baru
  // ==========================================
  const handleCreateImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setModalError("Ukuran gambar sertifikat maksimal adalah 2MB.");
        return;
      }
      setModalError("");
      setCreateForm((prev) => ({ ...prev, imageFile: file }));
      setCreateImagePreview(URL.createObjectURL(file));
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      title: "",
      issued_by: "",
      issue_date: "",
      imageFile: null,
    });
    setCreateImagePreview(null);
    setModalError("");
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!createForm.title || !createForm.issued_by || !createForm.issue_date) {
      setModalError("Judul, penerbit, dan tanggal terbit sertifikat wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", createForm.title);
      formData.append("issued_by", createForm.issued_by);
      formData.append("issue_date", createForm.issue_date);
      if (createForm.imageFile) {
        formData.append("image", createForm.imageFile);
      }

      await createCertificate(formData);

      setIsAddModalOpen(false);
      resetCreateForm();
      showAlert("success", `Sertifikat "${createForm.title}" berhasil disimpan ke database!`);
      await loadCertificates();
    } catch (err) {
      setModalError(err.message || "Gagal membuat sertifikat baru.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 3. UPDATE: Edit Sertifikat
  // ==========================================
  const handleOpenEdit = (cert) => {
    // Format tanggal ke YYYY-MM-DD untuk input date
    let formattedDate = "";
    if (cert.issue_date) {
      const d = new Date(cert.issue_date);
      formattedDate = d.toISOString().split("T")[0];
    }

    setEditForm({
      id: cert.id,
      title: cert.title || "",
      issued_by: cert.issued_by || "",
      issue_date: formattedDate,
      imageFile: null,
      existingImage: cert.image_url || "",
    });
    setEditImagePreview(cert.image_url || null);
    setModalError("");
    setIsEditModalOpen(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setModalError("Ukuran gambar sertifikat maksimal adalah 2MB.");
        return;
      }
      setModalError("");
      setEditForm((prev) => ({ ...prev, imageFile: file }));
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!editForm.title || !editForm.issued_by || !editForm.issue_date) {
      setModalError("Judul, penerbit, dan tanggal terbit sertifikat wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("title", editForm.title);
      formData.append("issued_by", editForm.issued_by);
      formData.append("issue_date", editForm.issue_date);
      if (editForm.imageFile) {
        formData.append("image", editForm.imageFile);
      }

      await updateCertificate(editForm.id, formData);

      setIsEditModalOpen(false);
      showAlert("success", `Sertifikat "${editForm.title}" berhasil diperbarui!`);
      await loadCertificates();
    } catch (err) {
      setModalError(err.message || "Gagal memperbarui sertifikat.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 4. DELETE: Hapus Sertifikat
  // ==========================================
  const handleOpenDelete = (cert) => {
    setCertToDelete(cert);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!certToDelete) return;

    try {
      setIsSubmitting(true);
      await deleteCertificate(certToDelete.id);

      setIsDeleteModalOpen(false);
      showAlert("success", `Sertifikat "${certToDelete.title}" berhasil dihapus.`);
      setCertToDelete(null);
      await loadCertificates();
    } catch (err) {
      showAlert("error", err.message || "Gagal menghapus sertifikat.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Alert Notifikasi Realtime */}
      {feedback.message && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border shadow-lg ${
            feedback.type === "success"
              ? "bg-emerald-950/60 border-emerald-800/80 text-emerald-300 shadow-emerald-950/30"
              : "bg-red-950/60 border-red-800/80 text-red-300 shadow-red-950/30"
          } animate__animated animate__fadeIn`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            )}
            <span className="text-sm font-medium">{feedback.message}</span>
          </div>
          <button 
            onClick={() => setFeedback({ type: null, message: "" })} 
            className="text-zinc-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bar Atas: Pencarian & Tombol Tambah */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul sertifikat atau penerbit..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadCertificates(search)}
            disabled={isLoading}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Muat ulang data dari API"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
          </button>

          <button
            onClick={() => {
              resetCreateForm();
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-950/60 hover:shadow-emerald-900/50 transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sertifikat</span>
          </button>
        </div>
      </div>

      {/* Tabel Sertifikat */}
      <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
            <p className="text-sm font-medium">Memuat data sertifikat dari server backend...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mx-auto mb-3 text-zinc-500">
              <FileBadge className="w-7 h-7" />
            </div>
            <h4 className="text-base font-semibold text-zinc-300">Belum ada sertifikat di database</h4>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
              {search
                ? `Tidak ditemukan sertifikat dengan kata kunci "${search}".`
                : "Klik tombol 'Tambah Sertifikat' untuk menyimpan sertifikat pencapaian Anda."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold w-28">Gambar</th>
                  <th scope="col" className="px-6 py-4 font-semibold min-w-[240px]">Judul</th>
                  <th scope="col" className="px-6 py-4 font-semibold min-w-[180px]">Penerbit</th>
                  <th scope="col" className="px-6 py-4 font-semibold min-w-[160px]">Tanggal</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {certificates.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-zinc-800/30 transition-colors group"
                  >
                    {/* Kolom 1: Gambar */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition-colors flex items-center justify-center shadow-inner">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/120x80/1a1a1a/FFF?text=Sertifikat";
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-zinc-600" />
                        )}
                      </div>
                    </td>

                    {/* Kolom 2: Judul Sertifikat */}
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <h4 className="font-semibold text-white text-base group-hover:text-emerald-400 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </td>

                    {/* Kolom 3: Penerbit */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="font-medium text-zinc-200">{item.issued_by}</span>
                      </div>
                    </td>

                    {/* Kolom 4: Tanggal Terbit */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>
                          {item.issue_date
                            ? new Date(item.issue_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })
                            : "-"}
                        </span>
                      </div>
                    </td>

                    {/* Kolom 5: Aksi Edit & Hapus */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-500 rounded-lg transition-all duration-150 cursor-pointer shadow-sm"
                          title="Edit Sertifikat"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleOpenDelete(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 rounded-lg transition-all duration-150 cursor-pointer shadow-sm"
                          title="Hapus Sertifikat"
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

        {/* Footer Info Tabel */}
        {!isLoading && certificates.length > 0 && (
          <div className="px-6 py-4 bg-zinc-950/50 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
            <span>Total: {certificates.length} sertifikat tersimpan di database</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Tersinkronisasi dengan Backend API & Cloudinary
            </span>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* MODAL 1: TAMBAH SERTIFIKAT BARU                      */}
      {/* ==================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate__animated animate__fadeIn animate__faster">
          <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto selection:bg-emerald-500/30 selection:text-emerald-300">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner shadow-emerald-500/20">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Tambah Sertifikat Baru</h3>
                  <p className="text-xs text-zinc-400">Data dan bukti sertifikat akan disimpan ke database & Cloudinary</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetCreateForm();
                }}
                disabled={isSubmitting}
                className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Judul Sertifikat */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Judul / Nama Sertifikat <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="Contoh: Belajar Fundamental Aplikasi Web dengan React"
                  required
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                />
              </div>

              {/* Penerbit */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Penerbit / Lembaga <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={createForm.issued_by}
                    onChange={(e) => setCreateForm({ ...createForm, issued_by: e.target.value })}
                    placeholder="Contoh: Dicoding Indonesia, Coursera, Google"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Tanggal Terbit */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Tanggal Terbit <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={createForm.issue_date}
                    onChange={(e) => setCreateForm({ ...createForm, issue_date: e.target.value })}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Upload Gambar */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Unggah Gambar Sertifikat (Maks. 2MB)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-zinc-700/80 hover:border-emerald-500/50 rounded-xl cursor-pointer hover:bg-zinc-800/40 transition-colors group">
                    <Upload className="w-6 h-6 text-zinc-400 group-hover:text-emerald-400 mb-1.5 transition-colors" />
                    <span className="text-xs text-zinc-300 font-medium">Klik untuk memilih berkas gambar</span>
                    <span className="text-[11px] text-zinc-500 mt-0.5">JPG, JPEG, PNG, atau WEBP</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={handleCreateImageChange}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                  </label>

                  {createImagePreview && (
                    <div className="relative w-24 h-20 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 flex-shrink-0 shadow-md">
                      <img 
                        src={createImagePreview} 
                        alt="Preview Sertifikat" 
                        className="w-full h-full object-cover" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCreateImagePreview(null);
                          setCreateForm((prev) => ({ ...prev, imageFile: null }));
                        }}
                        disabled={isSubmitting}
                        className="absolute top-1 right-1 bg-black/80 hover:bg-black text-white p-1 rounded-full transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-zinc-800 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetCreateForm();
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-950/60 hover:shadow-emerald-900/40 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan ke Database</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: EDIT SERTIFIKAT                             */}
      {/* ==================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate__animated animate__fadeIn animate__faster">
          <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto selection:bg-emerald-500/30 selection:text-emerald-300">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner shadow-emerald-500/20">
                  <Edit3 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Edit Sertifikat</h3>
                  <p className="text-xs text-zinc-400">Perbarui data sertifikat di backend database</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSubmitting}
                className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Judul / Nama Sertifikat <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Penerbit / Lembaga <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={editForm.issued_by}
                    onChange={(e) => setEditForm({ ...editForm, issued_by: e.target.value })}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Tanggal Terbit <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={editForm.issue_date}
                    onChange={(e) => setEditForm({ ...editForm, issue_date: e.target.value })}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Ganti Gambar Sertifikat (Opsional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-zinc-700/80 hover:border-emerald-500/50 rounded-xl cursor-pointer hover:bg-zinc-800/40 transition-colors group">
                    <Upload className="w-6 h-6 text-zinc-400 group-hover:text-emerald-400 mb-1.5 transition-colors" />
                    <span className="text-xs text-zinc-300 font-medium">Pilih berkas baru jika ingin mengganti</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={handleEditImageChange}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                  </label>

                  {editImagePreview && (
                    <div className="relative w-24 h-20 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 flex-shrink-0 shadow-md">
                      <img 
                        src={editImagePreview} 
                        alt="Preview Sertifikat" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-zinc-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-950/60 hover:shadow-emerald-900/40 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Perbarui Data</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 3: KONFIRMASI HAPUS SERTIFIKAT                 */}
      {/* ==================================================== */}
      {isDeleteModalOpen && certToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate__animated animate__fadeIn animate__faster">
          <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative text-center selection:bg-red-500/30 selection:text-red-300">
            
            <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-800/60 flex items-center justify-center mx-auto mb-4 text-red-400 shadow-lg shadow-red-950/50">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">Hapus Sertifikat?</h3>
            <p className="text-sm text-zinc-400 mt-2 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus sertifikat <span className="text-white font-semibold">"{certToDelete.title}"</span>? Data akan dihapus secara permanen dari server.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCertToDelete(null);
                }}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-950/60 hover:shadow-red-900/50 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
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

