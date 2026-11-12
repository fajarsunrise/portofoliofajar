import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProfileCard from "./components/ProfileCard/ProfileCard";
import ShinyText from "./components/ShinyText/ShinyText";
import BlurText from "./components/BlurText/BlurText";
import ScrollStack, { ScrollStackItem } from "./components/ScrollStack/ScrollStack";
import ProjectStackCard from "./components/ScrollStack/ProjectStackCard";
import ProjectModal from "./components/ProjectModal/ProjectModal";
import ScrollTicker from "./components/ScrollTicker/ScrollTicker";
import InteractiveTicker from "./components/InteractiveTicker/InteractiveTicker";
import Aurora from "./components/Aurora/Aurora";
import { scrollToTarget } from "./utils/scrollManager";
import 'aos/dist/aos.css';

// Base URL API Backend Render
import { API_BASE_URL as CONFIG_API_BASE_URL, getFullImageUrl } from "./api/config";
const API_BASE_URL = CONFIG_API_BASE_URL || "https://api-artikel-portofolio.onrender.com/api";

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };
  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // State Dinamis Murni dari Backend API (Tanpa Data Statis Bawaan)
  const [heroData, setHeroData] = useState(null);
  const [tools, setTools] = useState([]);
  const [projects, setProjects] = useState([]);

  // Menangani scroll saat navigasi dari halaman lain menggunakan hash (contoh: /#project)
  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        scrollToTarget(window.location.hash, { offset: -30 });
      }, 400);
    }
  }, []);

  // Mengambil Data Publik dari API (Heroes, Tools, Projects)
  useEffect(() => {
    // 1. Fetch Hero Section dari ${API_BASE_URL}/heroes
    fetch(`${API_BASE_URL}/heroes`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data hero");
        return res.json();
      })
      .then((resData) => {
        const data = resData?.data || resData;
        if (data) {
          setHeroData(Array.isArray(data) ? data[0] : data);
        }
      })
      .catch((err) => console.error("Error fetching heroes:", err));

    // 2. Fetch Tools Section dari ${API_BASE_URL}/tools
    fetch(`${API_BASE_URL}/tools`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data tools");
        return res.json();
      })
      .then((resData) => {
        const data = resData?.data || resData;
        if (Array.isArray(data)) {
          setTools(data);
        }
      })
      .catch((err) => console.error("Error fetching tools:", err));

    // 3. Fetch Projects Section dari ${API_BASE_URL}/projects
    fetch(`${API_BASE_URL}/projects`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data projects");
        return res.json();
      })
      .then((resData) => {
        const data = resData?.data || resData;
        if (Array.isArray(data)) {
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
        }
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  return (
    <>
      {/* 1. Navbar */}
      <div className="container mx-auto px-4 sm:px-6 max-w-full">
        <Navbar />
      </div>

      {/* Aurora Background constrained to hero viewport */}
      <div className="absolute top-0 left-0 w-full h-[100vh] max-h-[960px] -z-10 overflow-hidden pointer-events-none">
        <Aurora
          colorStops={["#577870", "#1F97A6", "#127B99"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        {/* 2. Hero Section */}
        <div className="hero grid md:grid-cols-2 items-center pt-10 xl:gap-0 gap-6 grid-cols-1" id="home">
          <div className="animate__animated animate__fadeInUp animate__delay-3s">
            <h1 className="text-5xl font-bold mb-6">
              <ShinyText text={heroData?.greeting || ""} speed={2.5} color="#717171" shineColor="#ffffff" className="custom-class" />
            </h1>
            <BlurText
              text={heroData?.description || ""}
              delay={150}
              animateBy="words"
              direction="top"
              className=" mb-6"
            />
            <div className="flex items-center sm:gap-4 gap-2">
              <a
                href="/cv-fajar.pdf"
                download="cv-fajar.pdf"
                className="cursor-target font-semibold bg-[#1a1a1a] p-4 px-6 rounded-full border border-gray-700 hover:bg-[#222] transition-colors"
              >
                <ShinyText text="Download CV" disabled={false} speed={3} color="#717171" shineColor="#ffffff" className="custom-class" />
              </a>

              <a
                href="#project"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#project", { offset: -30 });
                }}
                className="cursor-target font-semibold bg-[#1a1a1a] p-4 px-6 rounded-full border border-gray-700 hover:bg-[#222] transition-colors"
              >
                <ShinyText text="Explore My Projects" disabled={false} speed={3} color="#717171" shineColor="#ffffff" className="custom-class" />
              </a>
            </div>

          </div>
          <div className="md:ml-auto animate__animated animate__fadeInUp animate__delay-4s">
            <ProfileCard
              name="Fajar"
              title="Web Developer"
              handle="fajar_dev"
              status="Online"
              contactText="Contact Me"
              avatarUrl={getFullImageUrl(heroData?.image_url) || "/default-avatar.png"}
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={() => {
                const contactEl = document.getElementById("contact");
                if (contactEl) {
                  scrollToTarget("#contact", { offset: -30 });
                }
              }}
            />
          </div>
        </div>

        {/* 3. Marquee Text */}
        <ScrollTicker text={heroData?.marquee_text} />

        {/* 4. Tools & Technologies */}
        <div className="tools mt-32">
          <h1
            className="text-4xl md:text-5xl mb-3 font-extrabold text-center"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
          >
            <ShinyText text="Tools & Technologies" speed={2.5} color="#717171" shineColor="#ffffff" />
          </h1>
          <p className="text-base/loose text-center opacity-50" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300" data-aos-once="true">My Professional Skills</p>
          <div className="mt-14" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-aos-once="true">
            <InteractiveTicker tools={tools} />
          </div>
        </div>

{/* 5. Featured Projects (Maksimal 2) */}
        <section className="proyek mt-32 py-10 relative" id="project">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[450px] bg-gradient-to-tr from-[#127B99]/20 via-violet-900/20 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

{/* Header Section: Judul di Tengah, Tombol di Bawah Kanan */}
          <div className="w-full max-w-6xl xl:max-w-[1240px] mx-auto px-2 sm:px-4 mb-8">
            
            {/* Bagian Judul (Tengah) */}
            <div className="text-center max-w-3xl mx-auto mb-4">
              <h1 className="text-4xl md:text-5xl mb-3 font-extrabold">
                <ShinyText text="Featured Projects" speed={2.5} color="#717171" shineColor="#ffffff" />
              </h1>
              <p className="text-base/loose opacity-50">
                Showcasing a selection of projects that reflect my skills, creativity, and passion for building meaningful digital experiences.
              </p>
            </div>

            {/* Bagian Tombol (Mentok Kanan Mutlak) */}
            <div className="w-full flex justify-end text-right">
              <Link 
                to="/projects" 
                className="group inline-flex items-center justify-end gap-2 text-sm sm:text-base font-semibold text-zinc-400 hover:text-violet-300 transition-colors duration-300 ml-auto"
              >
                View all projects 
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500/70 group-hover:text-violet-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
          </div>

          {/* Area Tumpukan Kartu Proyek */}
          <div className="proyek-box w-full max-w-6xl xl:max-w-[1240px] mx-auto px-2 sm:px-4">
            <ScrollStack
              itemDistance={90}
              itemScale={0.025}
              itemStackDistance={26}
              baseScale={0.88}
              stackPosition="18%"
              useWindowScroll={true}
              className="w-full"
            >
              {projects?.length > 0 && projects.slice(0, 2).map((project, index) => (
                <ScrollStackItem 
                  key={project.id || index}
                  itemClassName={index % 2 === 1 ? 'theme-blue' : 'theme-purple'}
                >
                  <ProjectStackCard
                    project={project}
                    index={index}
                    total={projects.slice(0, 2).length}
                    onProjectClick={handleProjectClick}
                  />
                </ScrollStackItem>
              ))}

            </ScrollStack>
          </div>
        </section>
        </main>

      
      {/* 6. Footer */}
      <Footer />

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
}

export default App;
