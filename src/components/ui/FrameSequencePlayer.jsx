import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reusable high-performance Frame Sequence Player using HTML5 Canvas.
 * Optimized for large sequences (200-500+ frames) using a sliding memory cache window.
 */
export default function FrameSequencePlayer({
  frameFolder = '/frames',
  framePrefix = 'frame_',
  frameExtension = 'webp',
  totalFrames = 0, // 0 triggers auto-detection
  scrollDistance = '300vh',
  title = 'FRAME SEQUENCE TEST',
  className = '',
  bufferAhead = 25,  // Number of frames to cache ahead of current index
  bufferBehind = 10, // Number of frames to cache behind current index
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rafIdRef = useRef(null);
  const currentFrameRef = useRef(0);
  const scrollTriggerRef = useRef(null);

  // Memory Cache Map: index -> HTMLImageElement
  const imageCacheRef = useRef({});
  const loadingQueueRef = useRef(new Set()); // Tracks active loads to prevent duplication

  const [detectedTotalFrames, setDetectedTotalFrames] = useState(totalFrames);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Helper to format frame filename paths
  const getFramePath = (index) => {
    const pad = (num, size) => {
      let s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    };
    // Frames are 1-indexed in file naming sequence (e.g. frame_0001)
    const fileIndex = index + 1;
    return `${frameFolder}/${framePrefix}${pad(fileIndex, 4)}.${frameExtension}`;
  };

  // 1. Auto-detection flow (only if totalFrames is not provided)
  useEffect(() => {
    if (totalFrames > 0) {
      setDetectedTotalFrames(totalFrames);
      setIsLoaded(true);
      return;
    }

    let checkIndex = 0;
    let isCancelled = false;

    const probeNextFrame = () => {
      if (isCancelled) return;

      const img = new Image();
      img.src = getFramePath(checkIndex);

      img.onload = () => {
        if (isCancelled) return;
        checkIndex++;
        setLoadProgress(checkIndex);
        probeNextFrame();
      };

      img.onerror = () => {
        if (isCancelled) return;
        if (checkIndex > 0) {
          setDetectedTotalFrames(checkIndex);
          setIsLoaded(true);
        } else {
          console.error(`FrameSequencePlayer: No frames found in ${frameFolder}`);
        }
      };
    };

    probeNextFrame();

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, frameFolder, framePrefix, frameExtension]);

  // 2. High-performance canvas drawing logic
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Adjust canvas resolution dynamically
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = imageCacheRef.current[currentFrameRef.current];
    if (img && img.complete && img.naturalWidth !== 0) {
      // Scale ratio to cover the viewport fully (object-fit: cover logic)
      const r = Math.max((w * dpr) / img.width, (h * dpr) / img.height);
      const finalWidth = img.width * r;
      const finalHeight = img.height * r;

      // Center the image boundaries symmetrically
      const cx = (w * dpr - finalWidth) / 2;
      const cy = (h * dpr - finalHeight) / 2;

      ctx.drawImage(img, cx, cy, finalWidth, finalHeight);
    }
  };

  // 3. Virtualized Memory cache slider (lazy-loads sliding window and releases outside memory)
  const updateCacheWindow = (currentIndex) => {
    if (detectedTotalFrames === 0) return;

    const startRange = Math.max(0, currentIndex - bufferBehind);
    const endRange = Math.min(detectedTotalFrames - 1, currentIndex + bufferAhead);

    // Step A: Load frames inside the active cache window
    for (let i = startRange; i <= endRange; i++) {
      if (!imageCacheRef.current[i] && !loadingQueueRef.current.has(i)) {
        loadingQueueRef.current.add(i);
        const img = new Image();
        img.src = getFramePath(i);
        img.onload = () => {
          imageCacheRef.current[i] = img;
          loadingQueueRef.current.delete(i);
          // If this frame is the current frame, render immediately
          if (i === currentFrameRef.current) {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = requestAnimationFrame(renderCanvas);
          }
        };
        img.onerror = () => {
          loadingQueueRef.current.delete(i);
        };
      }
    }

    // Step B: Purge outside frames to prevent GPU/RAM memory leaks
    Object.keys(imageCacheRef.current).forEach((key) => {
      const idx = parseInt(key, 10);
      if (idx < startRange || idx > endRange) {
        const img = imageCacheRef.current[idx];
        if (img) {
          img.onload = null;
          img.onerror = null;
          img.src = ''; // De-allocates image from browser cache
        }
        delete imageCacheRef.current[idx];
      }
    });
  };

  // 4. Initial preloading of the starting window to avoid flashing on entry
  useEffect(() => {
    if (!isLoaded || detectedTotalFrames === 0) return;
    
    // Warm up cache around index 0
    updateCacheWindow(0);
    renderCanvas();

    window.addEventListener('resize', renderCanvas);

    return () => {
      window.removeEventListener('resize', renderCanvas);
    };
  }, [isLoaded, detectedTotalFrames]);

  // 5. ScrollTrigger hook with virtualized sliding window triggers
  useEffect(() => {
    if (!isLoaded || detectedTotalFrames === 0) return;

    const ctx = gsap.context(() => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.floor(self.progress * (detectedTotalFrames - 1));
          if (idx !== currentFrameRef.current) {
            currentFrameRef.current = idx;
            // Slide the memory cache window
            updateCacheWindow(idx);
            
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = requestAnimationFrame(renderCanvas);
          }
        },
      });
    }, containerRef);

    // 6. Complete Memory Cleanup on Unmount
    return () => {
      ctx.revert();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      // Clean all image references and paths to release memory
      Object.keys(imageCacheRef.current).forEach((key) => {
        const img = imageCacheRef.current[key];
        if (img) {
          img.onload = null;
          img.onerror = null;
          img.src = '';
        }
      });
      imageCacheRef.current = {};
      loadingQueueRef.current.clear();
    };
  }, [isLoaded, detectedTotalFrames, scrollDistance]);

  return (
    <div ref={containerRef} className={`frame-sequence-player ${className}`}>
      {!isLoaded ? (
        <div className="frame-sequence-loading">
          <span className="loading-title">PRELOADING FRAMES</span>
          <span className="loading-counter">Loaded {loadProgress} frames...</span>
        </div>
      ) : (
        <>
          {title && <h2 className="frame-sequence-title">{title}</h2>}
          <canvas ref={canvasRef} className="frame-sequence-canvas" />
        </>
      )}
    </div>
  );
}
