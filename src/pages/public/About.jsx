import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ShinyText from "../../components/ShinyText/ShinyText";
import CountUp from "../../components/CountUp/CountUp";
import Lanyard from "../../components/Lanyard/Lanyard";
import Aurora from "../../components/Aurora/Aurora";
import AOS from "aos";
import "aos/dist/aos.css";
import { Image as ImageIcon, Box } from "lucide-react";
import { scrollToTarget } from "../../utils/scrollManager";

// Base URL API Backend Laravel (Prioritaskan environment variable / config)
import { API_BASE_URL as CONFIG_API_BASE_URL, getFullImageUrl } from "../../api/config";
const API_BASE_URL = CONFIG_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "https://api.portofoliofajar.my.id/api";

// Data default awal agar halaman About langsung merender UI utamanya seketika tanpa jeda kosong / bayangan skeleton
const DEFAULT_ABOUT = {
  name: "Fajar",
  bio: "Saya merupakan lulusan S1 Informatika dari STMIK Amikom Surakarta yang memiliki minat di bidang pengembangan website dan teknologi informasi. Memiliki pengalaman magang sebagai Web Developer Intern di BPS Kota Surakarta dengan keterlibatan dalam pengembangan web disposisi surat dan link management. Menguasai dasar pemrograman PHP, Laravel, MySQL, serta Git. Selain bidang teknologi, saya juga memiliki pengalaman di bidang fotografi dan editing foto. Saya merupakan pribadi yang bertanggung jawab, adaptif, memiliki kemauan untuk belajar, serta mampu bekerja secara individu maupun dalam tim.",
  gpa: "3.68",
  contact_email: "fajarasshidik123@gmail.com",
  profile_image_url: "/storage/profiles/Tr6VjECls9NAKZ8SuWzwwnrf8PHf83H5eGkTHq4u.jpg",
};

