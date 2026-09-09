/**
 * Performance & Adaptive Quality Utilities
 * Detects device capabilities, reduced motion preference, and provides helpers
 * to ensure smooth 60-120 FPS across high-end, mid-range, and low-end devices.
 */

export const isReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
};

export const isLowEndDevice = () => {
  if (typeof window === 'undefined') return false;
  // Hardware concurrency: <= 2 cores indicates entry-level or low-power device
  const cores = navigator.hardwareConcurrency || 8;
  // Device memory: <= 2GB RAM
  const memory = navigator.deviceMemory || 8;
  return cores <= 2 || memory <= 2;
};

export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024);
};

export const getPerformanceTier = () => {
  if (isReducedMotion()) return 'reduced';
  if (isLowEndDevice() || (isMobileDevice() && (navigator.hardwareConcurrency || 4) <= 4)) {
    return 'low';
  }
  if (isMobileDevice()) {
    return 'medium';
  }
  return 'high';
};
