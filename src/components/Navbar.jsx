import { useState, useEffect } from "react";
import { subscribeToScroll, scrollToTarget } from "../utils/scrollManager";
import ShinyText from "./ShinyText/ShinyText";

const Navbar = ({ hidden = false }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (hidden) return;
    let isScrolled = false;

    const unsubscribe = subscribeToScroll(({ scroll }) => {
      const next = scroll > 150;
      if (next !== isScrolled) {
        isScrolled = next;
        setActive(next);
      }
    });

    return unsubscribe;
  }, [hidden]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (targetId === "#home") {
      scrollToTarget(0, { offset: 0, duration: 1.2 });
    } else {
      scrollToTarget(targetId, { offset: -30, duration: 1.2 });
    }
  };

  // ⛔ Saat hidden, jangan render apa pun
  if (hidden) return null;

  return (
    <nav className="navbar relative z-50 py-7 flex items-center justify-between px-6 md:px-12">
      {/* Logo */}
      <div className="logo">
        <h1 className="text-3xl font-bold text-white p-1 md:bg-transparent md:text-white">
          <ShinyText text="Portofolio" speed={2.5} color="#717171" shineColor="#ffffff" />
        </h1>
      </div>

      {/* Menu */}
      <ul
        className={`flex items-center sm:gap-10 gap-4 
        md:static fixed left-1/2 -translate-x-1/2 md:translate-x-0 
        md:opacity-100 bg-white/10 backdrop-blur-md 
        md:bg-transparent md:backdrop-blur-none
        p-4 rounded-br-2xl rounded-bl-2xl 
        transition-all md:transition-none
        ${active ? "top-0 opacity-100" : "-top-10 opacity-0"}`}
      >
        {/* Menambahkan transition-colors dan hover */}
        <li><a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="cursor-target sm:text-lg text-base font-medium transition-colors hover:text-gray-300 px-2 py-0.5 rounded-md inline-block">Home</a></li>
        <li><a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="cursor-target sm:text-lg text-base font-medium transition-colors hover:text-gray-300 px-2 py-0.5 rounded-md inline-block">About</a></li>
        <li><a href="#project" onClick={(e) => handleNavClick(e, "#project")} className="cursor-target sm:text-lg text-base font-medium transition-colors hover:text-gray-300 px-2 py-0.5 rounded-md inline-block">Project</a></li>
        <li><a href="#certificates" onClick={(e) => handleNavClick(e, "#certificates")} className="cursor-target sm:text-lg text-base font-medium transition-colors hover:text-gray-300 px-2 py-0.5 rounded-md inline-block">Sertifikat</a></li>
        <li><a href="#contact" onClick={(e) => handleNavClick(e, "#contact")} className="cursor-target sm:text-lg text-base font-medium transition-colors hover:text-gray-300 px-2 py-0.5 rounded-md inline-block">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
