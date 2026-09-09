import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion, isLowEndDevice } from './performance';

gsap.registerPlugin(ScrollTrigger);

/**
 * Global Scroll Manager
 * Consolidates Lenis smooth scroll, GSAP ScrollTrigger, and custom scroll consumers
 * (such as ScrollStack and Navbar) into a SINGLE, unified requestAnimationFrame loop
 * powered by gsap.ticker.
 * 
 * Guarantees:
 * 1. Zero layout thrashing: scroll position is cached in memory and provided directly
 *    to callbacks without querying window.scrollY or getBoundingClientRect in the frame.
 * 2. Perfect frame synchronization: Lenis, ScrollTrigger, and ScrollStack update in the
 *    exact same RAF tick, eliminating 1-frame jitter/lag.
 * 3. Safe lifecycle management and cleanup.
 */

class ScrollManager {
  constructor() {
    this.lenis = null;
    this.subscribers = new Set();
    this.cachedScroll = 0;
    this.tickerCallback = null;
    this.nativeScrollListener = null;
    this.isInitialized = false;
    this.reduced = false;
    this.lowEnd = false;
  }

  init() {
    if (this.isInitialized && this.lenis) return this.lenis;
    if (typeof window === 'undefined') return null;

    this.reduced = isReducedMotion();
    this.lowEnd = isLowEndDevice();
    this.cachedScroll = window.scrollY || document.documentElement.scrollTop || 0;

    // 1. Initialize master Lenis instance
    this.lenis = new Lenis({
      duration: this.reduced ? 0.01 : this.lowEnd ? 0.95 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !this.reduced,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      infinite: false,
      anchors: true,
      autoResize: true,
    });

    window.__lenis = this.lenis;

    // 2. Synchronize Lenis scroll event directly with ScrollTrigger & all subscribers
    // This executes synchronously inside the GSAP ticker frame when lenis.raf() is called
    this.lenis.on('scroll', (e) => {
      this.cachedScroll = e.scroll;

      // Update ScrollTrigger instances in the same tick
      ScrollTrigger.update();

      // Dispatch to all subscribers with zero DOM queries
      const scrollData = {
        scroll: e.scroll,
        velocity: e.velocity,
        direction: e.direction,
        progress: e.progress,
      };

      for (const callback of this.subscribers) {
        try {
          callback(scrollData);
        } catch (err) {
          console.error('[ScrollManager] Subscriber error:', err);
        }
      }
    });

    // 3. Connect Lenis directly to GSAP ticker as the single master RAF loop
    this.tickerCallback = (time) => {
      if (this.lenis) {
        this.lenis.raf(time * 1000);
      }
    };

    gsap.ticker.add(this.tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // 4. Fallback listener for native scroll changes (e.g. keyboard navigation, anchor jumps)
    this.nativeScrollListener = () => {
      const scroll = window.scrollY || document.documentElement.scrollTop || 0;
      this.cachedScroll = scroll;
      if (this.reduced || !this.lenis) {
        ScrollTrigger.update();
        const scrollData = {
          scroll,
          velocity: 0,
          direction: 1,
          progress: scroll / (document.documentElement.scrollHeight - window.innerHeight || 1),
        };
        for (const callback of this.subscribers) {
          callback(scrollData);
        }
      }
    };

    window.addEventListener('scroll', this.nativeScrollListener, { passive: true });

    this.isInitialized = true;
    return this.lenis;
  }

  /**
   * Subscribe a component or callback to the unified scroll loop.
   * The callback is passed pre-computed scroll metrics so it NEVER needs to query the DOM.
   * @param {Function} callback - ({ scroll, velocity, direction, progress }) => void
   * @returns {Function} unsubscribe
   */
  subscribe(callback) {
    if (typeof callback !== 'function') return () => {};

    this.subscribers.add(callback);

    // Immediately trigger once with current cached scroll position
    callback({
      scroll: this.cachedScroll,
      velocity: 0,
      direction: 1,
      progress: 0,
    });

    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Get the current scroll position without querying window.scrollY (zero layout thrashing).
   */
  getScroll() {
    return this.cachedScroll;
  }

  /**
   * Smoothly scrolls to target using the unified Lenis instance.
   */
  scrollTo(target, options = {}) {
    if (this.lenis) {
      this.lenis.scrollTo(target, {
        offset: options.offset ?? 0,
        duration: options.duration ?? (this.reduced ? 0.01 : 1.2),
        immediate: Boolean(this.reduced || options.immediate),
      });
    } else {
      const element = typeof target === 'string' ? document.querySelector(target) : target;
      if (element) {
        element.scrollIntoView({ behavior: this.reduced ? 'auto' : 'smooth' });
      }
    }
  }

  /**
   * Stop Lenis smooth scrolling (e.g. while modal/drawer is open)
   */
  stop() {
    if (this.lenis) {
      this.lenis.stop();
    }
  }

  /**
   * Resume Lenis smooth scrolling
   */
  start() {
    if (this.lenis) {
      this.lenis.start();
    }
  }

  /**
   * Recalculate dimensions for Lenis and ScrollTrigger
   */
  resize() {
    if (this.lenis) {
      this.lenis.resize();
    }
    ScrollTrigger.refresh();
  }

  destroy() {
    if (this.tickerCallback) {
      gsap.ticker.remove(this.tickerCallback);
      this.tickerCallback = null;
    }

    if (this.nativeScrollListener) {
      window.removeEventListener('scroll', this.nativeScrollListener);
      this.nativeScrollListener = null;
    }

    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
      window.__lenis = null;
    }

    this.subscribers.clear();
    this.isInitialized = false;
  }
}

export const scrollManager = new ScrollManager();
export const subscribeToScroll = (callback) => scrollManager.subscribe(callback);
export const getScrollPosition = () => scrollManager.getScroll();
export const scrollToTarget = (target, options) => scrollManager.scrollTo(target, options);
export const stopScroll = () => scrollManager.stop();
export const startScroll = () => scrollManager.start();
export const resizeScroll = () => scrollManager.resize();
