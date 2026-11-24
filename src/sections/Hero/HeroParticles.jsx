import React, { useEffect, useRef } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { useDeviceFallback } from '../../hooks/useDeviceFallback';

export default function HeroParticles() {
  const isTouchOrReducedMotion = useDeviceFallback();
  
  // Track cursor position in refs to avoid component re-renders
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef([]);
  const dimsRef = useRef({ width: 0, height: 0 });

  // Monitor cursor coordinates
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Initialize particles once canvas bounds are established
  const initParticles = (width, height) => {
    const count = isTouchOrReducedMotion ? 25 : 60;
    const list = [];
    for (let i = 0; i < count; i++) {
      const vx = (Math.random() - 0.5) * 0.25;
      const vy = -0.3 - Math.random() * 0.6; // slow upward drift
      list.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: vx,
        vy: vy,
        baseVx: vx,
        baseVy: vy,
        size: 1 + Math.random() * 1.8,
        alpha: 0.12 + Math.random() * 0.28,
        // Small oscillation factor for float variation
        oscillateSpeed: 0.005 + Math.random() * 0.01,
        oscillateOffset: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = list;
    dimsRef.current = { width, height };
  };

  const draw = (ctx, frameCount, timestamp, dpr) => {
    const canvas = ctx.canvas;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Check if initialization or screen resize occurred
    if (dimsRef.current.width !== width || dimsRef.current.height !== height) {
      initParticles(width, height);
    }

    ctx.clearRect(0, 0, width, height);

    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    const repulsionRadius = 110;
    const forceStrength = 0.8;

    particles.forEach((p) => {
      // 1. Cursor Repulsion Physics (Skip if touch fallback active)
      if (!isTouchOrReducedMotion && mouse.x !== -9999) {
        // Calculate distance from cursor
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < repulsionRadius) {
          // Calculate normalized push direction
          const dirX = dx / (dist || 1);
          const dirY = dy / (dist || 1);
          
          // Force scales inversely with distance (stronger when closer)
          const force = (repulsionRadius - dist) / repulsionRadius;
          
          // Apply repulsion force to velocity
          p.vx += dirX * force * forceStrength;
          p.vy += dirY * force * forceStrength;
        }
      }

      // 2. Slow Dampening/Return to Base Speed
      p.vx += (p.baseVx - p.vx) * 0.06;
      p.vy += (p.baseVy - p.vy) * 0.06;

      // Add a tiny sine horizontal wave over time to look like dust floating
      const wave = Math.sin(frameCount * p.oscillateSpeed + p.oscillateOffset) * 0.05;
      
      // Update coordinates
      p.x += p.vx + wave;
      p.y += p.vy;

      // 3. Bound Wrapping
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
        p.vx = p.baseVx;
        p.vy = p.baseVy;
      }
      if (p.y > height + 10) {
        p.y = -10;
        p.x = Math.random() * width;
      }

      // 4. Draw Particle
      ctx.fillStyle = `rgba(243, 22, 41, ${p.alpha})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(243, 22, 41, 0.4)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset canvas shadow blur for efficiency
    });
  };

  const { canvasRef } = useCanvas(draw);

  return (
    <canvas 
      ref={canvasRef} 
      className="particles-canvas"
      style={{ width: '100%', height: '100%', display: 'block' }} 
    />
  );
}
