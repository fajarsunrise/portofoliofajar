import TextPressure from "./TextPressure/TextPressure";
import ShinyText from "./ShinyText/ShinyText";
import GradientWaves from "./GradientWaves/GradientWaves";
import { scrollToTarget } from "../utils/scrollManager";

const Footer = () => {
  const navLinks = [
    { label: "Home", target: "#home" },
    { label: "About", target: "#about" },
    { label: "Project", target: "#project" },
    { label: "Certificates", target: "#certificates" },
    { label: "Contact", target: "#contact" },
  ];

  const socialLinks = [
    {
      name: "Twitter",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] fill-current"
          aria-hidden="true"
        >
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
        </svg>
      ),
      href: "https://x.com/irsyad_ald",
    },
    {
      name: "LinkedIn",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] fill-current"
          aria-hidden="true"
        >
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      href: "https://linkedin.com/in/irsyad-ald",
    },
    {
      name: "GitHub",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] fill-current"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      ),
      href: "https://github.com/Irsyad-ald",
    },
    {
      name: "WhatsApp",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] fill-current"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      href: "https://wa.me/6287767132263",
    },
    {
      name: "Instagram",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] fill-current"
          aria-hidden="true"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      href: "https://instagram.com/irsyad_ald",
    },
  ];

  const handleLinkClick = (e, target) => {
    e.preventDefault();
    if (target === "#home") {
      scrollToTarget(0, { offset: 0, duration: 1.2 });
    } else {
      scrollToTarget(target, { offset: -30, duration: 1.2 });
    }
  };

  return (
    <footer className="relative w-full min-h-[600px] md:min-h-[720px] lg:min-h-screen flex flex-col justify-between pt-14 md:pt-20 pb-12 overflow-hidden">
      {/* Background Gradient Waves - Full Screen Canvas at the bottom landing */}
      <div
        className="absolute inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 100%)",
        }}
      >
        <GradientWaves
          horizonColor="#858585"
          waveColor="#1F97A6"
          crestColor="#127B99"
          speed={0.15}
          amplitude={3.7}
          waveScale={0.3}
          waveRatio={3}
          swell={11}
          turbulence={27}
          tilt={1.11}
          zoom={1.2}
          height={3.5}
          fogDepth={42}
          detail="high"
          brightness={1.05}
          opacity={1.0}
          mouseInteraction={true}
          parallaxStrength={1}
          grain={true}
          grainIntensity={0}
        />
        {/* Soft vignette overlay for high contrast and razor-sharp text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0f]/90 via-[#0d0d0f]/25 to-[#0d0d0f]/85 pointer-events-none" />
      </div>

      {/* Teks Preasure (TextPressure Component) */}
      <div className="w-full h-[180px] sm:h-[240px] md:h-[300px] lg:h-[340px] relative overflow-hidden select-none mb-8 sm:mb-12 flex items-center justify-center">
        <TextPressure
          text="Portofolio"
          flex={true}
          scale={false}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={false}
          textColor="rgba(244, 244, 245, 0.95)"
          strokeColor="#ffffff"
          minFontSize={120}
        />
      </div>

      {/* Footer Nav & Details matching design */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Navigation Links Row */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 text-base sm:text-lg font-semibold text-zinc-100"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.target}
              title={link.label}
              onClick={(e) => handleLinkClick(e, link.target)}
              className="cursor-target text-zinc-100 hover:text-cyan-300 hover:scale-105 transition-all duration-200 cursor-pointer tracking-wider px-3 py-1.5 rounded-lg inline-block drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Clear & Solid Separator Line */}
        <div className="w-full border-t-2 border-zinc-400/80 my-8 sm:my-10 shadow-[0_0_15px_rgba(18,123,153,0.45)]" />

        {/* Bottom Bar: Copyright & Social Icons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm sm:text-base">
          {/* Copyright */}
          <p className="text-zinc-100 font-medium tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            <ShinyText text="© DevStudios LLABC" speed={2.5} color="#f4f4f5" shineColor="#38bdf8" />
          </p>

          {/* Social Icons - Clean Monochrome Icons Matching Reference */}
          <div className="flex items-center justify-center sm:justify-end gap-6 sm:gap-7 text-zinc-300">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                title={social.name}
                className="cursor-target text-zinc-300 hover:text-white transition-all duration-200 hover:scale-125 active:scale-95 flex items-center justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
