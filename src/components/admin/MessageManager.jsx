import { useState, useEffect } from "react";
import { 
  Mail, 
  Search, 
  Trash2, 
  Eye, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Loader2, 
  Calendar, 
  User, 
  Inbox, 
  ExternalLink, 
  MessageSquare,
  Send,
  Clock,
  AlertTriangle
} from "lucide-react";
import { fetchMessages, deleteMessage } from "../../api/messages";

export default function MessageManager() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");

  // Alert notifikasi realtime (Sukses / Gagal)
  const [feedback, setFeedback] = useState({ type: null, message: "" });

  // State Modal Detail Pesan
  const [selectedMessage, setSelectedMessage] = useState(null);

  // State Modal Konfirmasi Hapus
  const [messageToDelete, setMessageToDelete] = useState(null);

  const showAlert = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: null, message: "" }), 5000);
  };

  // Mengambil daftar pesan dari backend
  const loadMessages = async (searchQuery = "") => {
    try {
      setIsLoading(true);
      const res = await fetchMessages(searchQuery);
      setMessages(res?.data || []);
    } catch (err) {
      showAlert("error", err.message || "Gagal memuat pesan masuk dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadMessages(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Hapus pesan
  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;
    try {
      setIsDeleting(true);
      await deleteMessage(messageToDelete.id);
      showAlert("success", `Pesan dari "${messageToDelete.name}" berhasil dihapus.`);
      setMessageToDelete(null);
      if (selectedMessage?.id === messageToDelete.id) {
        setSelectedMessage(null);
      }
      await loadMessages(search);
    } catch (err) {
      showAlert("error", err.message || "Gagal menghapus pesan.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Notifikasi */}
      {feedback.type && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between shadow-lg ${
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

      {/* Bar Atas: Pencarian & Refresh */}
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
            placeholder="Cari nama, email, subjek, atau pesan..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 flex items-center gap-2">
            <Inbox className="w-4 h-4 text-emerald-400" />
            <span>Total: {messages.length} Pesan</span>
          </div>

          <button
            onClick={() => loadMessages(search)}
            disabled={isLoading}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Muat ulang pesan dari server"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Tabel Pesan Masuk */}
      <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
            <p className="text-sm font-medium">Memuat pesan masuk dari database...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/70 border border-zinc-700/50 flex items-center justify-center mx-auto mb-4 text-zinc-500">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              {search ? "Pesan tidak ditemukan" : "Kotak Masuk Masih Kosong"}
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {search 
                ? `Tidak ada pesan yang cocok dengan kata kunci "${search}".`
                : "Belum ada pesan yang dikirim oleh pengunjung melalui formulir kontak publik."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 text-xs uppercase font-mono tracking-wider">
                  <th className="px-6 py-4">Pengirim</th>
                  <th className="px-6 py-4">Subjek</th>
                  <th className="px-6 py-4">Isi Pesan</th>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-sm">
                {messages.map((item) => {
                  const initial = (item.name ? item.name.charAt(0) : "U").toUpperCase();
                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-zinc-800/30 transition-colors group"
                    >
                      {/* Pengirim */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600/30 to-indigo-600/20 border border-violet-500/40 flex items-center justify-center font-bold text-violet-300 text-sm flex-shrink-0">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                              {item.name}
                            </p>
                            <a
                              href={`mailto:${item.email}`}
                              className="text-xs text-zinc-400 hover:text-emerald-300 transition-colors flex items-center gap-1 mt-0.5"
                              title="Kirim email balasan"
                            >
                              <span>{item.email}</span>
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Subjek */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-200 font-medium max-w-[200px] truncate">
                          {item.subject || "Tanpa Subjek"}
                        </span>
                      </td>

                      {/* Cuplikan Pesan */}
                      <td className="px-6 py-4">
                        <p className="text-zinc-300 text-xs line-clamp-2 max-w-xs sm:max-w-md leading-relaxed">
                          {item.message}
                        </p>
                      </td>

                      {/* Tanggal */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-400 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </td>

                      {/* Tombol Aksi */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedMessage(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-500 rounded-lg transition-all duration-150 cursor-pointer shadow-sm"
                            title="Baca Detail Pesan"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Baca</span>
                          </button>

                          <button
                            onClick={() => setMessageToDelete(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 rounded-lg transition-all duration-150 cursor-pointer shadow-sm"
                            title="Hapus Pesan"
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
        {!isLoading && messages.length > 0 && (
          <div className="px-6 py-4 bg-zinc-950/50 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
            <span>Menampilkan {messages.length} pesan masuk</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Tersinkronisasi dengan Database Laravel
            </span>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* MODAL 1: BACA DETAIL PESAN MASUK                     */}
      {/* ==================================================== */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate__animated animate__fadeIn animate__faster"
          data-lenis-prevent
        >
          <div
            className="bg-zinc-900 border border-zinc-800/90 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto selection:bg-emerald-500/30 selection:text-emerald-300"
            data-lenis-prevent
          >
            
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shadow-inner shadow-violet-500/20">
                  <Mail className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Detail Pesan Masuk</h3>
                  <p className="text-xs text-zinc-400">Diterima pada {formatDate(selectedMessage.created_at)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Pengirim */}
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-md flex-shrink-0">
                    {(selectedMessage.name ? selectedMessage.name.charAt(0) : "U").toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white leading-tight">{selectedMessage.name}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{selectedMessage.email}</p>
                  </div>
                </div>

                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    selectedMessage.subject ? `Re: ${selectedMessage.subject}` : "Balasan Pesan Portofolio"
                  )}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-md shadow-violet-950 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Balas Email</span>
                </a>
              </div>

              {/* Subjek */}
              <div>
                <label className="block text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  Subjek Pesan
                </label>
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-semibold text-white">
                  {selectedMessage.subject || "Tanpa Subjek"}
                </div>
              </div>

              {/* Isi Pesan Lengkap */}
              <div>
                <label className="block text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  Isi Pesan
                </label>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap min-h-[140px] max-h-[300px] overflow-y-auto font-sans">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center justify-between pt-5 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setMessageToDelete(selectedMessage);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-400 hover:text-white bg-red-950/40 hover:bg-red-600 border border-red-800/60 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Pesan Ini</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: KONFIRMASI HAPUS PESAN                      */}
      {/* ==================================================== */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate__animated animate__fadeIn animate__faster">
          <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative text-center">
            
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 shadow-inner shadow-red-500/10">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight mb-2">Hapus Pesan Masuk?</h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus pesan dari <span className="text-white font-semibold">"{messageToDelete.name}"</span>? Pesan yang sudah dihapus tidak dapat dipulihkan kembali.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setMessageToDelete(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg shadow-red-950/60 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Pesan</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

