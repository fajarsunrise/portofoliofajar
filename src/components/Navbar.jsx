import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { subscribeToScroll, scrollToTarget } from "../utils/scrollManager";
import ShinyText from "./ShinyText/ShinyText";

const Navbar = ({ hidden = false }) => {
  const [active, setActive] = useState(false);
  const location = useLocation();

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

  // Handler untuk scroll halus ketika sudah di halaman yang sama
  const handleScrollClick = (target) => {
    if (target === "top") {
      scrollToTarget(0, { offset: 0, duration: 1.2 });
      return;
    }

    if (location.pathname === "/") {
      scrollToTarget(target, { offset: -30, duration: 1.2 });
    }
  };

  // ⛔ Saat hidden, jangan render apa pun
  if (hidden) return null;

  return (
    <nav className="navbar relative z-50 py-7 flex items-center justify-between px-6 md:px-12">
      {/* Logo */}
      <div className="logo">
        <Link 
          to="/" 
          onClick={() => handleScrollClick("top")} 
          className="inline-block"
        >
          <h1 className="text-3xl font-bold text-white p-1 md:bg-transparent md:text-white">
            <ShinyText text="Portofolio" speed={2.5} color="#717171" shineColor="#ffffff" />
          </h1>
        </Link>
      </div>

      {/* Menu Navigasi Menggunakan <Link> react-router-dom (Mencegah Full-Page Reload) */}
      <ul
        className={`flex items-center sm:gap-10 gap-4 
        md:static fixed left-1/2 -translate-x-1/2 md:translate-x-0 
        md:opacity-100 bg-white/10 backdrop-blur-md 
        md:bg-transparent md:backdrop-blur-none
        p-4 rounded-br-2xl rounded-bl-2xl 
        transition-all md:transition-none
        ${active ? "top-0 opacity-100" : "-top-10 opacity-0"}`}
      >
        <li>
          <Link
            to="/"
            onClick={() => handleScrollClick("top")}
            className={`cursor-target sm:text-lg text-base font-medium transition-colors hover:text-gray-300 px-2 py-0.5 rounded-md inline-block ${
              location.pathname === "/" && !location.hash ? "text-violet-400 font-semibold" : ""
            }`}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/about"
            onClick={() => handleScrollClick("top")}
            className={`cursor-target sm:text-lg text-base font-medium transition-colors hover:text-gray-300 px-2 py-0.5 rounded-md inline-block ${
              location.pathname === "/about" ? "text-violet-400 font-semibold" : ""
            }`}
          >
            About
          </Link>
        </li>

        <li>
          <Link
            to="/projects"
            onClick={() => handleScrollClick("top")}
            className={`cursor-target sm:text-lg text-base font-medium transition-colors hover:text-gray-300 px-2 py-0.5 rounded-md inline-block ${
              location.pathname === "/projects" ? "text-violet-400 font-semibold" : ""
            }`}
          >
            Project
          </Link>
        </li>

        <li>
          <Link
            to="/contact"
            onClick={() => handleScrollClick("top")}
            className={`cursor-target sm:text-lg text-base font-medium transition-colors hover:text-gray-300 px-2 py-0.5 rounded-md inline-block ${
              location.pathname === "/contact" ? "text-violet-400 font-semibold" : ""
            }`}
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
