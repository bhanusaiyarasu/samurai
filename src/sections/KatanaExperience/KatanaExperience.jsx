import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import KatanaRainCanvas from './components/KatanaRainCanvas';
import KatanaBackgroundText from './components/KatanaBackgroundText';
import KatanaCenterText from './components/KatanaCenterText';
import './KatanaExperience.css';

gsap.registerPlugin(ScrollTrigger);

// 119 frames from frame_0056.webp to frame_0174.webp
const START_FRAME = 56;
const END_FRAME = 174;
const TOTAL_FRAMES = END_FRAME - START_FRAME + 1; // 119

const getFramePath = (index) => {
  const frameNum = START_FRAME + index;
  const pad = String(frameNum).padStart(4, '0');
  return `/frames/frame_${pad}.webp`;
};

export default function KatanaExperience() {
  const containerRef = useRef(null);
  const pinTargetRef = useRef(null);
  const canvasRef = useRef(null);
  const lineRef = useRef(null);
  const stageRef = useRef(null);
  const textContainerRef = useRef(null);
  const centerTextRef = useRef(null);

  // Animation & Rendering refs
  const imagesRef = useRef([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // 1. High-Performance Frame Preloading into Memory
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
      };
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
      imagesRef.current = [];
    };
  }, []);

  // 2. High-DPI Canvas Draw with 3D Center & Contain Scaling
  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const safeIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex)));
    const img = imagesRef.current[safeIndex];

    if (img && img.complete && img.naturalWidth !== 0) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 16:9 aspect ratio scaling to fit comfortably with cinematic presence
      const imgW = img.naturalWidth || 1280;
      const imgH = img.naturalHeight || 720;
      const imgRatio = imgW / imgH;
      const canvasRatio = w / h;

      let drawW, drawH;
      if (canvasRatio > imgRatio) {
        // Wider screen: scale by height with modest upscale for depth
        drawH = h * 0.95;
        drawW = drawH * imgRatio;
      } else {
        // Narrow/mobile: scale by width
        drawW = w * 0.95;
        drawH = drawW / imgRatio;
      }

      const drawX = (w - drawW) / 2;
      const drawY = (h - drawH) / 2;

      // Solid obsidian backing directly behind the sword column (ensures 100% opacity against background text)
      ctx.fillStyle = '#050505';
      ctx.fillRect(drawX + drawW * 0.44, 0, drawW * 0.12, h);

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }

    ctx.restore();
  };

  // 3. Smooth Interpolation Loop (Decoupled RAF for ultra-fluid 60-120fps scrubbing)
  useEffect(() => {
    let lastRenderedFrame = -1;

    const tick = () => {
      // Snappy and buttery-smooth lerp toward target frame
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.005) {
        currentFrameRef.current += diff * 0.35; // Fast, responsive, and smooth
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const roundedFrame = Math.round(currentFrameRef.current);
      if (roundedFrame !== lastRenderedFrame) {
        lastRenderedFrame = roundedFrame;
        drawFrame(roundedFrame);
      }

      // Smooth progress lerp for background and center typography
      const progressDiff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(progressDiff) > 0.0005) {
        currentProgressRef.current += progressDiff * 0.35;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }
      const p = currentProgressRef.current;

      // Smooth mouse parallax lerp for 3D tilt
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.1;
      m.y += (m.targetY - m.y) * 0.1;

      // 3A. Update background text track horizontal positions word-by-word with micro-shake and tilt
      if (textContainerRef.current) {
        const trackTop = textContainerRef.current.querySelector('.track-top');
        const trackMiddle = textContainerRef.current.querySelector('.track-middle');
        const trackBottom = textContainerRef.current.querySelector('.track-bottom');

        const waveY = Math.sin(p * Math.PI * 5) * 12;
        const tiltZ = Math.sin(p * Math.PI * 4) * 1.5;

        if (trackTop) {
          const shiftTop = -p * 35;
          trackTop.style.transform = `translate3d(${shiftTop}%, ${waveY}px, 0) rotate(${tiltZ}deg)`;
        }

        if (trackMiddle) {
          const shiftMiddle = 4 - p * 28;
          trackMiddle.style.transform = `translate3d(${shiftMiddle}%, ${-waveY * 0.8}px, 0) rotate(${-tiltZ * 0.8}deg)`;
        }

        if (trackBottom) {
          const shiftBottom = -p * 22;
          trackBottom.style.transform = `translate3d(${shiftBottom}%, ${waveY * 0.5}px, 0)`;
        }

        const textTiltX = -m.y * 2.5;
        const textTiltY = m.x * 3.5;
        textContainerRef.current.style.transform = `perspective(1000px) rotateX(${textTiltX.toFixed(2)}deg) rotateY(${textTiltY.toFixed(2)}deg)`;
      }

      // 3B. Update Center Statement Lines (Scroll-driven: pop from bottom, center, float up & disappear)
      if (centerTextRef.current) {
        const lineEls = centerTextRef.current.children;
        const N = lineEls.length;
        for (let i = 0; i < N; i++) {
          const center = (i + 0.5) / N;
          const delta = (p - center) * N;

          let translateY = 0;
          let opacity = 0;

          if (delta < -1.0) {
            translateY = 110;
            opacity = 0;
          } else if (delta < -0.2) {
            const t = (delta - (-1.0)) / 0.8;
            translateY = (1 - t) * 110;
            opacity = t;
          } else if (delta <= 0.2) {
            translateY = 0;
            opacity = 1;
          } else if (delta <= 1.0) {
            const t = (delta - 0.2) / 0.8;
            translateY = -t * 110;
            opacity = 1 - t;
          } else {
            translateY = -110;
            opacity = 0;
          }

          const el = lineEls[i];
          if (el) {
            el.style.transform = `translate3d(0, ${translateY.toFixed(1)}%, 0)`;
            el.style.opacity = opacity.toFixed(3);
          }
        }
      }

      // 3C. Katana 3D stage parallax tilt
      if (stageRef.current) {
        const tiltX = -m.y * 3.5;
        const tiltY = m.x * 5;
        const moveX = m.x * 12;
        const moveY = m.y * 8;
        stageRef.current.style.transform = `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0)`;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 4. Mouse Interactive Parallax Tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 5. GSAP ScrollTrigger Integration
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 5A. Transition line slash (handoff from Manifesto exit light)
      gsap.set(lineRef.current, {
        height: '280px',
        scaleX: 0.25,
        rotation: 0,
        opacity: 1,
      });

      const transitionTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: 0.8,
        },
      });

      transitionTl
        .to(lineRef.current, {
          rotation: 45,
          scaleX: 1.5,
          height: '420px',
          duration: 1.5,
          ease: 'power2.inOut',
        })
        .to(lineRef.current, {
          scaleX: 0,
          scaleY: 0,
          opacity: 0,
          duration: 1.0,
          ease: 'power3.in',
        });

      // 5B. Smooth & Fast Frame Sequence Scrubbing on Pinned Stage
      ScrollTrigger.create({
        trigger: pinTargetRef.current,
        start: 'top top',
        end: '+=220%', // Generous distance for all 7 poetic lines to cycle comfortably
        pin: true,
        scrub: 0.35, // Responsive scrub with just enough inertial smoothing
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          targetFrameRef.current = self.progress * (TOTAL_FRAMES - 1);
          targetProgressRef.current = self.progress;
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="katana-experience-section" id="katana-experience">
      {/* Seamless transition line target from Manifesto */}
      <div ref={lineRef} className="katana-transition-line" />

      {/* Pinned 3D Stage Container */}
      <div ref={pinTargetRef} className="katana-pin-stage">
        {/* Layer 1 (Back): 3-Tier Scroll-Driven Background Typography */}
        <KatanaBackgroundText ref={textContainerRef} />

        {/* Layer 2: Falling Raindrops & Floor Bounce Simulation Canvas */}
        <KatanaRainCanvas />

        {/* Layer 3 (Middle): 3D Interactive Katana Frame Canvas */}
        <div ref={stageRef} className="katana-3d-stage">
          <canvas ref={canvasRef} className="katana-frame-canvas" />
        </div>

        {/* Layer 4 (Front): Center Poetic Statements (Masked line-by-line reveal in front) */}
        <KatanaCenterText ref={centerTextRef} />

        {/* Edge Vignette Dissolve */}
        <div className="katana-vignette-linear-top" />
        <div className="katana-vignette-linear-bottom" />
      </div>
    </section>
  );
}
