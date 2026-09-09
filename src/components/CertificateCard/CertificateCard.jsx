// src/components/CertificateCard/CertificateCard.jsx

import { useRef, useCallback } from "react";
import { motion } from "motion/react";
import "./CertificateCard.css";

const CertificateCard = ({ cert, index = 0, onClick }) => {
  const cardRef = useRef(null);
  const rectRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = rectRef.current || cardRef.current.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    cardRef.current.style.setProperty("--glow-x", `${x}%`);
    cardRef.current.style.setProperty("--glow-y", `${y}%`);
  }, []);

  // Jika data certificate belum ada
  if (!cert) return null;

  const handleCardClick = () => {
    onClick?.(cert);
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    onClick?.(cert);
  };

  return (
    <motion.div
      className="h-full w-full"
      initial={{ opacity: 0, y: 45, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15, margin: "-30px" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        ref={cardRef}
        className="magic-bento-card h-full"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onClick={handleCardClick}
      >
        <div className="magic-bento-inner">
          {/* Thumbnail */}

          <div className="magic-bento-image">
            <img
              src={cert.image}
              alt={cert.title}
              loading="lazy"
              draggable={false}
            />
          </div>

          {/* Content */}

          <div className="magic-bento-content">
            <h3 className="magic-bento-title">
              {cert.title || "Untitled Certificate"}
            </h3>

            <div className="magic-bento-meta">
              <span className="year">{cert.date || "-"}</span>

              <span className="dot">•</span>

              <span className="issuer">
                {cert.issuer || "Unknown issuer"}
              </span>
            </div>

            {/* Preview Button */}

            <div className="magic-bento-preview">
              <button
                type="button"
                className="magic-bento-preview-btn"
                onClick={handlePreviewClick}
              >
                <span>Preview Certificate</span>

                <svg
                  width="18"
                  height="18"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />

                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateCard;