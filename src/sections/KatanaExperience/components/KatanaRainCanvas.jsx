import React, { useEffect, useRef } from 'react';

/**
 * High-performance 60/120 FPS Raindrop & Floor-Bounce Physics Canvas
 * Drops fall with gravity, hit the bottom boundary, bounce upward in micro-splash arcs,
 * expand subtle ripples, and reset.
 */
export default function KatanaRainCanvas() {
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    // 1. Raindrop Pool (70 drops)
    const DROP_COUNT = 70;
    const drops = [];
    for (let i = 0; i < DROP_COUNT; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        length: Math.random() * 10 + 12, // 12-22px
        speed: Math.random() * 8 + 15,   // 15-23px/frame
        opacity: Math.random() * 0.3 + 0.25, // 0.25-0.55
        thickness: Math.random() * 0.4 + 1.0, // 1.0-1.4px
      });
    }

    // 2. Micro-Splash Droplet Pool (120 particles)
    const MAX_SPLASHES = 120;
    const splashes = [];
    for (let i = 0; i < MAX_SPLASHES; i++) {
      splashes.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: 1,
        alpha: 0,
        decay: 0.05,
      });
    }

    const spawnSplash = (x, y) => {
      const count = Math.floor(Math.random() * 2) + 2; // 2-3 bouncing micro-droplets
      let spawned = 0;
      for (let i = 0; i < MAX_SPLASHES && spawned < count; i++) {
        const s = splashes[i];
        if (!s.active) {
          s.active = true;
          s.x = x + (Math.random() - 0.5) * 6;
          s.y = y;
          s.vx = (Math.random() - 0.5) * 4.5;       // horizontal burst
          s.vy = -(Math.random() * 3.5 + 2.5);      // bounce UP
          s.radius = Math.random() * 0.7 + 0.8;     // tiny particle
          s.alpha = Math.random() * 0.3 + 0.5;      // opacity
          s.decay = Math.random() * 0.035 + 0.04;   // fade rate
          spawned++;
        }
      }
    };

    // 3. Floor Ripples Pool (35 ripples)
    const MAX_RIPPLES = 35;
    const ripples = [];
    for (let i = 0; i < MAX_RIPPLES; i++) {
      ripples.push({
        active: false,
        x: 0,
        y: 0,
        r: 1,
        maxR: 12,
        alpha: 0,
      });
    }

    const spawnRipple = (x, y) => {
      for (let i = 0; i < MAX_RIPPLES; i++) {
        const r = ripples[i];
        if (!r.active) {
          r.active = true;
          r.x = x;
          r.y = y;
          r.r = 1;
          r.maxR = Math.random() * 6 + 8; // 8-14px spread
          r.alpha = 0.45;
          break;
        }
      }
    };

    // 4. Animation Loop
    const render = () => {
      if (!isVisibleRef.current) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Floor impact boundary (at ~88% of screen height)
      const floorY = height * 0.88;

      // Update & Draw Raindrops
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        d.y += d.speed;

        // Check floor impact
        if (d.y >= floorY) {
          spawnSplash(d.x, floorY);
          spawnRipple(d.x, floorY);
          // Reset drop back to top
          d.y = -d.length - Math.random() * 80;
          d.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.strokeStyle = `rgba(215, 230, 255, ${d.opacity})`;
        ctx.lineWidth = d.thickness;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.length);
        ctx.stroke();
      }

      // Update & Draw Bouncing Micro-Splash Particles
      const gravity = 0.28;
      for (let i = 0; i < MAX_SPLASHES; i++) {
        const s = splashes[i];
        if (s.active) {
          s.x += s.vx;
          s.y += s.vy;
          s.vy += gravity; // curve back down under gravity
          s.alpha -= s.decay;

          if (s.alpha <= 0 || s.y > floorY + 15) {
            s.active = false;
          } else {
            ctx.beginPath();
            ctx.fillStyle = `rgba(225, 235, 255, ${s.alpha})`;
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Update & Draw Floor Ripples (Perspective Ellipses)
      for (let i = 0; i < MAX_RIPPLES; i++) {
        const r = ripples[i];
        if (r.active) {
          r.r += 0.55;
          r.alpha -= 0.025;

          if (r.alpha <= 0 || r.r >= r.maxR) {
            r.active = false;
          } else {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(215, 230, 255, ${r.alpha})`;
            ctx.lineWidth = 0.8;
            ctx.ellipse(r.x, r.y, r.r, r.r * 0.28, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      ctx.restore();
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    // Pause canvas if section is scrolled out of viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="katana-rain-canvas" />;
}
