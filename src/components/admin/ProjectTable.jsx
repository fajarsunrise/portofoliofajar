import { useState, useEffect } from "react";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Search, 
  ExternalLink, 
  X, 
  Layers, 
  FolderGit2, 
  Upload, 
  Globe, 
  Tag as TagIcon, 
  AlertTriangle,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Calendar
} from "lucide-react";
import { 
  fetchProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from "../../api/projects";

export default function ProjectTable() {
  // State data utama dari database (tanpa dummy data)
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  
  // Alert notifikasi realtime (Sukses / Gagal)
  const [feedback, setFeedback] = useState({ type: null, message: "" });

  // State Modal Tambah Projek
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    technologies: "",
    demo_link: "",
    imageFile: null,
  });
  const [createImagePreview, setCreateImagePreview] = useState(null);

  // State Modal Edit Projek
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    title: "",
    description: "",
    technologies: "",
    demo_link: "",
    imageFile: null,
    existingImage: "",
  });
  const [editImagePreview, setEditImagePreview] = useState(null);

  // State Modal Konfirmasi Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Error spesifik di dalam modal
  const [modalError, setModalError] = useState("");

  const showAlert = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: null, message: "" }), 5000);
  };

  // ========================================================
  // 1. READ: Ambil Data Riil dari Backend (GET /api/projects)
  // ========================================================
  const loadProjects = async (searchQuery = "") => {
    try {
      setIsLoading(true);
      const res = await fetchProjects(searchQuery);
      
      const items = res?.data || [];
      setProjects(items);
    } catch (err) {
      showAlert("error", err.message || "Gagal memuat data projek dari backend API.");
    } finally {
      setIsLoading(false);
    }
  };

  // Panggil loadProjects saat komponen pertama kali dimuat
  useEffect(() => {
    loadProjects();
  }, []);

  // Pencarian realtime dengan debounce (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProjects(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ========================================================
  // 2. CREATE: Simpan Projek Baru ke Backend (POST /api/projects)
  // ========================================================
  const handleCreateImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setModalError("Ukuran gambar maksimal adalah 2MB.");
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
      description: "",
      technologies: "",
      demo_link: "",
      imageFile: null,
    });
    setCreateImagePreview(null);
    setModalError("");
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!createForm.title || !createForm.description) {
      setModalError("Judul dan deskripsi projek wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Gunakan FormData untuk mengirim teks dan file gambar
      const formData = new FormData();
      formData.append("title", createForm.title);
      formData.append("description", createForm.description);
      formData.append("technologies", createForm.technologies);
      if (createForm.demo_link) {
        formData.append("demo_link", createForm.demo_link);
      }
      if (createForm.imageFile) {
        formData.append("image", createForm.imageFile);
      }

      await createProject(formData);

      // Tutup modal, reset form, beri notifikasi, dan refresh tabel secara otomatis
      setIsAddModalOpen(false);
      resetCreateForm();
      showAlert("success", `Projek "${createForm.title}" berhasil disimpan ke database!`);
      await loadProjects();
    } catch (err) {
      setModalError(err.message || "Gagal membuat projek baru.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================================
  // 3. UPDATE: Perbarui Data Projek (POST + _method=PUT)
  // ========================================================
  const handleOpenEdit = (project) => {
    const techString = Array.isArray(project.technologies) 
      ? project.technologies.join(", ") 
      : (project.technologies || "");

    setEditForm({
      id: project.id,
      title: project.title || "",
      description: project.description || "",
      technologies: techString,
      demo_link: project.demo_link || "",
      imageFile: null,
      existingImage: project.image_url || "",
    });
    setEditImagePreview(project.image_url || null);
    setModalError("");
    setIsEditModalOpen(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setModalError("Ukuran gambar maksimal adalah 2MB.");
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

    if (!editForm.title || !editForm.description) {
      setModalError("Judul dan deskripsi projek wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Di Laravel, request multipart/form-data update dikirim via POST dengan _method=PUT
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      formData.append("technologies", editForm.technologies);
      if (editForm.demo_link) {
        formData.append("demo_link", editForm.demo_link);
      }
      if (editForm.imageFile) {
        formData.append("image", editForm.imageFile);
      }

      await updateProject(editForm.id, formData);

      // Tutup modal, beri notifikasi, dan refresh tabel secara otomatis
      setIsEditModalOpen(false);
      showAlert("success", `Projek "${editForm.title}" berhasil diperbarui!`);
      await loadProjects();
    } catch (err) {
      setModalError(err.message || "Gagal memperbarui projek.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================================
  // 4. DELETE: Hapus Projek dari Backend (DELETE /api/projects/{id})
  // ========================================================
  const handleOpenDelete = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      setIsSubmitting(true);
      await deleteProject(projectToDelete.id);

      // Tutup modal, beri notifikasi, dan refresh tabel secara otomatis
      setIsDeleteModalOpen(false);
      showAlert("success", `Projek "${projectToDelete.title}" berhasil dihapus dari database.`);
      setProjectToDelete(null);
      await loadProjects();
    } catch (err) {
      showAlert("error", err.message || "Gagal menghapus projek dari server.");
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

      {/* Bar Atas: Pencarian, Refresh, & Tombol 'Tambah Projek Baru' */}
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
            placeholder="Cari judul projek di database..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadProjects(search)}
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
            <span>Tambah Projek Baru</span>
          </button>
        </div>
      </div>

      {/* Tabel Data Projek */}
      <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
            <p className="text-sm font-medium">Menghubungkan ke API Laravel & memuat data projek...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mx-auto mb-3 text-zinc-500">
              <FolderGit2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-semibold text-zinc-300">Belum ada projek di database</h4>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
              {search
                ? `Tidak ditemukan projek dengan kata kunci "${search}".`
                : "Klik tombol 'Tambah Projek Baru' di atas untuk menyimpan data projek pertama Anda."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold w-28">Gambar</th>
                  <th scope="col" className="px-6 py-4 font-semibold min-w-[240px]">Judul Projek</th>
                  <th scope="col" className="px-6 py-4 font-semibold min-w-[200px]">Teknologi</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {projects.map((item) => {
                  const techList = Array.isArray(item.technologies)
                    ? item.technologies
                    : (item.technologies ? item.technologies.split(",") : []);

                  return (
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
                                e.target.src = "https://placehold.co/120x80/1a1a1a/FFF?text=Projek";
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-zinc-600" />
                          )}
                        </div>
                      </td>

                      {/* Kolom 2: Judul Projek & Deskripsi */}
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white text-base group-hover:text-emerald-400 transition-colors">
                              {item.title}
                            </h4>
                            {item.demo_link && (
                              <a 
                                href={item.demo_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-zinc-500 hover:text-emerald-400 transition-colors"
                                title="Buka Link Demo / Github"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                          {item.created_at && (
                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-1.5">
                              <Calendar className="w-3 h-3 text-zinc-600" />
                              <span>{new Date(item.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Kolom 3: Tag Teknologi */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {techList.length > 0 ? (
                            techList.map((tech, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/80 group-hover:border-zinc-600 transition-colors"
                              >
                                {tech.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-zinc-500 italic">-</span>
                          )}
                        </div>
                      </td>

                      {/* Kolom 4: Aksi Edit & Hapus */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-500 rounded-lg transition-all duration-150 cursor-pointer shadow-sm"
                            title="Edit Projek"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleOpenDelete(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 rounded-lg transition-all duration-150 cursor-pointer shadow-sm"
                            title="Hapus Projek"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Info Tabel */}
        {!isLoading && projects.length > 0 && (
          <div className="px-6 py-4 bg-zinc-950/50 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
            <span>Total: {projects.length} projek terdaftar di database</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Terhubung Live ke API Backend Laravel
            </span>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* MODAL 1: TAMBAH PROJEK BARU (POST /api/projects)     */}
      {/* ==================================================== */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate__animated animate__fadeIn animate__faster"
          data-lenis-prevent
        >
          <div
            className="bg-zinc-900 border border-zinc-800/90 rounded-2xl w-full max-w-xl max-h-[85vh] sm:max-h-[90vh] shadow-2xl relative flex flex-col overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300"
            data-lenis-prevent
          >
            
            {/* Header Modal - Tetap di Atas */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-zinc-800 flex-shrink-0 bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner shadow-emerald-500/20 flex-shrink-0">
                  <Layers className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Tambah Projek Baru</h3>
                  <p className="text-xs text-zinc-400">Data dan gambar akan otomatis disimpan ke database & Cloudinary</p>
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
                title="Tutup Form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Input & Bagian yang Dapat Digulir (Scrollable) */}
            <form
              id="create-project-form"
              onSubmit={handleCreateSubmit}
              className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain"
              data-lenis-prevent
            >
              {/* Modal Error Alert */}
              {modalError && (
                <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-red-300 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                  <span>{modalError}</span>
                </div>
              )}
              
              {/* Judul Projek (title) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Judul Projek <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    placeholder="Contoh: AIS Detection Mobile App"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Deskripsi Projek (description) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Deskripsi Projek <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Jelaskan fitur utama, latar belakang, dan arsitektur projek..."
                  required
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                />
              </div>

              {/* Teknologi (technologies) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Teknologi (Pisahkan dengan koma)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <TagIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={createForm.technologies}
                    onChange={(e) => setCreateForm({ ...createForm, technologies: e.target.value })}
                    placeholder="Contoh: React.js, Tailwind CSS, Laravel, PostgreSQL"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Link Demo / Github (demo_link) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Link Demo / Github
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={createForm.demo_link}
                    onChange={(e) => setCreateForm({ ...createForm, demo_link: e.target.value })}
                    placeholder="https://github.com/username/project atau https://demo-project.com"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Upload Gambar (image) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Upload Gambar Sampul (Maks. 2MB)
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
                        alt="Preview Projek" 
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
                        title="Hapus gambar"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>

            {/* Tombol Aksi - Tetap di Bawah (Sticky Footer) */}
            <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900/95 flex-shrink-0">
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
                form="create-project-form"
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
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: EDIT PROJEK (POST /api/projects/{id} + PUT) */}
      {/* ==================================================== */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate__animated animate__fadeIn animate__faster"
          data-lenis-prevent
        >
          <div
            className="bg-zinc-900 border border-zinc-800/90 rounded-2xl w-full max-w-xl max-h-[85vh] sm:max-h-[90vh] shadow-2xl relative flex flex-col overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300"
            data-lenis-prevent
          >
            
            {/* Header Modal - Tetap di Atas */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-zinc-800 flex-shrink-0 bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner shadow-emerald-500/20">
                  <Edit3 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Edit Projek</h3>
                  <p className="text-xs text-zinc-400">Perbarui data projek di backend database</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSubmitting}
                className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors"
                title="Tutup Form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Error Alert */}
            {modalError && (
              <div className="mb-4 p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Form Input Edit & Bagian yang Dapat Digulir */}
            <form
              id="edit-project-form"
              onSubmit={handleEditSubmit}
              className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain"
              data-lenis-prevent
            >
              
              {/* Judul Projek */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Judul Projek <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Deskripsi Projek <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                />
              </div>

              {/* Teknologi */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Teknologi (Pisahkan dengan koma)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <TagIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={editForm.technologies}
                    onChange={(e) => setEditForm({ ...editForm, technologies: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Link Demo / Github */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Link Demo / Github
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={editForm.demo_link}
                    onChange={(e) => setEditForm({ ...editForm, demo_link: e.target.value })}
                    placeholder="https://github.com/..."
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Upload Gambar Baru (Opsional) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Ganti Gambar Sampul (Opsional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-zinc-700/80 hover:border-emerald-500/50 rounded-xl cursor-pointer hover:bg-zinc-800/40 transition-colors group">
                    <Upload className="w-6 h-6 text-zinc-400 group-hover:text-emerald-400 mb-1.5 transition-colors" />
                    <span className="text-xs text-zinc-300 font-medium">Klik jika ingin mengganti gambar</span>
                    <span className="text-[11px] text-zinc-500 mt-0.5">Biarkan kosong jika tidak ingin mengubah gambar</span>
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
                        alt="Preview Projek" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                </div>
              </div>

            </form>

            {/* Tombol Aksi - Tetap di Bawah (Sticky Footer) */}
            <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900/95 flex-shrink-0">
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
                form="edit-project-form"
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
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 3: KONFIRMASI HAPUS (DELETE /api/projects/{id}) */}
      {/* ==================================================== */}
      {isDeleteModalOpen && projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate__animated animate__fadeIn animate__faster">
          <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative text-center selection:bg-red-500/30 selection:text-red-300">
            
            {/* Ikon Warning */}
            <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-800/60 flex items-center justify-center mx-auto mb-4 text-red-400 shadow-lg shadow-red-950/50">
              <AlertTriangle className="w-7 h-7" />
            </div>

            {/* Judul & Pesan */}
            <h3 className="text-lg font-bold text-white tracking-tight">Hapus Projek?</h3>
            <p className="text-sm text-zinc-400 mt-2 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus projek <span className="text-white font-semibold">"{projectToDelete.title}"</span>? Data akan dihapus secara permanen dari database.
            </p>

            {/* Tombol Aksi */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProjectToDelete(null);
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
