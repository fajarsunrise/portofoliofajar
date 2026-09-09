import TextPressure from "./TextPressure/TextPressure";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";
import { scrollToTarget } from "../utils/scrollManager";

const Footer = () => {
  const navLinks = [
    { label: "Products", target: "#project" },
    { label: "Studio", target: "#about" },
    { label: "Clients", target: "#project" },
    { label: "Pricing", target: "#contact" },
    { label: "Blog", target: "#certificates" },
    { label: "Privacy", target: "#home" },
    { label: "Terms", target: "#home" },
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
    <footer className="relative w-full mt-24 md:mt-32 pt-6 pb-12 flex flex-col items-center overflow-hidden">
      {/* Teks Preasure (TextPressure Component) */}
      <div className="w-full h-[180px] sm:h-[230px] md:h-[280px] lg:h-[320px] relative overflow-hidden select-none mb-10 sm:mb-14 flex items-center justify-center">
        <TextPressure
          text="Portofolio"
          flex={true}
          scale={false}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={false}
          textColor="rgba(87, 87, 87, 0.95)"
          strokeColor="#ffffff"
          minFontSize={120}
        />
      </div>

      {/* Footer Nav & Details matching design */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Navigation Links Row */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10 text-sm md:text-base font-medium text-zinc-300"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.target}
              onClick={(e) => handleLinkClick(e, link.target)}
              className="cursor-target hover:text-white transition-colors duration-200 cursor-pointer tracking-wide px-2.5 py-1 rounded-md inline-block"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Dashed Separator Line */}
        <div className="w-full border-t border-dashed border-zinc-700/60 my-7 sm:my-9" />

        {/* Bottom Bar: Copyright & Social Icons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-sm">
          {/* Copyright */}
          <p className="text-zinc-400 font-normal tracking-wide">
            © DevStudios LLABC
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 sm:gap-5 text-zinc-300">
            <a
              href="https://twitter.com/irsyad_ald"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="cursor-target hover:text-white transition-colors duration-200 text-lg sm:text-xl p-2 rounded-lg inline-flex items-center justify-center"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com/in/irsyad_ald"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="cursor-target hover:text-white transition-colors duration-200 text-lg sm:text-xl p-2 rounded-lg inline-flex items-center justify-center"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/Irsyad-ald"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="cursor-target hover:text-white transition-colors duration-200 text-lg sm:text-xl p-2 rounded-lg inline-flex items-center justify-center"
            >
              <FaGithub />
            </a>
            <a
              href="https://wa.me/6287767132263"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="cursor-target hover:text-white transition-colors duration-200 text-lg sm:text-xl p-2 rounded-lg inline-flex items-center justify-center"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://instagram.com/irsyad_ald"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="cursor-target hover:text-white transition-colors duration-200 text-lg sm:text-xl p-2 rounded-lg inline-flex items-center justify-center"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
