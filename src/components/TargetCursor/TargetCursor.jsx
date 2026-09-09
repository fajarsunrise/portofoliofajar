import { useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import './TargetCursor.css';

const TargetCursor = ({
  enabled = false,
  targetSelector = '.cursor-target, a, button',
  cursorColor = '#38bdf8',
  cornerSize = 9,
  idleOffset = 13,
  padding = 5,
  spinDuration = 6,
  pointerPos = null
}) => {
  const cursorRef = useRef(null);
  const cornersGroupRef = useRef(null);
  const cornersRef = useRef([]);
  const dotRef = useRef(null);
  const activeTargetRef = useRef(null);
  const spinTweenRef = useRef(null);
  const tickerFnRef = useRef(null);
  const isEnabledRef = useRef(enabled);
  const mousePosRef = useRef({ x: -100, y: -100 });

  isEnabledRef.current = enabled;

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return true;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = window.innerWidth <= 768;
    return hasTouchScreen || isCoarse || isSmallScreen;
  }, []);

  const idlePositions = useMemo(
    () => [
      { x: -idleOffset, y: -idleOffset }, // Top-Left
      { x: idleOffset - cornerSize, y: -idleOffset }, // Top-Right
      { x: idleOffset - cornerSize, y: idleOffset - cornerSize }, // Bottom-Right
      { x: -idleOffset, y: idleOffset - cornerSize } // Bottom-Left
    ],
    [idleOffset, cornerSize]
  );

  // Sync latest pointerPos from prop if available
  useEffect(() => {
    if (pointerPos && pointerPos.x > 0 && pointerPos.y > 0) {
      mousePosRef.current = { x: pointerPos.x, y: pointerPos.y };
    }
  }, [pointerPos]);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const cursor = cursorRef.current;
    const cornersGroup = cornersGroupRef.current;
    const corners = cornersRef.current.filter(Boolean);

    // Initial setup
    gsap.set(cursor, {
      x: -100,
      y: -100,
      opacity: 0,
      scale: 0.85
    });

    idlePositions.forEach((pos, i) => {
      if (corners[i]) {
        gsap.set(corners[i], { x: pos.x, y: pos.y });
      }
    });

    // Ambient spin animation for resting reticle
    spinTweenRef.current = gsap.to(cornersGroup, {
      rotation: '+=360',
      duration: spinDuration,
      ease: 'none',
      repeat: -1,
      paused: true
    });

    // High performance ticker (only active when in footer)
    const tickerFn = () => {
      if (!cursorRef.current || !isEnabledRef.current) return;

      const targetX = mousePosRef.current.x;
      const targetY = mousePosRef.current.y;

      const curX = gsap.getProperty(cursor, 'x');
      const curY = gsap.getProperty(cursor, 'y');

      // Fast, silky lerp tracking (0.45 factor = zero perceptible latency, buttery smooth)
      const nextX = curX + (targetX - curX) * 0.45;
      const nextY = curY + (targetY - curY) * 0.45;

      gsap.set(cursor, { x: nextX, y: nextY });

      // If locked onto an active interactive target element, anchor corners to it
      if (activeTargetRef.current) {
        const rect = activeTargetRef.current.getBoundingClientRect();
        const targets = [
          { x: rect.left - padding - nextX, y: rect.top - padding - nextY },
          { x: rect.right + padding - cornerSize - nextX, y: rect.top - padding - nextY },
          { x: rect.right + padding - cornerSize - nextX, y: rect.bottom + padding - cornerSize - nextY },
          { x: rect.left - padding - nextX, y: rect.bottom + padding - cornerSize - nextY }
        ];

        corners.forEach((corner, i) => {
          if (!corner) return;
          const cCurX = gsap.getProperty(corner, 'x');
          const cCurY = gsap.getProperty(corner, 'y');
          gsap.set(corner, {
            x: cCurX + (targets[i].x - cCurX) * 0.3,
            y: cCurY + (targets[i].y - cCurY) * 0.3
          });
        });
      }
    };

    tickerFnRef.current = tickerFn;

    // Track mouse position globally
    const handleMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Interactive target element hover detection (within footer)
    const handleMouseOver = (e) => {
      if (!isEnabledRef.current) return;
      const target = e.target?.closest ? e.target.closest(targetSelector) : null;
      if (!target) return;

      if (activeTargetRef.current === target) return;
      activeTargetRef.current = target;

      // Pause ambient spin and smoothly snap rotation to zero
      if (spinTweenRef.current) spinTweenRef.current.pause();
      gsap.to(cornersGroup, {
        rotation: 0,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const handleMouseOut = (e) => {
      if (!isEnabledRef.current || !activeTargetRef.current) return;
      if (e.relatedTarget && activeTargetRef.current.contains(e.relatedTarget)) return;

      activeTargetRef.current = null;

      // Smoothly return corners to idle reticle positions
      corners.forEach((corner, i) => {
        if (!corner) return;
        gsap.to(corner, {
          x: idlePositions[i].x,
          y: idlePositions[i].y,
          duration: 0.22,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      // Resume ambient spin
      if (spinTweenRef.current) {
        spinTweenRef.current.play();
      }
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseout', handleMouseOut, { passive: true });

    // Click micro-interaction
    const handleMouseDown = () => {
      if (!isEnabledRef.current) return;
      gsap.to(cursor, { scale: 0.88, duration: 0.12, ease: 'power2.out' });
    };

    const handleMouseUp = () => {
      if (!isEnabledRef.current) return;
      gsap.to(cursor, { scale: 1.0, duration: 0.16, ease: 'power2.out' });
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
      if (spinTweenRef.current) spinTweenRef.current.kill();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMobile, targetSelector, cornerSize, idleOffset, padding, spinDuration, idlePositions]);

  // Handle crossfade when enabled state toggles (entering/leaving footer)
  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const cursor = cursorRef.current;
    const corners = cornersRef.current.filter(Boolean);

    if (enabled) {
      // ENTERING FOOTER
      // Instantly position at current pointer location (prevents jump/teleport)
      if (mousePosRef.current.x > 0 && mousePosRef.current.y > 0) {
        gsap.set(cursor, {
          x: mousePosRef.current.x,
          y: mousePosRef.current.y,
          scale: 0.88
        });
      }

      // Reset corner brackets to idle positions
      corners.forEach((corner, i) => {
        if (corner) gsap.set(corner, { x: idlePositions[i].x, y: idlePositions[i].y });
      });

      // Start ticker & ambient spin
      if (tickerFnRef.current) gsap.ticker.add(tickerFnRef.current);
      if (spinTweenRef.current) spinTweenRef.current.play();

      // Smooth crossfade in (250ms, subtle ease)
      gsap.to(cursor, {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    } else {
      // LEAVING FOOTER
      activeTargetRef.current = null;

      // Smooth crossfade out (220ms)
      gsap.to(cursor, {
        opacity: 0,
        scale: 0.85,
        duration: 0.22,
        ease: 'power2.inOut',
        overwrite: 'auto',
        onComplete: () => {
          // Once faded out, stop ticker and pause ambient rotation to save CPU/GPU completely!
          if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
          if (spinTweenRef.current) spinTweenRef.current.pause();
        }
      });
    }
  }, [enabled, isMobile, idlePositions]);

  if (isMobile || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      ref={cursorRef}
      className="target-cursor-wrapper"
      aria-hidden="true"
      style={{
        pointerEvents: 'none'
      }}
    >
      {/* Precision center dot */}
      <div
        ref={dotRef}
        className="target-cursor-dot"
        style={{
          backgroundColor: cursorColor,
          boxShadow: `0 0 6px ${cursorColor}`
        }}
      />
      {/* Corner brackets with ambient spin container */}
      <div ref={cornersGroupRef} className="target-cursor-corners-group">
        <div
          ref={(el) => (cornersRef.current[0] = el)}
          className="target-cursor-corner corner-tl"
          style={{ borderColor: cursorColor }}
        />
        <div
          ref={(el) => (cornersRef.current[1] = el)}
          className="target-cursor-corner corner-tr"
          style={{ borderColor: cursorColor }}
        />
        <div
          ref={(el) => (cornersRef.current[2] = el)}
          className="target-cursor-corner corner-br"
          style={{ borderColor: cursorColor }}
        />
        <div
          ref={(el) => (cornersRef.current[3] = el)}
          className="target-cursor-corner corner-bl"
          style={{ borderColor: cursorColor }}
        />
      </div>
    </div>,
    document.body
  );
};

export default TargetCursor;
