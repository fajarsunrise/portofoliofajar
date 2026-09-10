import { useState } from "react";
import ProfileCard from "./components/ProfileCard/ProfileCard";
import ShinyText from "./components/ShinyText/ShinyText";
import BlurText from "./components/BlurText/BlurText";
import ScrambledText from "./components/ScrambledText/ScrambledText";
import SplitText from "./components/SplitText/SplitText";
import Lanyard from "./components/Lanyard/Lanyard";
import GlassIcons from "./components/GlassIcons/GlassIcons";
import { listTools, listProyek, listSertifikat } from "./data";
import ScrollStack, { ScrollStackItem } from "./components/ScrollStack/ScrollStack";
import ProjectStackCard from "./components/ScrollStack/ProjectStackCard";
import ProjectModal from "./components/ProjectModal/ProjectModal";
import CertificateCard from "./components/CertificateCard/CertificateCard";
import CertificateModal from "./components/CertificateModal/CertificateModal";
import ChromaGrid from "./components/ChromaGrid/ChromaGrid";
import CountUp from "./components/CountUp/CountUp";
import ScrollReveal from "./components/ScrollReveal/ScrollReveal";
import ScrollTicker from "./components/ScrollTicker/ScrollTicker";
import InteractiveTicker from "./components/InteractiveTicker/InteractiveTicker";

