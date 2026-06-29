import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * useCanvas - A production-grade, highly optimized React hook for HTML5 Canvas engines.
 * Manages requestAnimationFrame cycles, starting/stopping loops, window resizes, and High-DPI (Retina) screen scaling.
 *
 * @param {Function} draw - The animation loop callback: (context, frameCount, timestamp, dpr)
 * @param {Object} options - Optional configuration parameters
 * @param {boolean} [options.autoStart=true] - Whether the animation loop starts automatically
 * @param {Function} [options.onResize] - Custom callback fired immediately after a canvas resize event: (canvas, context, dpr)
 * @returns {Object} { canvasRef, start, stop, isRunning }
 */
export function useCanvas(draw, options = {}) {
  const { autoStart = true, onResize } = options;
  
  const canvasRef = useRef(null);
  const drawRef = useRef(draw);
  const onResizeRef = useRef(onResize);
  const animationIdRef = useRef(null);
  const frameCountRef = useRef(0);
  const isRunningRef = useRef(autoStart);
  
  const [isRunning, setIsRunning] = useState(autoStart);

  // Keep draw and onResize refs fresh to prevent restarting loop on consumer re-renders
  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    onResizeRef.current = onResize;
  }, [onResize]);

  /**
   * Resizes the canvas to match its client dimensions, accounts for window.devicePixelRatio
   */
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    // Only update canvas dimensions if client bounds have changed
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      // Reset transform and scale to normalize high-DPI scaling
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (onResizeRef.current) {
        onResizeRef.current(canvas, ctx, dpr);
      }
    }
  }, []);

  /**
   * Main requestAnimationFrame render loop
   */
  const render = useCallback((timestamp) => {
    if (!isRunningRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    frameCountRef.current += 1;

    // Execute drawing callback
    if (drawRef.current) {
      drawRef.current(ctx, frameCountRef.current, timestamp, dpr);
    }

    animationIdRef.current = requestAnimationFrame(render);
  }, []);

  /**
   * Starts the animation loop if it is currently stopped
   */
  const start = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setIsRunning(true);
    animationIdRef.current = requestAnimationFrame(render);
  }, [render]);

  /**
   * Cancels the active animation frame and stops the loop
   */
  const stop = useCallback(() => {
    if (!isRunningRef.current) return;
    isRunningRef.current = false;
    setIsRunning(false);
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  }, []);

  // Set up resize tracking and start the initial render loop
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    if (autoStart) {
      isRunningRef.current = true;
      setIsRunning(true);
      animationIdRef.current = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [autoStart, handleResize, render]);

  return {
    canvasRef,
    start,
    stop,
    isRunning,
  };
}
