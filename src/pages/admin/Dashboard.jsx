import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, 
  FolderGit2, 
  Award, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ShieldCheck,
  FileCheck,
  Wrench,
  Sparkles,
  Mail
} from "lucide-react";
import ProjectTable from "../../components/admin/ProjectTable";
import CertificateTable from "../../components/admin/CertificateTable";
import AboutManager from "../../components/admin/AboutManager";
import ToolTable from "../../components/admin/ToolTable";
import HeroManager from "../../components/admin/HeroManager";
import MessageManager from "../../components/admin/MessageManager";

export default function AdminDashboard() {
  const navigate = useNavigate();
  // 1. Projek menjadi menu aktif secara default saat pertama kali Dashboard dibuka
  const [activeMenu, setActiveMenu] = useState("projek");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 2. Proteksi rute: Cek keberadaan token di localStorage saat pertama kali dimuat
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  // Menu Utama CMS Portofolio: Hero Section, About, Projek, Sertifikat, Tools, dan Pesan Masuk
  const menuItems = [
    { id: "hero", label: "Hero Section", icon: Sparkles },
    { id: "about", label: "About", icon: User },
    { id: "projek", label: "Projek", icon: FolderGit2 },
    { id: "sertifikat", label: "Sertifikat", icon: Award },
    { id: "tools", label: "Tools", icon: Wrench },
    { id: "pesan", label: "Pesan Masuk", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-semibold text-white tracking-wide">CMS Portofolio</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Navigasi */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-zinc-900/90 md:bg-zinc-900 border-r border-zinc-800/80 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="hidden md:flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/25 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shadow-inner shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white tracking-tight leading-none">Admin Panel</h2>
              <p className="text-[11px] text-zinc-400 mt-1">CMS Portofolio</p>
            </div>
          </div>

          {/* 3 Menu Utama: About, Projek, Sertifikat */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Menu Utama
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-sm shadow-emerald-950 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bawah Sidebar: Lihat Portofolio & Logout */}
        <div className="space-y-2 pt-4 border-t border-zinc-800">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              <span>Lihat Portofolio</span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent hover:border-red-900/40 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <main className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight capitalize">
              Manajemen {activeMenu}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              {activeMenu === "hero" && "Kelola teks salam pembuka, deskripsi hero, teks marquee, dan gambar beranda."}
              {activeMenu === "projek" && "Kelola daftar portofolio projek dan teknologi yang ditampilkan."}
              {activeMenu === "about" && "Kelola informasi profil, bio, kontak, dan riwayat pengalaman karier."}
              {activeMenu === "sertifikat" && "Kelola sertifikat, penerbit, dan bukti kualifikasi profesional."}
              {activeMenu === "tools" && "Kelola daftar software, framework, dan teknologi yang Anda kuasai."}
              {activeMenu === "pesan" && "Baca dan kelola seluruh pesan masuk dari pengunjung melalui formulir kontak publik."}
            </p>
          </div>
        </header>

        {/* Render Konten Berdasarkan Menu yang Dipilih */}
        {activeMenu === "hero" && <HeroManager />}

        {activeMenu === "projek" && <ProjectTable />}

        {activeMenu === "about" && <AboutManager />}

        {activeMenu === "sertifikat" && <CertificateTable />}

        {activeMenu === "tools" && <ToolTable />}

        {activeMenu === "pesan" && <MessageManager />}
      </main>

    </div>
  );
}