import Aurora from "./components/Aurora/Aurora";
import ElectricBorder from "./components/ElectricBorder/ElectricBorder";
import ChatRoom from "./components/ChatRoom";
import { scrollToTarget } from "./utils/scrollManager";
import 'aos/dist/aos.css';

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };
  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // STATE UNTUK SERTIFIKAT
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const handleCertificateClick = (cert) => {
    setSelectedCertificate(cert);
  };
  const handleCloseCertificateModal = () => {
    setSelectedCertificate(null);
  };

  const certificateChromaItems = listSertifikat.map((cert, index) => {
    const accents = [
      { borderColor: "#8B5CF6", gradient: "linear-gradient(145deg, rgba(139, 92, 246, 0.4), #09090b)" },
      { borderColor: "#10B981", gradient: "linear-gradient(145deg, rgba(16, 185, 129, 0.4), #09090b)" },
      { borderColor: "#3B82F6", gradient: "linear-gradient(145deg, rgba(59, 130, 246, 0.4), #09090b)" },
      { borderColor: "#EC4899", gradient: "linear-gradient(145deg, rgba(236, 72, 153, 0.4), #09090b)" },
      { borderColor: "#F59E0B", gradient: "linear-gradient(145deg, rgba(245, 158, 11, 0.4), #09090b)" },
      { borderColor: "#06B6D4", gradient: "linear-gradient(145deg, rgba(6, 182, 212, 0.4), #09090b)" },
    ];
    const accent = accents[index % accents.length];
    return {
      ...cert,
      subtitle: cert.issuer,
      handle: cert.date,
      borderColor: accent.borderColor,
      gradient: accent.gradient,
    };
  });

  return (
    <>
      {/* Aurora Background constrained to hero viewport to prevent 5000px WebGL canvas */}
      <div className="absolute top-0 left-0 w-full h-[100vh] max-h-[960px] -z-10 overflow-hidden pointer-events-none">
        <Aurora
          colorStops={["#577870", "#1F97A6", "#127B99"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">

        <div className="hero grid md:grid-cols-2 items-center pt-10 xl:gap-0 gap-6 grid-cols-1" id="home">
          <div className="animate__animated animate__fadeInUp animate__delay-3s">
            <div className="flex items-center gap-3 mb-6 bg bg-zinc-800 w-fit p-4 rounded-2xl">
              <img src="./assets/ahmad.png" className="w-10 rounded-md" />
              <q>Avoid or just undertake it</q>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              <ShinyText text="Hi I'm Ahmad Irsyad Ald" speed={2.5} color="#717171" shineColor="#ffffff" className="custom-class" />
            </h1>
            <BlurText
              text="A passionate application and web developer dedicated to crafting modern, high-performance digital experiences through innovative and user-friendly solutions."
              delay={150}
              animateBy="words"
              direction="top"
              className=" mb-6"
            />
            <div className="flex items-center sm:gap-4 gap-2">
              <a
                href="./assets/CV.pdf"
                download="Ahmad_Irsyad_CV.pdf"
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
              name="Ahmad Irsyad"
              title="Web Developer"
              handle="irsyad_ald"
              status="Online"
              contactText="Contact Me"
              avatarUrl="./assets/ahmad.png"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={() => scrollToTarget("#contact", { offset: -30 })}
            />
          </div>
        </div>

        {/* Scroll Ticker — between Hero and About */}
        <ScrollTicker />

        {/* Tentang (About Me) */}
        <div className="mt-15 mx-auto w-full max-w-[1600px] rounded-3xl border-[5px] border-violet-500/40 shadow-[0_0_30px_rgba(168,85,247,0.4)] bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] p-6" id="about">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-0 px-8" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
            <div className="basis-full md:basis-7/12 pr-0 md:pr-8 border-b md:border-b-0 md:border-r border-violet-500/30">
              <div className="flex-1 text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-5">
                  <ShinyText text="About Me" speed={2.5} color="#717171" shineColor="#ffffff" />
                </h1>

                {/* ScrollReveal text — reveals word-by-word on scroll */}
                <div className="mb-10">
                  <ScrollReveal
                    baseOpacity={0.15}
                    enableBlur={true}
                    baseRotation={0}
                    blurStrength={3}
                    containerClassName="scroll-reveal-body"
                    textClassName=""
                    rotationEnd="bottom bottom"
                    wordAnimationEnd="center center"
                  >
                    I'm Ahmad Irsyad Alaudin, a full-stack developer passionate about building modern, high-performance applications with an intuitive user experience. I enjoy working with the latest technologies like Artificial Intelligence, Machine Learning, and cloud-based development, blending creativity with precision to deliver impactful solutions. With over three years of experience and more than 20 completed projects, I'm committed to helping users and businesses grow in the digital era through functional, aesthetic, and scalable digital products.
                  </ScrollReveal>
                </div>

                {/* Counter Animation Stats */}
                <div className="flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-y-8 sm:gap-y-0 mb-4 w-full">
                  <div>
                    <h1 className="text-3xl md:text-4xl mb-1">
                      <CountUp
                        from={0}
                        to={20}
                        duration={2}
                        className="font-bold"
                      />
                      <span className="text-violet-500">+</span>
                    </h1>
                    <p>Project Finished</p>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl mb-1">
                      <CountUp
                        from={0}
                        to={3}
                        duration={2}
                        className="font-bold"
                      />
                      <span className="text-violet-500">+</span>
                    </h1>
                    <p>Years of Experience</p>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl mb-1">
                      <CountUp
                        from={0}
                        to={3.81}
                        duration={2.5}
                        className="font-bold"
                      />
                      <span className="text-violet-500">/4.00</span>
                    </h1>
                    <p>GPA</p>
                  </div>
                </div>

                <ShinyText
                  text="Working with heart, creating with mind."
                  disabled={false}
                  speed={3}
                  color="#717171"
                  shineColor="#ffffff"
                  className="text-sm md:text-base font-medium"
                />
              </div>
            </div>

            <div className="basis-full md:basis-5/12 pl-0 md:pl-8 overflow-hidden max-w-full flex justify-center ">
              <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
            </div>
          </div>
        </div>

        {/* Tools & Technologies — Interactive Ticker */}
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
            <InteractiveTicker tools={listTools} />
          </div>
        </div>

        {/* Projects — Editorial ScrollStack */}
        <section className="proyek mt-32 py-10 relative" id="project">
          {/* Ambient colored aura for deeper and richer section depth */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[450px] bg-gradient-to-tr from-[#127B99]/20 via-violet-900/20 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="text-center max-w-3xl mx-auto mb-14" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
            <h1
              className="text-4xl md:text-5xl mb-3 font-extrabold text-center"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-once="true"
            >
              <ShinyText text="Featured Projects" speed={2.5} color="#717171" shineColor="#ffffff" />
            </h1>
            <p className="text-base/loose text-center opacity-50" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300" data-aos-once="true">
              Showcasing a selection of projects that reflect my skills, creativity, and passion for building meaningful digital experiences.
            </p>
          </div>

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
              {listProyek.map((project, index) => (
                <ScrollStackItem 
                  key={project.id || index}
                  itemClassName={index % 2 === 1 ? 'theme-blue' : 'theme-purple'}
                >
                  <ProjectStackCard
                    project={project}
                    index={index}
                    total={listProyek.length}
                    onProjectClick={handleProjectClick}
                  />
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        </section>

        {/* Certificates — Magic Bento Grid */}
        <div className="sertifikat mt-32 py-10" id="certificates" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
          <h1
            className="text-4xl md:text-5xl mb-3 font-extrabold text-center"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
          >
            <ShinyText text="Certificates" speed={2.5} color="#717171" shineColor="#ffffff" />
          </h1>
          <p className="text-base/loose text-center opacity-50" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300" data-aos-once="true">Showcasing my academic achievements, training completions, and skill validations.</p>
        </div>
        <div className="sertifikat-box mt-14 pb-10" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200" data-aos-once="true">
          <ChromaGrid
            items={certificateChromaItems}
            onItemClick={handleCertificateClick}
            radius={300}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
          />
        </div>

        {/* Contact & Chat */}
        <div className="kontak mt-32 sm:p-10 p-0 relative z-10" id="contact">
          <h1
            className="text-4xl md:text-5xl mb-3 font-extrabold text-center"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
          >
            <ShinyText text="Chat & Contact" speed={2.5} color="#717171" shineColor="#ffffff" />
          </h1>
          <p
            className="text-base/loose text-center mb-12 text-zinc-400"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="300"
            data-aos-once="true"
          >
            Get in touch with me or chat in real-time
          </p>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">

            <div
              className="flex-1 relative"
              data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-aos-once="true"
            >
              <ElectricBorder
                color="#7df9ff"
                speed={1}
                chaos={0.06}
                borderRadius={24}
                className="h-full w-full"
              >
                <div className="w-full h-full bg-zinc-950/85 backdrop-blur-xl p-8 rounded-3xl border border-zinc-800/80 shadow-2xl flex flex-col">
                  <div className="flex-grow">
                    <ChatRoom />
                  </div>
                </div>
              </ElectricBorder>
            </div>

            <div className="flex-1 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-emerald-600/20 rounded-3xl blur-xl transition duration-1000"></div>

              <form
                action="https://formsubmit.co/irald0357@gmail.com"
                method="POST"
                className="relative h-full flex flex-col bg-zinc-950/80 backdrop-blur-xl p-8 sm:p-10 w-full rounded-3xl border border-zinc-700/50 shadow-2xl"
                autoComplete="off"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="500"
                data-aos-once="true"
              >
                <h1 className="text-lg font-bold text-white mb-6 text-center">
                  Send Message
                </h1>

                <div className="flex flex-col gap-6 flex-grow">
                  <div className="flex flex-col gap-2 relative">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      name="Name"
                      placeholder="e.g. John Doe"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2 relative">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      name="Email"
                      placeholder="e.g. hello@example.com"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2 relative flex-grow">
                    <label htmlFor="message" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Your Message</label>
                    <textarea
                      name="message"
                      id="message"
                      rows="5"
                      placeholder="How can I help you?"
                      className="w-full h-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300 resize-none"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="relative w-full overflow-hidden rounded-xl p-[1px] cursor-pointer group flex justify-center"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-emerald-500 to-violet-500 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <div className="relative flex items-center justify-center bg-zinc-950 w-full h-full px-6 py-4 rounded-xl group-hover:bg-zinc-900 transition-colors">
                      <ShinyText
                        text="Send Message"
                        disabled={false}
                        speed={3}
                        color="#717171"
                        shineColor="#ffffff"
                        className="font-bold tracking-wide text-center"
                      />
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
        project={selectedProject}
      />

      <CertificateModal
        cert={selectedCertificate}
        onClose={handleCloseCertificateModal}
      />
    </>
  )
}

export default App