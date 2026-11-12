import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Wrench,
  Layers
} from "lucide-react";
import { 
  fetchTools, 
  createTool, 
  updateTool, 
  deleteTool 
} from "../../api/tools";

export default function ToolTable() {
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  // Alert State
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form States
  const [createForm, setCreateForm] = useState({
    name: "",
    iconFile: null,
  });
  const [createImagePreview, setCreateImagePreview] = useState(null);

  const [editForm, setEditForm] = useState({
    id: null,
    name: "",
    iconFile: null,
    existingIcon: "",
  });
  const [editImagePreview, setEditImagePreview] = useState(null);

  const [toolToDelete, setToolToDelete] = useState(null);
  const [modalError, setModalError] = useState("");

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 4500);
  };

  // 1. READ: Ambil data tools dari API
  const loadTools = async (keyword = "") => {
    try {
      setIsLoading(true);
      const res = await fetchTools(keyword);
      if (res && res.data) {
        setTools(Array.isArray(res.data) ? res.data : []);
      } else {
        setTools([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data tools:", err);
      showAlert("error", err.message || "Gagal memuat data tools dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadTools(search);
  };

  // 2. CREATE: Tambah Tool Baru
  const handleCreateImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setModalError("Ukuran file ikon maksimal adalah 2MB.");
        return;
      }
      setModalError("");
      setCreateForm((prev) => ({ ...prev, iconFile: file }));
      setCreateImagePreview(URL.createObjectURL(file));
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      name: "",
      iconFile: null,
    });
    setCreateImagePreview(null);
    setModalError("");
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!createForm.name.trim()) {
      setModalError("Nama tool atau teknologi wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", createForm.name.trim());
      if (createForm.iconFile) {
        formData.append("icon", createForm.iconFile);
      }

      await createTool(formData);

      setIsAddModalOpen(false);
      resetCreateForm();
      showAlert("success", `Tool "${createForm.name}" berhasil ditambahkan!`);
      await loadTools(search);
    } catch (err) {
      setModalError(err.message || "Gagal membuat tool baru.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. UPDATE: Edit Tool
  const handleOpenEdit = (item) => {
    setEditForm({
      id: item.id,
      name: item.name || "",
      iconFile: null,
      existingIcon: item.icon_url || "",
    });
    setEditImagePreview(item.icon_url || null);
    setModalError("");
    setIsEditModalOpen(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setModalError("Ukuran file ikon maksimal adalah 2MB.");
        return;
      }
      setModalError("");
      setEditForm((prev) => ({ ...prev, iconFile: file }));
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!editForm.name.trim()) {
      setModalError("Nama tool tidak boleh kosong.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", editForm.name.trim());
      if (editForm.iconFile) {
        formData.append("icon", editForm.iconFile);
      }

      await updateTool(editForm.id, formData);

      setIsEditModalOpen(false);
      showAlert("success", `Tool "${editForm.name}" berhasil diperbarui!`);
      await loadTools(search);
    } catch (err) {
      setModalError(err.message || "Gagal memperbarui data tool.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. DELETE: Hapus Tool
  const handleOpenDelete = (item) => {
    setToolToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toolToDelete) return;

    try {
      setIsSubmitting(true);
      await deleteTool(toolToDelete.id);

      setIsDeleteModalOpen(false);
      showAlert("success", `Tool "${toolToDelete.name}" berhasil dihapus.`);
      setToolToDelete(null);
      await loadTools(search);
    } catch (err) {
      showAlert("error", err.message || "Gagal menghapus tool.");
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

      {/* Control Bar: Pencarian & Tombol Tambah */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Form Pencarian */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari tool atau teknologi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </form>

        <div className="flex items-center gap-2">
          {/* Tombol Refresh */}
          <button
            onClick={() => loadTools(search)}
            disabled={isLoading}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Muat ulang data dari API"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
          </button>

          {/* Tombol Tambah Tool Baru */}
          <button
            onClick={() => {
              resetCreateForm();
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-950/60 hover:shadow-emerald-900/50 transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tool Baru</span>
          </button>
        </div>

      </div>

      {/* Container Tabel Tools */}
      <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
            <p className="text-sm text-zinc-400">Memuat data tools dari database...</p>
          </div>
        ) : tools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-center mb-3 text-zinc-500">
              <Wrench className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-base font-semibold text-zinc-200">Belum ada tool terdaftar</h3>
            <p className="text-sm text-zinc-500 max-w-sm mt-1 mb-5">
              {search 
                ? `Tidak ditemukan tool yang cocok dengan "${search}".` 
                : "Mulai tambahkan teknologi, framework, dan software yang Anda kuasai."}
            </p>
            <button
              onClick={() => {
                resetCreateForm();
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Tool Pertama</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold w-24">Ikon</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Nama Tool & Teknologi</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {tools.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-zinc-800/30 transition-colors group"
                  >
                    {/* Kolom 1: Ikon Tool */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 p-2 group-hover:border-zinc-700 transition-colors flex items-center justify-center shadow-inner">
                        {item.icon_url ? (
                          <img
                            src={item.icon_url}
                            alt={item.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/60x60/1a1a1a/FFF?text=Icon";
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-zinc-600" />
                        )}
                      </div>
                    </td>

                    {/* Kolom 2: Nama Tool */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-white text-base group-hover:text-emerald-400 transition-colors">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    {/* Kolom 3: Aksi Edit & Hapus */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-500 rounded-lg transition-all duration-150 cursor-pointer shadow-sm"
                          title="Edit Tool"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleOpenDelete(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 rounded-lg transition-all duration-150 cursor-pointer shadow-sm"
                          title="Hapus Tool"
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

        {/* Footer info jumlah data */}
        <div className="px-6 py-3.5 bg-zinc-950/60 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>Menampilkan {tools.length} tool</span>
          <span className="text-[11px] text-zinc-600">Disimpan di PostgreSQL & Cloudinary</span>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: TAMBAH TOOL BARU */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-white text-base">Tambah Tool Baru</h3>
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

              {/* Input Nama Tool */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Nama Tool / Framework <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: React JS, Docker, Figma"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              {/* Upload Ikon Tool */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Ikon / Logo Tool
                </label>

                <div className="flex items-center gap-4 p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {createImagePreview ? (
                      <img src={createImagePreview} alt="Preview" className="w-full h-full object-contain p-1" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <label
                      htmlFor="create_tool_icon"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 rounded-lg cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{createImagePreview ? "Ganti File Ikon" : "Pilih File Ikon"}</span>
                    </label>
                    <input
                      id="create_tool_icon"
                      type="file"
                      accept="image/*"
                      onChange={handleCreateImageChange}
                      className="hidden"
                    />
                    <p className="text-[11px] text-zinc-500">Mendukung SVG, PNG, WebP (Maks. 2MB)</p>
                  </div>
                </div>
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
                    <span>Simpan Tool</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT TOOL */}
      {/* ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-white text-base">Edit Tool</h3>
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

              {/* Input Nama Tool */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Nama Tool / Framework <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              {/* Upload Ikon Tool */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Ikon / Logo Tool
                </label>

                <div className="flex items-center gap-4 p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {editImagePreview ? (
                      <img src={editImagePreview} alt="Preview" className="w-full h-full object-contain p-1" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <label
                      htmlFor="edit_tool_icon"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 rounded-lg cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{editImagePreview ? "Ganti File Ikon" : "Pilih File Ikon"}</span>
                    </label>
                    <input
                      id="edit_tool_icon"
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                    <p className="text-[11px] text-zinc-500">Kosongkan jika tidak ingin mengubah ikon.</p>
                  </div>
                </div>
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
                      <span>Memperbarui...</span>
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
      {isDeleteModalOpen && toolToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Hapus Tool?</h4>
                <p className="text-xs text-zinc-400">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>

            <p className="text-sm text-zinc-300">
              Apakah Anda yakin ingin menghapus tool <strong className="text-white">"{toolToDelete.name}"</strong> dari portofolio?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setToolToDelete(null);
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

