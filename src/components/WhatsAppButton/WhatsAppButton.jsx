import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RiWhatsappLine } from 'react-icons/ri';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    window.open('https://wa.me/62882005085948', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="wa-fixed-container">
      {/* SVG gooey liquid filter */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'none' }}>
        <defs>
          <filter id="wa-liquid-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <button
        className="wa-button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        aria-label="Chat via WhatsApp"
      >
        <div className="wa-liquid-bg"></div>
        <RiWhatsappLine size={32} />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="wa-tooltip"
            >
              Chat via WhatsApp
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default WhatsAppButton;
