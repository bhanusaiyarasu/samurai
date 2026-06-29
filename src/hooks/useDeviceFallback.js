import { useState, useEffect } from 'react';

export function useDeviceFallback() {
  const [isTouchOrReducedMotion, setIsTouchOrReducedMotion] = useState(false);

  useEffect(() => {
    const checkFallback = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return isTouch || prefersReducedMotion;
    };

    setIsTouchOrReducedMotion(checkFallback());

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e) => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchOrReducedMotion(isTouch || e.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);
    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return isTouchOrReducedMotion;
}
