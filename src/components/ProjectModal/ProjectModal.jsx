import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiGithub } from 'react-icons/fi';
import { stopScroll, startScroll } from '../../utils/scrollManager';

const ProjectModal = ({ isOpen, onClose, project }) => {
  // State untuk mengontrol animasi penutupan
  const [isClosing, setIsClosing] = useState(false);

  // Fungsi untuk menangani penutupan dengan animasi
  const handleClose = useCallback(() => {
    setIsClosing(true);
    // Tunggu animasi selesai (300ms) sebelum memanggil onClose dari props
    setTimeout(() => {
      onClose();
      setIsClosing(false); // Reset state untuk pembukaan berikutnya
    }, 300);
  }, [onClose]);

  // Mencegah scroll di background & tangani tombol Escape saat modal terbuka
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    stopScroll();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      startScroll();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen || !project) return null;

  return createPortal(
    // Overlay backdrop - centered horizontally and vertically
    <div
      onClick={handleClose}
      data-lenis-prevent="true"
      className="fixed inset-0 w-screen h-screen min-h-screen bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-6 transition-opacity duration-300"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      {/* Modal Content Card */}
      <div
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat diklik di dalam
        className={`relative bg-zinc-900/95 border border-violet-500/40 rounded-2xl shadow-2xl shadow-violet-500/20 w-full max-w-lg overflow-hidden mx-auto my-auto flex flex-col items-center text-center transform transition-all duration-300 ${isClosing ? 'animate-out' : 'animate-in'}`}
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 'auto',
          marginBottom: 'auto',
          maxWidth: '32rem',
          width: '100%',
        }}
      >
        {/* Tombol Close di pojok kanan atas */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 text-zinc-400 hover:text-white bg-zinc-950/80 hover:bg-zinc-800 p-2 rounded-full backdrop-blur-sm border border-zinc-700/50 transition-colors"
        >
          <FiX size={20} />
        </button>

        {/* --- GAMBAR PROYEK --- */}
        <div className="w-full bg-zinc-950/50 flex justify-center items-center overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-56 sm:h-64 object-cover"
          />
        </div>

        {/* --- KONTEN DETAIL PROYEK (DI TENGAH) --- */}
        <div className="p-6 sm:p-8 w-full flex flex-col items-center text-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            {project.title}
          </h2>

          {/* DESKRIPSI LENGKAP */}
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed text-center max-w-md mx-auto">
            {project.fullDescription}
          </p>

          {/* TOMBOL ACTION (DI TENGAH) */}
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-2 font-semibold bg-violet-600 hover:bg-violet-500 text-white py-3 px-8 rounded-full cursor-pointer shadow-lg shadow-violet-600/25 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            <FiGithub size={18} />
            <span>Source Code</span>
          </a>
        </div>
      </div>

      {/* CSS untuk animasi */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        @keyframes scaleOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.95); opacity: 0; }
        }
        .animate-out {
          animation: scaleOut 0.3s ease-in forwards;
        }
      `}</style>
    </div>,
    document.body
  );
};

export default ProjectModal;
