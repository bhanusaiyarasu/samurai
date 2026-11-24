import React, { useEffect, useRef } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { useDeviceFallback } from '../../hooks/useDeviceFallback';

export default function ManifestoAtmosphere() {
  const isTouchOrReducedMotion = useDeviceFallback();
  const atmosphereRef = useRef(null);
  const particlesRef = useRef([]);
  const dimsRef = useRef({ width: 0, height: 0 });

  // Mouse coordinate tracking for Parallax (max 8px)
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentParallax = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isTouchOrReducedMotion) return;

    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // Normalize mouse offset to [-1, 1] and scale to max 8px
      mouseRef.current.x = ((e.clientX - centerX) / centerX) * 8;
      mouseRef.current.y = ((e.clientY - centerY) / centerY) * 8;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTouchOrReducedMotion]);

  // RequestAnimationFrame loop for mouse parallax lerp
  useEffect(() => {
    let animFrameId;

    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    const updateParallax = () => {
      if (atmosphereRef.current) {
        // Smoothly lerp towards target mouse offset
        currentParallax.current.x = lerp(currentParallax.current.x, mouseRef.current.x, 0.08);
        currentParallax.current.y = lerp(currentParallax.current.y, mouseRef.current.y, 0.08);

        // Apply translate3d for GPU-accelerated rendering
        atmosphereRef.current.style.transform = `translate3d(${currentParallax.current.x}px, ${currentParallax.current.y}px, 0)`;
      }
      animFrameId = requestAnimationFrame(updateParallax);
    };

    animFrameId = requestAnimationFrame(updateParallax);
    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  // Initialize embers
  const initParticles = (width, height) => {
    // 40 to 50 particles (LOCKED count: 45)
    const count = isTouchOrReducedMotion ? 20 : 45;
    const list = [];
    for (let i = 0; i < count; i++) {
      const vx = (Math.random() - 0.5) * 0.1;
      const vy = -0.12 - Math.random() * 0.28; // slow upward float
      list.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx,
        vy,
        size: 0.8 + Math.random() * 1.5,
        alpha: 0.22 + Math.random() * 0.48,
        oscillateSpeed: 0.003 + Math.random() * 0.006,
        oscillateOffset: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = list;
    dimsRef.current = { width, height };
  };

  // Canvas drawing loop callback
  const draw = (ctx, frameCount, timestamp, dpr) => {
    const canvas = ctx.canvas;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    if (dimsRef.current.width !== width || dimsRef.current.height !== height) {
      initParticles(width, height);
    }

    ctx.clearRect(0, 0, width, height);

    const particles = particlesRef.current;
    
    // Draw particles
    particles.forEach((p) => {
      // Horizontal wave movement mimicking drafts
      const wave = Math.sin(frameCount * p.oscillateSpeed + p.oscillateOffset) * 0.06;
      p.x += p.vx + wave;
      p.y += p.vy;

      // Wrapping bounds checks
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }

      ctx.fillStyle = `rgba(243, 22, 41, ${p.alpha})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(243, 22, 41, 0.45)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Reset shadow blur to keep drawing clean and performant
    ctx.shadowBlur = 0;
  };

  const { canvasRef } = useCanvas(draw);

  return (
    <div ref={atmosphereRef} className="manifesto-atmosphere">
      {/* Layer 2: Subtle Noise Overlay */}
      <div className="manifesto-noise" />

      {/* Layer 3: Large Drifting Orange Fog Gradient */}
      <div className="manifesto-fog" />

      {/* Layer 4: Floating Orange Embers Canvas */}
      <div className="manifesto-particles-container">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* Cinematic dark vignette frame */}
      <div className="manifesto-vignette" />
    </div>
  );
}
