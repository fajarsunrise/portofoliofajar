import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ShinyText from "../../components/ShinyText/ShinyText";
import Aurora from "../../components/Aurora/Aurora";
import AOS from "aos";
import "aos/dist/aos.css";
import { Mail, Send, User, MessageSquare, CheckCircle2, MapPin, Sparkles, MessageCircle, AlertCircle } from "lucide-react";
import { scrollToTarget } from "../../utils/scrollManager";
import { sendMessage } from "../../api/messages";

// Base URL API Backend Laravel
import { API_BASE_URL as CONFIG_API_BASE_URL } from "../../api/config";
const API_BASE_URL = CONFIG_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "https://api.portofoliofajar.my.id/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: null, message: "" });
  const [aboutData, setAboutData] = useState(null);

  // Scroll ke paling atas saat halaman dibuka
  useEffect(() => {
    window.scrollTo(0, 0);
    scrollToTarget(0, { immediate: true });
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  // Mengambil info kontak dinamis dari endpoint /about
  useEffect(() => {
    fetch(`${API_BASE_URL}/about`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data kontak");
        return res.json();
      })
      .then((resData) => {
        const data = resData?.data || resData;
        if (data) setAboutData(data);
      })
      .catch((err) => console.error("Error fetching contact info:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setNotification({
        type: "error",
        message: "Harap lengkapi semua bidang yang wajib diisi (Nama, Email, dan Pesan).",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setNotification({ type: null, message: "" });

      // Kirim pesan ke API backend Laravel (POST /api/messages)
      const res = await sendMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || undefined,
        message: formData.message.trim(),
      });

      // Kosongkan form setelah pesan berhasil terkirim
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setNotification({
        type: "success",
        message: res.message || "Pesan Anda berhasil dikirim! Terima kasih telah menghubungi saya.",
      });

      // Hilangkan notifikasi sukses setelah 7 detik
      setTimeout(() => {
        setNotification({ type: null, message: "" });
      }, 7000);
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Gagal mengirimkan pesan. Silakan periksa koneksi atau coba beberapa saat lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 1. Header Navigation */}
      <div className="container mx-auto px-4 sm:px-6 max-w-full">
        <Navbar />
      </div>

      {/* Aurora Ambient Background (Dark Theme dengan Aksen Cyan/Biru #127B99) */}
      <div className="absolute top-0 left-0 w-full h-[100vh] max-h-[960px] -z-10 overflow-hidden pointer-events-none">
        <Aurora
          colorStops={["#577870", "#1F97A6", "#127B99"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden pt-6 pb-24">
        {/* ======================================================== */}
        {/* HEADER SECTION: JUDUL & DESKRIPSI KONTAK                 */}
        {/* ======================================================== */}
        <section className="contact pt-8 pb-10 relative" id="contact">
          {/* Ambient Glow Aura */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[450px] bg-gradient-to-tr from-[#127B99]/20 via-violet-900/20 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

          <div
            className="text-center max-w-3xl mx-auto mb-14"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
          >
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/40 text-violet-300 text-xs font-mono font-semibold uppercase tracking-wider mb-4 shadow-sm shadow-violet-900/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get In Touch</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 font-extrabold text-white tracking-tight">
              <ShinyText text="Contact Me" speed={2.5} color="#717171" shineColor="#ffffff" />
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-zinc-400 max-w-2xl mx-auto">
              Have an ambitious project, a question, or simply want to connect? Send me a message and let's craft something exceptional together.
            </p>
          </div>

          {/* ======================================================== */}
          {/* CONTENT GRID: INFO KONTAK & FORMULIR PESAN              */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            {/* Kolom Kiri: Informasi Kontak & Status (5 Kolom di Layar Lebar) */}
            <div
              className="lg:col-span-5 space-y-6"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
              data-aos-once="true"
            >
              {/* Kartu Status Ketersediaan */}
              <div className="rounded-3xl border-2 border-violet-500/30 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#161616] p-6 sm:p-8 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-mono font-semibold tracking-wider uppercase text-emerald-400">
                    Open for Opportunities
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Let's create something extraordinary.
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  I am currently available for freelance commissions, software development contracts, and engineering collaborations.
                </p>
              </div>

              {/* Saluran Komunikasi Langsung */}
              <div className="rounded-3xl border-2 border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 space-y-5 shadow-xl">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                  Direct Inquiries
                </h4>

                {/* Email Item */}
                <div className="flex items-start gap-4 group">
                  <div className="p-3 rounded-2xl bg-violet-950/60 border border-violet-500/40 text-violet-400 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block font-mono">Email Address</span>
                    <a
                      href={`mailto:${aboutData?.contact_email || "contact@portfolio.com"}`}
                      className="text-sm sm:text-base font-semibold text-white hover:text-violet-300 transition-colors break-all"
                    >
                      {aboutData?.contact_email || "contact@portfolio.com"}
                    </a>
                  </div>
                </div>

                {/* WhatsApp Item */}
                <div className="flex items-start gap-4 group">
                  <div className="p-3 rounded-2xl bg-[#0e4453]/70 border border-[#127B99]/50 text-[#5ee3ff] group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block font-mono">Instant Messaging</span>
                    <a
                      href="https://wa.me/62882005085948"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base font-semibold text-white hover:text-cyan-300 transition-colors"
                    >
                      Chat via WhatsApp
                    </a>
                  </div>
                </div>

                {/* Location Item */}
                <div className="flex items-start gap-4 group">
                  <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block font-mono">Location</span>
                    <span className="text-sm sm:text-base font-semibold text-white">
                      Surakarta, Indonesia • UTC+7 (WIB)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Glowing Dark Mode Contact Form (7 Kolom di Layar Lebar) */}
            <div
              className="lg:col-span-7"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="300"
              data-aos-once="true"
            >
              <div className="rounded-3xl border-2 border-violet-500/40 shadow-[0_0_35px_rgba(168,85,247,0.25)] bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#161616] p-6 sm:p-10 relative overflow-hidden">
                {/* Efek Garis Glow Header Form */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-[#127B99] to-violet-500"></div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Send a Message
                </h2>
                <p className="text-zinc-400 text-sm mb-8">
                  Fill out the form below and I'll get back to you within 24 hours.
                </p>

                {notification.type === "success" && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 flex items-start gap-3 text-sm shadow-[0_0_20px_rgba(16,185,129,0.25)] animate__animated animate__fadeIn">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-white">Pesan Berhasil Terkirim!</p>
                      <p className="text-emerald-300/90 text-xs mt-0.5">{notification.message}</p>
                    </div>
                  </div>
                )}

                {notification.type === "error" && (
                  <div className="mb-6 p-4 rounded-2xl bg-red-950/70 border border-red-500/60 text-red-200 flex items-start gap-3 text-sm shadow-[0_0_20px_rgba(239,68,68,0.25)] animate__animated animate__fadeIn">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-white">Gagal Mengirim Pesan</p>
                      <p className="text-red-300/90 text-xs mt-0.5">{notification.message}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Field Nama */}
                  <div>
                    <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-2">
                      Nama Lengkap <span className="text-violet-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan nama Anda"
                        className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Field Email */}
                  <div>
                    <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-2">
                      Alamat Email <span className="text-violet-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="nama@email.com"
                        className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Field Subjek */}
                  <div>
                    <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-2">
                      Subjek / Topik
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Misal: Penawaran Kolaborasi Web App"
                      className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                    />
                  </div>

                  {/* Field Pesan */}
                  <div>
                    <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-2">
                      Pesan Anda <span className="text-violet-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3.5 pointer-events-none text-zinc-500">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        placeholder="Tuliskan detail kebutuhan proyek atau pesan Anda..."
                        className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 resize-none"
                      ></textarea>
                    </div>
                  </div>

                  {/* Tombol Submit Glowing */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-[#127B99] hover:opacity-95 shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:shadow-[0_0_35px_rgba(18,123,153,0.55)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Mengirimkan Pesan...</span>
                        </>
                      ) : (
                        <>
                          <span>Kirim Pesan</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 2. Footer */}
      <Footer />
    </>
  );
}

export default Contact;

