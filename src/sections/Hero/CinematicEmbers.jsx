import React, { useRef, useEffect, useMemo } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { useDeviceFallback } from '../../hooks/useDeviceFallback';

export default function CinematicEmbers() {
  const isTouchOrReducedMotion = useDeviceFallback();
  const embersRef = useRef([]);
  const timeRef = useRef(0);

  // Initialize embers with varied trajectories
  const initEmbers = (width, height) => {
    const count = isTouchOrReducedMotion ? 20 : 45;
    const embers = [];

    for (let i = 0; i < count; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.05 - Math.random() * 0.1, // slow upward drift
        size: 0.5 + Math.random() * 2.5,
        intensity: 0.3 + Math.random() * 0.7,
        lifetime: 0,
        maxLifetime: 300 + Math.random() * 200,
        wobbleSpeed: 0.03 + Math.random() * 0.07,
        wobbleAmount: 0.5 + Math.random() * 1.5,
      });
    }

    embersRef.current = embers;
  };

  const draw = (ctx, frameCount, timestamp, dpr) => {
    const canvas = ctx.canvas;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    if (embersRef.current.length === 0) {
      initEmbers(width, height);
    }

    ctx.clearRect(0, 0, width, height);

    timeRef.current += frameCount;
    const embers = embersRef.current;

    embers.forEach((ember, idx) => {
      // Update position
      const wobble = Math.sin(timeRef.current * ember.wobbleSpeed + idx) * ember.wobbleAmount;
      ember.x += ember.vx + wobble * 0.01;
      ember.y += ember.vy;
      ember.lifetime++;

      // Reset if off-screen or lifetime exceeded
      if (
        ember.x < -20 ||
        ember.x > width + 20 ||
        ember.y < -20 ||
        ember.lifetime > ember.maxLifetime
      ) {
        ember.x = Math.random() * width;
        ember.y = height + 10;
        ember.lifetime = 0;
      }

      // Calculate fade based on lifetime (brightest in middle)
      const lifetimeRatio = ember.lifetime / ember.maxLifetime;
      const fadeCurve =
        lifetimeRatio < 0.3
          ? lifetimeRatio / 0.3 // fade in first 30%
          : lifetimeRatio > 0.8
            ? (1 - lifetimeRatio) / 0.2 // fade out last 20%
            : 1; // full brightness in middle

      const opacity = ember.intensity * fadeCurve;

      // Draw glowing ember
      const grad = ctx.createRadialGradient(ember.x, ember.y, 0, ember.x, ember.y, ember.size * 3);
      grad.addColorStop(0, `hsla(355, 95%, 55%, ${opacity * 0.9})`);
      grad.addColorStop(0.4, `hsla(355, 90%, 45%, ${opacity * 0.6})`);
      grad.addColorStop(0.8, `hsla(350, 85%, 30%, ${opacity * 0.2})`);
      grad.addColorStop(1, 'rgba(30, 10, 12, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ember.x, ember.y, ember.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright core
      ctx.fillStyle = `hsla(355, 100%, 65%, ${opacity})`;
      ctx.beginPath();
      ctx.arc(ember.x, ember.y, ember.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  return (
    <canvas
      ref={useCanvas(draw, false, true)}
      className="hero-embers"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
