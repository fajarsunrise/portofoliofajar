import Aurora from "./Aurora/Aurora";
import CountUp from "./CountUp/CountUp";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { stopScroll, startScroll, resizeScroll } from "../utils/scrollManager";

const PreLoader = () => {
  const [loading, setLoading] = useState(true);
  const [countDone, setCountDone] = useState(false);
  const [fadeText, setFadeText] = useState(false);
  const [fadeScreen, setFadeScreen] = useState(false);

  // Kunci scroll body saat preloader aktif agar posisi layar tetap stabil
  useEffect(() => {
    if (!loading) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    stopScroll();

    return () => {
      document.body.style.overflow = originalOverflow;
      startScroll();
      resizeScroll();
    };
  }, [loading]);

  useEffect(() => {
    if (!countDone) return;

    // Teks mulai menghilang
    const fadeTextTimer = setTimeout(() => {
      setFadeText(true);
    }, 500);

    // Seluruh layar mulai menghilang
    const fadeScreenTimer = setTimeout(() => {
      setFadeScreen(true);
    }, 1500);

    // Hapus preloader
    const hideTimer = setTimeout(() => {
      setLoading(false);
    }, 2600);

    return () => {
      clearTimeout(fadeTextTimer);
      clearTimeout(fadeScreenTimer);
      clearTimeout(hideTimer);
    };
  }, [countDone]);

  if (!loading) return null;

  return createPortal(
    <div
      className={`fixed inset-0 w-full h-full z-[10000] bg-black overflow-hidden flex items-center justify-center transition-opacity duration-1000 ${
        fadeScreen ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 pointer-events-none w-full h-full">
        <Aurora
          colorStops={["#577870", "#1F97A6", "#127B99"]}
          blend={0.5}
          amplitude={1}
          speed={0.5}
        />
      </div>

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none transition-all duration-1000 ${
          fadeText ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="w-full max-w-xl mx-auto flex items-center justify-center text-center font-bold text-7xl sm:text-8xl md:text-9xl text-white select-none tabular-nums tracking-tight">
          <CountUp
            from={0}
            to={100}
            duration={2}
            className="inline-block text-center tabular-nums"
            onEnd={() => setCountDone(true)}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PreLoader;