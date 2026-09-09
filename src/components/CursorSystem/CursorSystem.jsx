import { useState, useEffect, useMemo, useRef } from 'react';
import GlowCursor from '../GlowCursor/GlowCursor';
import TargetCursor from '../TargetCursor/TargetCursor';

const CursorSystem = () => {
  const [isOverFooter, setIsOverFooter] = useState(false);
  const [pointerPos, setPointerPos] = useState({ x: -100, y: -100 });
  const lastPosRef = useRef({ x: -100, y: -100 });

  // Detect mobile/touch devices where custom cursors must be completely disabled
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return true;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = window.innerWidth <= 768;
    return hasTouchScreen || isCoarse || isSmallScreen;
  }, []);

  // Monitor footer boundary efficiently with scroll and pointer tracking
  useEffect(() => {
    if (isMobile) return;

    const checkFooter = (clientX, clientY, target) => {
      if (target?.closest && target.closest('footer')) return true;
      const footer = document.querySelector('footer');
      if (!footer) return false;
      const rect = footer.getBoundingClientRect();
      return (
        clientY >= rect.top &&
        clientY <= rect.bottom &&
        clientX >= rect.left &&
        clientX <= rect.right
      );
    };

    const handlePointerMove = (e) => {
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      setPointerPos({ x: e.clientX, y: e.clientY });

      const inFooter = checkFooter(e.clientX, e.clientY, e.target);
      setIsOverFooter((prev) => (prev !== inFooter ? inFooter : prev));
    };

    // Update boundary check on scroll when pointer is stationary
    const handleScroll = () => {
      const { x, y } = lastPosRef.current;
      if (x < 0 || y < 0) return;
      const inFooter = checkFooter(x, y, null);
      setIsOverFooter((prev) => (prev !== inFooter ? inFooter : prev));
    };

    const handleMouseLeave = () => {
      setIsOverFooter(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile]);

  // Toggle CSS class to hide native cursor exclusively while inside footer
  useEffect(() => {
    if (isMobile) return;
    if (isOverFooter) {
      document.documentElement.classList.add('footer-target-cursor-active');
    } else {
      document.documentElement.classList.remove('footer-target-cursor-active');
    }
    return () => {
      document.documentElement.classList.remove('footer-target-cursor-active');
    };
  }, [isOverFooter, isMobile]);

  if (isMobile) {
    return null;
  }

  // Strict mutual exclusivity:
  // - GlowCursor is active on the entire website EXCEPT the footer.
  // - TargetCursor is active ONLY while inside the footer.
  // - Never active together.
  const isGlowActive = !isOverFooter;
  const isTargetActive = isOverFooter;

  return (
    <>
      {/* Background layer GlowCursor: sits at z-index 0 behind all cards & content */}
      <GlowCursor
        fullScreen
        enabled={isGlowActive}
        color="#67E8F9"
        secondaryColor="#7EACB5"
        trailLength={20}
        trailWidth={5.5}
        trailTaper={0.8}
        followSpeed={0.76}
        glowIntensity={1.25}
        glowSpread={0.85}
        hotspot={0.35}
        brightness={1.1}
        opacity={0.82}
        pulseSpeed={0.9}
        noiseStrength={0.02}
        idleFade={true}
        idleTimeout={600}
        fadeDuration={250}
        blendMode="screen"
      />

      {/* Foreground TargetCursor: active exclusively in footer, locks onto interactive targets */}
      <TargetCursor
        enabled={isTargetActive}
        pointerPos={pointerPos}
        targetSelector=".cursor-target, a, button"
        cornerSize={9}
        idleOffset={13}
        padding={5}
        spinDuration={6}
        cursorColor="#38bdf8"
      />
    </>
  );
};

export default CursorSystem;
