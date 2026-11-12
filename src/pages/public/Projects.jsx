import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ShinyText from "../../components/ShinyText/ShinyText";
import ScrollStack, { ScrollStackItem } from "../../components/ScrollStack/ScrollStack";
import ProjectStackCard from "../../components/ScrollStack/ProjectStackCard";
import ProjectModal from "../../components/ProjectModal/ProjectModal";
import Aurora from "../../components/Aurora/Aurora";
import AOS from "aos";
import "aos/dist/aos.css";
import { Layers } from "lucide-react";
import { scrollToTarget } from "../../utils/scrollManager";

// Base URL API Backend Laravel
import { API_BASE_URL as CONFIG_API_BASE_URL } from "../../api/config";
const API_BASE_URL = CONFIG_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "https://api.portofoliofajar.my.id/api";

function Projects() {
  // Inisialisasi daftar proyek langsung dari cache atau array kosong untuk render instan
  const [projects, setProjects] = useState(() => {
    try {
      const cached = localStorage.getItem("portfolio_projects_cache");
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  });
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // Scroll ke paling atas saat halaman pertama kali dimuat
  useEffect(() => {
    window.scrollTo(0, 0);
    scrollToTarget(0, { immediate: true });
  }, []);

  // Inisialisasi animasi AOS untuk halaman
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    AOS.refresh();
  }, [projects]);

  // Fetch seluruh data proyek dari backend API secara langsung tanpa delay
  useEffect(() => {
    let isMounted = true;

    fetch(`${API_BASE_URL}/projects`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data proyek");
        return res.json();
      })
      .then((resData) => {
        const data = resData?.data || resData;
        if (isMounted && Array.isArray(data)) {
          const formatted = data.map((item) => {
            const techList = Array.isArray(item.technologies)
              ? item.technologies
              : (item.technologies
                ? String(item.technologies).split(",").map((s) => s.trim()).filter(Boolean)
                : (item.tech ? String(item.tech).split(",").map((s) => s.trim()).filter(Boolean) : []));

            return {
              id: item.id,
              title: item.title,
              image: item.image_url || "",
              subtitle: item.description,
              fullDescription: item.description,
              tech: techList,
              technologies: techList,
              url: item.demo_link || "#",
              github: item.demo_link || "#",
            };
          });
          setProjects(formatted);
          try {
            localStorage.setItem("portfolio_projects_cache", JSON.stringify(formatted));
          } catch {}
        }
      })
      .catch((err) => {
        console.error("Error fetching all projects:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
        {/* HEADER SECTION: JUDUL & DESKRIPSI HALAMAN PROYEK        */}
        {/* ======================================================== */}
        <section className="proyek pt-8 pb-10 relative">
          {/* Ambient Glow Aura */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[450px] bg-gradient-to-tr from-[#127B99]/20 via-violet-900/20 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

          <div
            className="text-center max-w-3xl mx-auto mb-12"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
          >
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/40 text-violet-300 text-xs font-mono font-semibold uppercase tracking-wider mb-4 shadow-sm shadow-violet-900/30">
              <Layers className="w-3.5 h-3.5" />
              <span>Project Showcase</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 font-extrabold text-white tracking-tight">
              <ShinyText text="All Projects" speed={2.5} color="#717171" shineColor="#ffffff" />
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-zinc-400 max-w-2xl mx-auto">
              A comprehensive archive of applications, web platforms, and software solutions designed and engineered to deliver real-world impact.
            </p>
          </div>

          {/* ======================================================== */}
          {/* AREA TUMPUKAN KARTU PROYEK (SEMUA DATA DARI API)        */}
          {/* ======================================================== */}
          <div className="proyek-box w-full max-w-6xl xl:max-w-[1240px] mx-auto px-2 sm:px-4">
            {projects?.length > 0 ? (
              /* Render Tumpukan Proyek Menggunakan ScrollStack Orisinal Secara Langsung */
              <ScrollStack
                key={projects?.length}
                itemDistance={90}
                itemScale={0.025}
                itemStackDistance={26}
                baseScale={0.88}
                stackPosition="18%"
                useWindowScroll={true}
                className="w-full"
              >
                {projects?.map((project, index) => (
                  <ScrollStackItem
                    key={project?.id || index}
                    itemClassName={index % 2 === 1 ? "theme-blue" : "theme-purple"}
                  >
                    <ProjectStackCard
                      project={project}
                      index={index}
                      total={projects?.length}
                      onProjectClick={handleProjectClick}
                    />
                  </ScrollStackItem>
                ))}
              </ScrollStack>
            ) : (
              /* Tampilan Jika Data Database Kosong */
              <div className="text-center text-white/50 py-16 bg-zinc-900/40 rounded-3xl border border-zinc-800/80 max-w-2xl mx-auto p-8 shadow-xl">
                <p className="text-lg font-medium text-zinc-300 mb-2">Belum ada data proyek yang dipublikasikan.</p>
                <p className="text-sm text-zinc-500">Silakan tambahkan proyek melalui CMS Admin untuk menampilkannya di halaman ini.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 2. Footer */}
      <Footer />

      {/* 3. Modal Detail Proyek */}
      <ProjectModal
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
}

export default Projects;

