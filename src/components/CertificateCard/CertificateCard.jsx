// src/components/CertificateCard/CertificateCard.jsx

import { useRef, useCallback } from "react";
import "./CertificateCard.css";

const CertificateCard = ({ cert, onClick }) => {
  const cardRef = useRef(null);

  // Jika data certificate belum ada
  if (!cert) return null;

  const handleMouseMove = useCallback((e) => {
    requestAnimationFrame(() => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();

      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      cardRef.current.style.setProperty("--glow-x", `${x}%`);
      cardRef.current.style.setProperty("--glow-y", `${y}%`);
    });
  }, []);

  const handleCardClick = () => {
    onClick?.(cert);
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    onClick?.(cert);
  };

  return (
    <div
      ref={cardRef}
      className="magic-bento-card"
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
  );
};

export default CertificateCard;