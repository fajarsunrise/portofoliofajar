import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion, isLowEndDevice } from '../../utils/performance';

import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.15,
  baseRotation = 0,
  blurStrength = 2,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom"
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduced = isReducedMotion();
    const lowEnd = isLowEndDevice();

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    // Use gsap.context to isolate and safely clean up ONLY this component's triggers
    const ctx = gsap.context(() => {
      if (baseRotation !== 0 && !reduced) {
        gsap.fromTo(
          el,
          { transformOrigin: '0% 50%', rotate: baseRotation },
          {
            ease: 'none',
            rotate: 0,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom',
              end: rotationEnd,
              scrub: true,
            },
          }
        );
      }

      const wordElements = el.querySelectorAll('.word');
      if (!wordElements.length) return;

      if (reduced) {
        // Fast, zero-overhead static display for reduced motion
        gsap.set(wordElements, { opacity: 1, filter: 'none' });
        return;
      }

      // Consolidate opacity and subtle blur into a single trigger to avoid duplicated scrub loops
      const shouldBlur = enableBlur && !lowEnd;
      const effectiveBlur = Math.min(blurStrength, 2);

      const fromVars = {
        opacity: baseOpacity,
      };
      const toVars = {
        ease: 'none',
        opacity: 1,
        stagger: 0.04,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true,
        },
      };

      if (shouldBlur) {
        fromVars.filter = `blur(${effectiveBlur}px)`;
        toVars.filter = 'blur(0px)';
      }

      gsap.fromTo(wordElements, fromVars, toVars);
    }, containerRef);

    return () => {
      // Safely revert only this component's animations without killing other ScrollTriggers
      ctx.revert();
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;
