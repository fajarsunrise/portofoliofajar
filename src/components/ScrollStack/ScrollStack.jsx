import { useLayoutEffect, useRef, useCallback } from 'react';
import { isReducedMotion, isLowEndDevice, isMobileDevice } from '../../utils/performance';
import { subscribeToScroll, getScrollPosition } from '../../utils/scrollManager';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className="scroll-stack-card-wrapper">
    <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
  </div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.025,
  itemStackDistance = 30,
  stackPosition = '18%',
  scaleEndPosition = '10%',
  baseScale = 0.88,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = true,
  onStackComplete
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const cardsRef = useRef([]);
  const wrappersRef = useRef([]);
  const lastTransformsRef = useRef(new Map());

  // Cached layout metrics completely isolated outside the animation frame loop
  const cachedLayoutRef = useRef({
    cardPins: [],
    containerHeight: 800,
    isReduced: false,
    isLowEnd: false,
  });

  const calculateProgress = (scrollTop, start, end) => {
    if (scrollTop <= start) return 0;
    if (scrollTop >= end) return 1;
    if (end <= start) return 0;
    return (scrollTop - start) / (end - start);
  };

  const parsePercentage = (value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  };

  /**
   * Layout Measurement Routine
   * STRICTLY executed outside the scroll frame loop:
   * - on mount
   * - on window resize (debounced)
   * - on orientation change
   * - on font readiness
   * - on container resize via ResizeObserver
   */
  const measureLayout = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller && !useWindowScroll) return;

    const root = scroller || document;
    const wrappers = Array.from(root.querySelectorAll('.scroll-stack-card-wrapper'));
    const cards = Array.from(root.querySelectorAll('.scroll-stack-card'));
    wrappersRef.current = wrappers;
    cardsRef.current = cards;

    const scrollY = getScrollPosition();
    const containerHeight = useWindowScroll
      ? window.innerHeight
      : scroller?.clientHeight || window.innerHeight;

    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = scroller?.querySelector('.scroll-stack-end');
    let endElementTop = 0;
    if (endElement) {
      const endRect = endElement.getBoundingClientRect();
      endElementTop = endRect.top + scrollY;
    }

    // Measure the static top offset of each wrapper in document space
    const elementsToMeasure = wrappers.length > 0 ? wrappers : cards;
    const cardOffsets = elementsToMeasure.map((el, i) => {
      if (useWindowScroll) {
        const rect = el.getBoundingClientRect();
        // If measuring card directly, compensate for any existing translation
        const currentY = wrappers.length > 0 ? 0 : (lastTransformsRef.current.get(i)?.translateY || 0);
        return rect.top + scrollY - currentY;
      }
      return el.offsetTop;
    });

    const isReduced = isReducedMotion();
    const isLowEnd = isLowEndDevice() || isMobileDevice();

    // Pre-calculate all pin and trigger boundaries per card to eliminate repetitive calculations in frame
    const cardPins = cardOffsets.map((cardTop, i) => {
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = triggerStart;
      const pinEnd = endElementTop ? endElementTop - containerHeight * 0.7 : pinStart + 1200;
      return {
        cardTop,
        triggerStart,
        triggerEnd,
        pinStart,
        pinEnd,
        stackOffset: stackPositionPx + itemStackDistance * i,
      };
    });

    cachedLayoutRef.current = {
      cardPins,
      containerHeight,
      isReduced,
      isLowEnd,
    };
  }, [useWindowScroll, stackPosition, scaleEndPosition, itemStackDistance]);

  /**
   * Update Card Transforms
   * Executes synchronously inside the unified Master RAF Loop (GSAP Ticker -> Lenis)
   * GUARANTEES:
   * 1. ZERO DOM measurements (no getBoundingClientRect, no window.scrollY, no offsetTop).
   * 2. Pure numerical transformations based on the passed-in scroll position.
   * 3. GPU composited transform style writes only when delta exceeds epsilon.
   */
  const updateCardTransforms = useCallback((scrollVal) => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const {
      cardPins,
      isReduced,
      isLowEnd,
    } = cachedLayoutRef.current;

    // Fast path for reduced motion: render static unscaled cards
    if (isReduced) {
      cards.forEach((card) => {
        if (!card) return;
        card.style.transform = 'none';
        card.style.webkitTransform = 'none';
        card.style.filter = '';
      });
      return;
    }

    const scrollTop = typeof scrollVal === 'number' ? scrollVal : getScrollPosition();
    const totalCards = cards.length;

    for (let i = 0; i < totalCards; i++) {
      const card = cards[i];
      if (!card) continue;

      const pinConfig = cardPins[i];
      if (!pinConfig) continue;

      const { cardTop, triggerStart, triggerEnd, pinStart, pinEnd, stackOffset } = pinConfig;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      // Subtle, safe blur capped to 1.5px and disabled on low-end/mobile devices
      let blur = 0;
      if (blurAmount > 0 && !isLowEnd) {
        let topCardIndex = 0;
        for (let j = 0; j < totalCards; j++) {
          const jPin = cardPins[j];
          if (jPin && scrollTop >= jPin.triggerStart) {
            topCardIndex = j;
          }
        }
        if (i < topCardIndex) {
          const depth = topCardIndex - i;
          blur = Math.min(depth * blurAmount, 1.5);
        }
      }

      let translateY = 0;
      if (pinEnd > pinStart) {
        if (scrollTop >= pinStart && scrollTop <= pinEnd) {
          translateY = scrollTop - cardTop + stackOffset;
        } else if (scrollTop > pinEnd) {
          translateY = pinEnd - cardTop + stackOffset;
        }
      }

      const newTransform = {
        translateY: Math.round(translateY * 10) / 10,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 10) / 10
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.05 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        card.style.webkitTransform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === totalCards - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    }
  }, [
    baseScale,
    itemScale,
    rotationAmount,
    blurAmount,
    onStackComplete
  ]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller && !useWindowScroll) return;

    measureLayout();

    const root = scroller || document;
    const wrappers = Array.from(root.querySelectorAll('.scroll-stack-card-wrapper'));
    const cards = Array.from(root.querySelectorAll('.scroll-stack-card'));

    wrappersRef.current = wrappers;
    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    // Apply spacing to static wrappers in normal document flow
    const elementsToSpace = wrappers.length > 0 ? wrappers : cards;
    elementsToSpace.forEach((el, i) => {
      if (i < elementsToSpace.length - 1) {
        el.style.marginBottom = `${itemDistance}px`;
      }
    });

    cards.forEach(card => {
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.perspective = '1000px';
      card.style.webkitPerspective = '1000px';
      if (scaleDuration) {
        card.style.transition = `box-shadow 0.3s ease`;
      }
    });

    // Resize/Layout observer strictly outside the scroll tick
    let resizeTimer = null;
    const handleLayoutChange = () => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        measureLayout();
        updateCardTransforms(getScrollPosition());
      });
    };

    window.addEventListener('resize', handleLayoutChange, { passive: true });
    window.addEventListener('orientationchange', handleLayoutChange, { passive: true });

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && scroller) {
      resizeObserver = new ResizeObserver(() => {
        handleLayoutChange();
      });
      resizeObserver.observe(scroller);
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(handleLayoutChange);
    }

    // Connect directly to the consolidated Master Scroll Manager
    // Zero separate RAF loops!
    const unsubscribe = subscribeToScroll(({ scroll }) => {
      updateCardTransforms(scroll);
    });

    return () => {
      if (resizeTimer) {
        cancelAnimationFrame(resizeTimer);
      }
      unsubscribe();
      window.removeEventListener('resize', handleLayoutChange);
      window.removeEventListener('orientationchange', handleLayoutChange);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      wrappersRef.current = [];
      transformsCache.clear();
    };
  }, [
    itemDistance,
    scaleDuration,
    useWindowScroll,
    measureLayout,
    updateCardTransforms
  ]);

  return (
    <div
      className={`scroll-stack-scroller ${useWindowScroll ? 'use-window-scroll' : ''} ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