function About() {
  // 1. Inisialisasi state langsung dari cache atau default data agar merender UI lengkap sejak detik pertama
  const [aboutData, setAboutData] = useState(() => {
    try {
      const cached = localStorage.getItem("portfolio_about_cache");
      if (cached) return JSON.parse(cached);
    } catch {}
    return DEFAULT_ABOUT;
  });

  const [heroData, setHeroData] = useState(() => {
    try {
      const cached = localStorage.getItem("portfolio_hero_cache");
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });

  const [experiences, setExperiences] = useState(() => {
    try {
      const cached = localStorage.getItem("portfolio_exp_cache");
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  });

  const [viewMode, setViewMode] = useState("photo"); // "photo" atau "3d"

  // Resolusi Foto Profil dengan prioritas About -> Hero -> Fallback Default Avatar
  const profilePhotoUrl =
    getFullImageUrl(
      aboutData?.avatar_url ||
      aboutData?.profile_image_url ||
      aboutData?.image_url ||
      heroData?.image_url
    ) || "/default-avatar.png";

  // Reset scroll ke paling atas saat halaman About dibuka
  useEffect(() => {
    window.scrollTo(0, 0);
    scrollToTarget(0, { immediate: true });
  }, []);

  // Inisialisasi AOS untuk animasi halaman
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    AOS.refresh();
  }, []);

  // 2. Fetching langsung ke endpoint API Laravel (/api/about, /api/heroes, /api/experiences)
  useEffect(() => {
    let isMounted = true;

    fetch(`${API_BASE_URL}/about`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data about");
        return res.json();
      })
      .then((resData) => {
        const data = resData?.data || resData;
        if (isMounted && data) {
          setAboutData(data);
          try {
            localStorage.setItem("portfolio_about_cache", JSON.stringify(data));
          } catch {}
        }
      })
      .catch((err) => console.error("Error fetching about:", err));

    fetch(`${API_BASE_URL}/heroes`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data hero");
        return res.json();
      })
      .then((resData) => {
        const data = resData?.data || resData;
        if (isMounted && data) {
          const heroItem = Array.isArray(data) ? data[0] : data;
          setHeroData(heroItem);
          try {
            localStorage.setItem("portfolio_hero_cache", JSON.stringify(heroItem));
          } catch {}
        }
      })
      .catch((err) => console.error("Error fetching heroes:", err));

    fetch(`${API_BASE_URL}/experiences`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data experiences");
        return res.json();
      })
      .then((resData) => {
        const data = resData?.data || resData;
        if (isMounted && Array.isArray(data)) {
          setExperiences(data);
          try {
            localStorage.setItem("portfolio_exp_cache", JSON.stringify(data));
          } catch {}
        }
      })
      .catch((err) => console.error("Error fetching experiences:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Refresh AOS saat data ter-update
  useEffect(() => {
    AOS.refresh();
  }, [aboutData, experiences]);

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
        {/* BAGIAN UTAMA: TENTANG (ABOUT ME)                         */}
        {/* Bingkai utama dipertahankan 100% tanpa diubah/dihapus    */}
        {/* ======================================================== */}
        <div
          className="mt-15 mx-auto w-full max-w-[1600px] rounded-3xl border-[5px] border-violet-500/40 shadow-[0_0_30px_rgba(168,85,247,0.4)] bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] p-6 sm:p-10"
          id="about"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-once="true"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-0 px-2 sm:px-8">
            {/* Kolom Kiri: Teks Naratif & Counter Statistik (Render Langsung) */}
            <div className="basis-full md:basis-7/12 pr-0 md:pr-8 border-b md:border-b-0 md:border-r border-violet-500/30 pb-8 md:pb-0">
              <div className="flex-1 text-left">
                {/* Judul Utama dengan ShinyText */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-5">
                  <ShinyText text="About Me" speed={2.5} color="#717171" shineColor="#ffffff" />
                </h1>

                {/* Paragraf Bio Dinamis (Render Langsung dengan Optional Chaining) */}
                <div className="mb-10">
                  <p className="text-base md:text-lg leading-relaxed text-zinc-300 whitespace-pre-line">
                    {aboutData?.bio || ""}
                  </p>
                </div>

                {/* Counter Animation Stats (Render Langsung Secara Instan) */}
                <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-y-8 sm:gap-y-0 sm:gap-x-16 text-center sm:text-left mb-4 w-full">
                  {/* <div>
                    <h1 className="text-3xl md:text-4xl mb-1 text-white">
                      <CountUp
                        from={0}
                        to={Number(aboutData?.projects_completed) || 0}
                        duration={2}
                        className="font-bold"
                      />
                      <span className="text-violet-500 font-bold">+</span>
                    </h1>
                    <p className="text-zinc-400 text-sm">Project Finished</p>
                  </div> */}

                  <div>
                    <h1 className="text-3xl md:text-4xl mb-1 text-white">
                      <CountUp
                        from={0}
                        to={Number(aboutData?.gpa) || 3.68}
                        duration={2}
                        decimals={2}
                        className="font-bold"
                      />
                      <span className="text-violet-500 font-bold">/4.00</span>
                    </h1>
                    <p className="text-zinc-400 text-sm">GPA</p>
                  </div>
                </div>

                {/* Teks Quote / Tagline Dinamis (Render Langsung) */}
                <div className="mt-4">
                  <ShinyText
                    text={aboutData?.quote || ""}
                    disabled={false}
                    speed={3}
                    color="#717171"
                    shineColor="#ffffff"
                    className="text-sm md:text-base font-medium block"
                  />
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Foto Profil Dinamis & Lanyard 3D Interaktif (Render Langsung) */}
            <div className="basis-full md:basis-5/12 pl-0 md:pl-8 overflow-hidden max-w-full flex flex-col items-center justify-center">
              {/* Switcher Tampilan (Foto Profil vs 3D Lanyard) */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-zinc-900/90 border border-zinc-800 mb-4 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("photo")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-300 ${
                    viewMode === "photo"
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("3d")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-300 ${
                    viewMode === "3d"
                      ? "bg-[#127B99] text-white shadow-lg shadow-[#127B99]/40 font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>3D Lanyard</span>
                </button>
              </div>

              {viewMode === "photo" ? (
                /* Kartu Foto Profil Dinamis dengan Efek Glow Cyan & Violet */
                <div className="relative group w-full max-w-[340px] sm:max-w-[360px] mx-auto">
                  {/* Glowing Accent Border (Cyan #127B99 & Violet) */}
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#127B99]/50 via-violet-600/50 to-[#127B99]/50 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                  <div className="relative rounded-2xl overflow-hidden border-2 border-violet-500/50 bg-zinc-950/90 backdrop-blur-xl shadow-2xl p-3">
                    <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80">
                      {/* Foto Profil Utama Render Langsung */}
                      <img
                        key={profilePhotoUrl}
                        src={profilePhotoUrl}
                        alt={aboutData?.name || heroData?.name || "Profile"}
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="eager"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          if (!target.src.includes("default-avatar.png")) {
                            target.src = "/default-avatar.png";
                          }
                        }}
                      />

                      {/* Vignette Gelap di Bawah */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                      {/* Caption Info Profil */}
                      <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between">
                        <div>
                          <p className="text-white font-bold text-base drop-shadow-md">
                            {aboutData?.name || heroData?.name || "Fajar"}
                          </p>
                          <p className="text-xs text-violet-300 font-mono">
                            {aboutData?.contact_email || ""}
                          </p>
                        </div>
                        <span className="flex h-3 w-3 relative" title="Online Status">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* 3D Physics Lanyard Orisinal */
                <div className="w-full flex justify-center min-h-[380px]">
                  <Lanyard
                    avatarUrl={profilePhotoUrl}
                    name={aboutData?.name || heroData?.name || "Fajar"}
                    position={[0, 0, 15]}
                    gravity={[0, -40, 0]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BAGIAN TAMBAHAN: LINIMASA KARIER & PENGALAMAN KERJA      */}
        {/* ======================================================== */}
        {experiences.length > 0 && (
          <section className="mt-28 relative" id="experience">
            {/* Ambient colored aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[450px] bg-gradient-to-tr from-[#127B99]/20 via-violet-900/20 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

            <div
              className="text-center max-w-3xl mx-auto mb-14"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-once="true"
            >
              <h1 className="text-4xl md:text-5xl mb-3 font-extrabold text-center">
                <ShinyText text="Career & Experience" speed={2.5} color="#717171" shineColor="#ffffff" />
              </h1>
              <p className="text-base/loose text-center text-zinc-400">
                My professional journey, work history, and industry milestones.
              </p>
            </div>

            <div className="max-w-4xl mx-auto px-4">
              <div className="relative border-l-2 border-violet-500/40 ml-4 sm:ml-6 pl-6 sm:pl-10 space-y-10">
                {experiences.map((exp, index) => (
                  <div
                    key={exp?.id || index}
                    className="relative group"
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay={index * 150}
                    data-aos-once="true"
                  >
                    {/* Glowing Bullet Node di Garis Linimasa */}
                    <div className="absolute -left-[31px] sm:-left-[47px] top-6 w-4 h-4 rounded-full bg-violet-500 border-2 border-zinc-950 shadow-[0_0_12px_rgba(168,85,247,0.9)] group-hover:scale-125 transition-transform duration-300" />

                    {/* Kartu Pengalaman */}
                    <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/80 hover:border-violet-500/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 shadow-xl group-hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">
                            {exp?.role}
                          </h2>
                          <span className="text-violet-400 font-semibold text-sm sm:text-base">
                            {exp?.company}
                          </span>
                        </div>
                        <span className="text-xs font-mono bg-zinc-800/80 text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700/60 w-fit">
                          {exp?.start_date} – {exp?.end_date}
                        </span>
                      </div>

                      <p className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line mt-3 border-t border-zinc-800/60 pt-3">
                        {exp?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 3. Footer */}
      <Footer />
    </>
  );
}

export default About;
