import React, { useRef, useEffect } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { useDeviceFallback } from '../../hooks/useDeviceFallback';

export default function CinematicClouds() {
  const isTouchOrReducedMotion = useDeviceFallback();
  const cloudRef = useRef([]);
  const timeRef = useRef(0);

  // Initialize cloud layers with Perlin-like noise simulation
  const initClouds = (width, height) => {
    const clouds = [];
    
    // Layer 1: Deep background clouds (very subtle)
    for (let i = 0; i < 4; i++) {
      clouds.push({
        y: height * (0.15 + Math.random() * 0.25),
        speed: 0.02 + Math.random() * 0.03,
        scale: 2.5 + Math.random() * 1.5,
        opacity: 0.08 + Math.random() * 0.12,
        hue: 18, // orange
        offset: Math.random() * Math.PI * 2,
      });
    }

    // Layer 2: Mid-range volumetric clouds
    for (let i = 0; i < 5; i++) {
      clouds.push({
        y: height * (0.25 + Math.random() * 0.4),
        speed: 0.008 + Math.random() * 0.02,
        scale: 1.8 + Math.random() * 1.2,
        opacity: 0.12 + Math.random() * 0.18,
        hue: 18,
        offset: Math.random() * Math.PI * 2,
      });
    }

    // Layer 3: Foreground volumetric mist
    for (let i = 0; i < 3; i++) {
      clouds.push({
        y: height * (0.5 + Math.random() * 0.3),
        speed: 0.005 + Math.random() * 0.015,
        scale: 1.2 + Math.random() * 0.8,
        opacity: 0.06 + Math.random() * 0.1,
        hue: 15, // deeper orange
        offset: Math.random() * Math.PI * 2,
      });
    }

    cloudRef.current = clouds;
  };

  // Perlin-like noise using sine waves
  const perlinNoise = (x, y, time) => {
    const n1 = Math.sin(x * 0.005 + time * 0.0003) * Math.sin(y * 0.003 + time * 0.0002);
    const n2 = Math.sin(x * 0.002 + time * 0.0001) * Math.cos(y * 0.001 + time * 0.00015);
    return (n1 + n2) * 0.5 + 0.5;
  };

  // Draw volumetric cloud shape
  const drawVolumetricCloud = (ctx, x, y, width, height, scale, opacity, hue, time) => {
    const cloudWidth = 400 * scale;
    const cloudHeight = 200 * scale;

    ctx.save();
    ctx.globalAlpha = opacity;

    // Multiple overlapping circles create volumetric effect
    const circles = [
      { x: 0, y: 0, r: 120 * scale },
      { x: 80 * scale, y: -20 * scale, r: 100 * scale },
      { x: 160 * scale, y: 0, r: 110 * scale },
      { x: -80 * scale, y: 20 * scale, r: 95 * scale },
      { x: -160 * scale, y: -10 * scale, r: 105 * scale },
    ];

    circles.forEach((circle, idx) => {
      const noiseVal = perlinNoise(x + circle.x, y + circle.y, time + idx * 100);
      const intensity = 0.6 + noiseVal * 0.4;

      const grad = ctx.createRadialGradient(
        x + circle.x,
        y + circle.y,
        circle.r * 0.1,
        x + circle.x,
        y + circle.y,
        circle.r
      );

      // Orange/amber volumetric color
      grad.addColorStop(0, `hsla(${hue}, 85%, 45%, ${intensity * 0.5})`);
      grad.addColorStop(0.5, `hsla(${hue}, 80%, 35%, ${intensity * 0.25})`);
      grad.addColorStop(1, `hsla(${hue}, 70%, 20%, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x + circle.x, y + circle.y, circle.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  };

  const draw = (ctx, frameCount, timestamp, dpr) => {
    const canvas = ctx.canvas;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    if (cloudRef.current.length === 0) {
      initClouds(width, height);
    }

    // Soft clear (preserve some trailing)
    ctx.fillStyle = 'rgba(7, 7, 8, 0.05)';
    ctx.fillRect(0, 0, width, height);

    timeRef.current += frameCount;
    const clouds = cloudRef.current;

    // Draw clouds with horizontal drift
    clouds.forEach((cloud, idx) => {
      const driftX = (timeRef.current * cloud.speed * 0.5) % (width + 400);
      const x = driftX;
      const y = cloud.y;

      drawVolumetricCloud(
        ctx,
        x,
        y,
        width,
        height,
        cloud.scale,
        cloud.opacity * (isTouchOrReducedMotion ? 0.5 : 1),
        cloud.hue,
        timeRef.current * 0.0001
      );
    });

    // Add atmospheric fog gradient (darker at bottom, lighter at top)
    const fogGrad = ctx.createLinearGradient(0, 0, 0, height);
    fogGrad.addColorStop(0, 'rgba(7, 7, 8, 0)');
    fogGrad.addColorStop(0.4, 'rgba(30, 15, 8, 0.08)');
    fogGrad.addColorStop(1, 'rgba(30, 15, 8, 0.15)');
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, 0, width, height);
  };

  return (
    <canvas
      ref={useCanvas(draw, false, true)}
      className="hero-clouds"
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
