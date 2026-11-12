import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Upload,
  Calendar,
  FolderOpen
} from "lucide-react";
import { 
  getAdminArticles, 
  getCategories, 
  createArticle, 
  updateArticle, 
  deleteArticle 
} from "../../api/articles";

export default function ArticleManager() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState({ type: null, message: "" });

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);

  // Form States (Create)
  const [createData, setCreateData] = useState({
    judul: "",
    konten: "",
    category_id: "",
    gambar_sampul: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States (Edit)
  const [editData, setEditData] = useState({
    judul: "",
    konten: "",
  });

  // Load Data
  const loadData = async (query = "") => {
    try {
      setIsLoading(true);
      const [artRes, catRes] = await Promise.all([
        getAdminArticles(query),
        getCategories().catch(() => ({ data: [] })),
      ]);

      const items = artRes?.data?.data ? artRes.data.data : (artRes?.data || []);
      setArticles(items);

      const cats = catRes?.data || [];
      setCategories(cats);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Gagal memuat data artikel dari server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFeedback({ type: "error", message: "Ukuran gambar maksimal adalah 2MB." });
        return;
      }
      setCreateData((prev) => ({ ...prev, gambar_sampul: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit Create Article
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createData.judul || !createData.konten) {
      setFeedback({ type: "error", message: "Judul dan konten wajib diisi." });
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback({ type: null, message: "" });

      const formData = new FormData();
      formData.append("judul", createData.judul);
      formData.append("konten", createData.konten);
      if (createData.category_id) {
        formData.append("category_id", createData.category_id);
      }
      if (createData.gambar_sampul) {
        formData.append("gambar_sampul", createData.gambar_sampul);
      }

      await createArticle(formData);

      setFeedback({ type: "success", message: "Artikel berhasil ditambahkan!" });
      setIsCreateOpen(false);
      setCreateData({ judul: "", konten: "", category_id: "", gambar_sampul: null });
      setImagePreview(null);
      await loadData();
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Gagal membuat artikel." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (article) => {
    setActiveArticle(article);
    setEditData({
      judul: article.judul_artikel || "",
      konten: article.isi_konten || "",
    });
    setIsEditOpen(true);
  };

  // Submit Edit Article
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData.judul || !editData.konten) {
      setFeedback({ type: "error", message: "Judul dan konten wajib diisi." });
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback({ type: null, message: "" });

      await updateArticle(activeArticle.id_artikel, editData);

      setFeedback({ type: "success", message: "Artikel berhasil diperbarui!" });
      setIsEditOpen(false);
      setActiveArticle(null);
      await loadData();
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Gagal memperbarui artikel." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (article) => {
    setActiveArticle(article);
    setIsDeleteOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);
      setFeedback({ type: null, message: "" });

      await deleteArticle(activeArticle.id_artikel);

      setFeedback({ type: "success", message: "Artikel berhasil dihapus." });
      setIsDeleteOpen(false);
      setActiveArticle(null);
      await loadData();
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Gagal menghapus artikel." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {feedback.message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between border ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
              : "bg-red-950/40 border-red-800/60 text-red-300"
          }`}
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
            className="text-zinc-400 hover:text-zinc-200 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Bar: Search & Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan judul atau konten..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={() => {
            setFeedback({ type: null, message: "" });
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Artikel</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
            <p className="text-sm">Memuat data artikel...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mx-auto mb-3 text-zinc-500">
              <FolderOpen className="w-7 h-7" />
            </div>
            <h4 className="text-base font-semibold text-zinc-300">Belum ada artikel</h4>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `Tidak ditemukan artikel dengan kata kunci "${searchQuery}".`
                : "Klik tombol Tambah Artikel di atas untuk mulai membuat artikel pertama Anda."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950/70 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-400">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Sampul</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Judul & Konten</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Kategori</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Dibuat Pada</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {articles.map((item) => (
                  <tr key={item.id_artikel} className="hover:bg-zinc-800/30 transition-colors">
                    {/* Thumbnail */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700/60 flex items-center justify-center">
                        {item.gambar_sampul ? (
                          <img
                            src={item.gambar_sampul}
                            alt={item.judul_artikel}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-zinc-600" />
                        )}
                      </div>
                    </td>

                    {/* Judul & Cuplikan Konten */}
                    <td className="px-6 py-4 max-w-xs md:max-w-md">
                      <p className="font-semibold text-white truncate">{item.judul_artikel}</p>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{item.isi_konten}</p>
                    </td>

                    {/* Kategori Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.kategori || "Tanpa Kategori"}
                      </span>
                    </td>

                    {/* Tanggal */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{item.dibuat_pada || "-"}</span>
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit Artikel"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(item)}
                          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================= */}
      {/* MODAL 1: TAMBAH ARTIKEL */}
      {/* ========================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate__animated animate__fadeIn animate__faster">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">Tambah Artikel Baru</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                disabled={isSubmitting}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Judul */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  value={createData.judul}
                  onChange={(e) => setCreateData({ ...createData, judul: e.target.value })}
                  placeholder="Contoh: Belajar REST API dengan Laravel & React"
                  required
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                />
              </div>

              {/* Kategori Dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Kategori
                </label>
                <select
                  value={createData.category_id}
                  onChange={(e) => setCreateData({ ...createData, category_id: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                >
                  <option value="">Pilih Kategori (Opsional)</option>
                  {categories.map((cat) => (
                    <option key={cat.id_kategori} value={cat.id_kategori}>
                      {cat.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>

              {/* Konten Textarea */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Isi Konten *
                </label>
                <textarea
                  rows={5}
                  value={createData.konten}
                  onChange={(e) => setCreateData({ ...createData, konten: e.target.value })}
                  placeholder="Tuliskan isi artikel atau deskripsi proyek di sini..."
                  required
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                />
              </div>

              {/* Unggah Gambar Sampul */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Gambar Sampul (Maks. 2MB)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-zinc-700 rounded-xl cursor-pointer hover:bg-zinc-800/40 transition-colors">
                    <Upload className="w-6 h-6 text-emerald-400 mb-1" />
                    <span className="text-xs text-zinc-400">Pilih file gambar (JPG, PNG, WEBP)</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                  </label>

                  {imagePreview && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-zinc-700 flex-shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setCreateData({ ...createData, gambar_sampul: null });
                        }}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-1 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <span>Simpan Artikel</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL 2: EDIT ARTIKEL */}
      {/* ========================================= */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate__animated animate__fadeIn animate__faster">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">Edit Artikel</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                disabled={isSubmitting}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  value={editData.judul}
                  onChange={(e) => setEditData({ ...editData, judul: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Isi Konten *
                </label>
                <textarea
                  rows={6}
                  value={editData.konten}
                  onChange={(e) => setEditData({ ...editData, konten: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Perbarui Artikel</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL 3: KONFIRMASI HAPUS */}
      {/* ========================================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate__animated animate__fadeIn animate__faster">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-800/60 flex items-center justify-center mx-auto mb-4 text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Hapus Artikel?</h3>
            <p className="text-sm text-zinc-400 mt-2 mb-6">
              Apakah Anda yakin ingin menghapus artikel <span className="text-white font-semibold">"{activeArticle?.judul_artikel}"</span>? Tindakan ini bersifat permanen.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-red-950/50 transition-all disabled:opacity-50 cursor-pointer"
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

