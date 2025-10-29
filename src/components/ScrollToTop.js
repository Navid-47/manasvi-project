import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // UI visibility and states
  const [showControls, setShowControls] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  // refs for raf and direction for auto-scroll
  const rafIdRef = useRef(null);
  const autoDirRef = useRef(1); // 1 = down, -1 = up

  // Smooth scroll function using requestAnimationFrame
  const smoothScrollTo = (targetY, duration = 800) => {
    try {
      const startY = window.scrollY || window.pageYOffset;
      const delta = targetY - startY;
      const startTime = performance.now();

      const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(t);
        window.scrollTo(0, Math.round(startY + delta * eased));
        if (t < 1) {
          rafIdRef.current = requestAnimationFrame(step);
        }
      };

      cancelAnimationFrame(rafIdRef.current || 0);
      rafIdRef.current = requestAnimationFrame(step);
    } catch {
      window.scrollTo(0, targetY);
    }
  };

  const scrollToTop = () => smoothScrollTo(0, 800);
  const scrollToBottom = () => {
    const maxY = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    ) - window.innerHeight;
    smoothScrollTo(Math.max(0, maxY), 800);
  };

  // Auto-scroll slow mode (bounce top <-> bottom)
  const startAutoScroll = () => {
    if (isAutoScrolling) return;
    setIsAutoScrolling(true);

    const speed = 1.5; // pixels per frame (slow, smooth)
    const tick = () => {
      const maxY =
        Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        ) - window.innerHeight;

      const y = window.scrollY || window.pageYOffset;

      // Reverse at bounds
      if (y <= 0) autoDirRef.current = 1;
      else if (y >= maxY - 1) autoDirRef.current = -1;

      window.scrollTo(0, y + speed * autoDirRef.current);
      rafIdRef.current = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(rafIdRef.current || 0);
    rafIdRef.current = requestAnimationFrame(tick);
  };

  const stopAutoScroll = () => {
    setIsAutoScrolling(false);
    cancelAnimationFrame(rafIdRef.current || 0);
  };

  const toggleAutoScroll = () => {
    if (isAutoScrolling) stopAutoScroll();
    else startAutoScroll();
  };

  // On route change, scroll to top smoothly and stop auto-scroll
  useEffect(() => {
    stopAutoScroll();
    smoothScrollTo(0, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Show/hide controls based on scroll position, cleanup raf on unmount
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      setShowControls(y > 120);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initialize

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafIdRef.current || 0);
    };
  }, []);

  // Cycle behavior: if at top, go to bottom; otherwise go to top
  const handleCycleTopBottom = () => {
    const y = window.scrollY || window.pageYOffset;
    if (y < 10) {
      scrollToBottom();
    } else {
      scrollToTop();
    }
  };

  // Render floating controls
  return (
    <>
      {/* Hidden helper; actual scroll handled via effects and buttons */}
      <div aria-hidden="true" />

      {/* Floating controls */}
      <div
        className={`fixed right-4 bottom-4 z-50 transition-opacity duration-300 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-2">
          {/* Cycle Top/Bottom */}
          <button
            onClick={handleCycleTopBottom}
            className="rounded-full bg-brand text-white shadow-lg hover:bg-brand-dark transition-colors w-12 h-12 flex items-center justify-center text-lg"
            aria-label="Scroll to top or bottom"
            title="Top/Bottom"
          >
            ↕
          </button>

          {/* Auto scroll toggle */}
          <button
            onClick={toggleAutoScroll}
            className={`rounded-full ${
              isAutoScrolling ? 'bg-red-600' : 'bg-gray-800'
            } text-white shadow-lg hover:opacity-90 transition-opacity w-12 h-12 flex items-center justify-center text-sm font-semibold`}
            aria-label={isAutoScrolling ? 'Stop auto scroll' : 'Start auto scroll'}
            title={isAutoScrolling ? 'Stop auto scroll' : 'Start auto scroll'}
          >
            {isAutoScrolling ? '⏸' : '▶'}
          </button>

          {/* Scroll to bottom */}
          <button
            onClick={scrollToBottom}
            className="rounded-full bg-gray-700 text-white shadow-lg hover:bg-gray-900 transition-colors w-12 h-12 flex items-center justify-center text-lg"
            aria-label="Scroll to bottom"
            title="Bottom"
          >
            ⬇
          </button>
        </div>
      </div>
    </>
  );
};

export default ScrollToTop;