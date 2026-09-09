// src/components/CertificateModal/CertificateModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiExternalLink } from 'react-icons/fi';
import { stopScroll, startScroll } from '../../utils/scrollManager';

const CertificateModal = ({ cert, onClose }) => {
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
    if (!cert) return;

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
  }, [cert, handleClose]);

  if (!cert) return null; // Jika tidak ada data, jangan tampilkan apa-apa

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
      {/* Kotak Modal Card (Di Tengah) */}
      <div
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat diklik di dalam
        className={`relative bg-zinc-900/95 border border-purple-500/40 rounded-2xl shadow-2xl shadow-purple-500/20 w-full max-w-lg overflow-hidden mx-auto my-auto flex flex-col items-center text-center transform transition-all duration-300 ${isClosing ? 'animate-out' : 'animate-in'}`}
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 'auto',
          marginBottom: 'auto',
          maxWidth: '32rem',
          width: '100%',
        }}
      >
        {/* Tombol X (Close) di pojok kanan atas */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 text-zinc-400 hover:text-white bg-zinc-950/80 hover:bg-zinc-800 p-2 rounded-full backdrop-blur-sm border border-zinc-700/50 transition-colors"
        >
          <FiX size={20} />
        </button>

        {/* Header Modal (Gambar Sertifikat Di Tengah) */}
        <div className="w-full p-6 sm:p-8 flex items-center justify-center bg-gradient-to-b from-purple-950/40 via-zinc-900/50 to-zinc-900 text-center">
          <img
            src={cert.image}
            alt={cert.title}
            className="max-h-48 sm:max-h-60 w-auto object-contain rounded-xl shadow-2xl border border-purple-500/20 mx-auto block"
            style={{
              margin: '0 auto',
              display: 'block',
            }}
          />
        </div>

        {/* Konten Detail Sertifikat (Di Tengah) */}
        <div className="p-6 sm:p-8 w-full flex flex-col items-center text-center gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
            {cert.title}
          </h2>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-400 font-medium">
            <span>{cert.issuer}</span>
            <span>•</span>
            <span>{cert.date}</span>
          </div>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed text-center max-w-md mx-auto">
            {cert.description}
          </p>

          {/* Tombol Aksi (Di Tengah) */}
          <a
            href={cert.image}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-full font-semibold transition-all shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            <span>Lihat Sertifikat Penuh</span>
            <FiExternalLink size={16} />
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

export default CertificateModal;