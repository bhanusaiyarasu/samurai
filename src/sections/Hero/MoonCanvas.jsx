import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { useDeviceFallback } from '../../hooks/useDeviceFallback';

export default function MoonCanvas() {
  const isTouchOrReducedMotion = useDeviceFallback();
  const [moonImage, setMoonImage] = useState(null);

  // Preload the photographic moon texture
  useEffect(() => {
    const img = new Image();
    img.src = '/moon_texture.png';
    img.onload = () => {
      setMoonImage(img);
    };
  }, []);

  // Generate floating energy shards
  const shards = useMemo(() => {
    return [
      { xPct: 0.22, yPct: 0.28, z: 1.8, size: 10, speed: 0.5, phase: 0 },
      { xPct: 0.78, yPct: 0.22, z: 2.5, size: 8, speed: -0.7, phase: Math.PI / 3 },
      { xPct: 0.15, yPct: 0.72, z: 0.7, size: 15, speed: 0.3, phase: Math.PI / 1.5 },
      { xPct: 0.85, yPct: 0.68, z: 1.4, size: 12, speed: 0.6, phase: Math.PI },
      { xPct: 0.48, yPct: 0.82, z: 1.1, size: 13, speed: -0.4, phase: Math.PI / 2 },
    ];
  }, []);

  const thetaRef = useRef(0);
  const rotationSpeedRef = useRef(0.08); // Start fast for spin-down entrance

  const draw = (ctx, frameCount, timestamp, dpr) => {
    const canvas = ctx.canvas;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    // Responsive scaling and positioning (diameter occupies 15% of viewport width)
    const isMobile = width < 768;
    
    // Desktop diameter 15vw (radius 7.5vw), clamped between 180px and 280px diameter (90px and 140px radius)
    const tempRadius = width * 0.075;
    const moonRadius = isMobile ? width * 0.16 : Math.max(90, Math.min(140, tempRadius));
    
    // Desktop Center Coordinates: cx = width * 0.14, cy = height * 0.14
    const cx = isMobile ? width * 0.50 : width * 0.14;
    const cy = isMobile ? height * 0.22 : height * 0.14;

    // Light source angle (top-right direction)
    const lightAngle = -0.58; // approx -33 degrees

    // 1. Draw Background Shards (z > 1.5)
    shards.forEach((shard) => {
      if (shard.z > 1.5) {
        drawShard(ctx, shard, frameCount, width, height, cx, cy);
      }
    });

    // 2. Draw Solar Corona Eclipse Glow (radial, offset towards top-right)
    const pulse = Math.sin(frameCount * 0.01) * 0.02 + 0.16;
    const glowGrad = ctx.createRadialGradient(
      cx + moonRadius * 0.15,
      cy - moonRadius * 0.15,
      moonRadius * 0.6,
      cx + moonRadius * 0.3,
      cy - moonRadius * 0.3,
      moonRadius * 2.5
    );
    glowGrad.addColorStop(0, `hsla(18, 100%, 50%, ${pulse * 0.65})`);
    glowGrad.addColorStop(0.2, `hsla(18, 90%, 45%, ${pulse * 0.4})`);
    glowGrad.addColorStop(0.5, `hsla(18, 80%, 25%, ${pulse * 0.1})`);
    glowGrad.addColorStop(1, 'rgba(7, 7, 8, 0)');

    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, moonRadius * 2.6, 0, Math.PI * 2);
    ctx.fill();

    // 3. Draw Moon Body Sphere (Clipped to boundary)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, moonRadius, 0, Math.PI * 2);
    ctx.clip();

    // Moon body base shading: Deep obsidian/black gradient
    const bodyGrad = ctx.createRadialGradient(
      cx - moonRadius * 0.2,
      cy + moonRadius * 0.2,
      moonRadius * 0.1,
      cx,
      cy,
      moonRadius
    );
    bodyGrad.addColorStop(0, 'hsl(240, 10%, 4%)');
    bodyGrad.addColorStop(0.7, 'hsl(240, 12%, 1.5%)');
    bodyGrad.addColorStop(1, '#000000');
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // 4. Draw Photographic Rotating Texture
    if (isTouchOrReducedMotion) {
      rotationSpeedRef.current = 0.0003; // Low CPU fallback
    } else {
      rotationSpeedRef.current += (0.0008 - rotationSpeedRef.current) * 0.015;
    }
    thetaRef.current += rotationSpeedRef.current;
    const thetaVal = thetaRef.current;

    if (moonImage) {
      ctx.save();
      ctx.translate(cx, cy);
      // Independent axial spin
      ctx.rotate(thetaVal);
      // Draw texture
      ctx.drawImage(moonImage, -moonRadius, -moonRadius, moonRadius * 2, moonRadius * 2);
      ctx.restore();
    }

    // 5. Apply Static Shading Mask to create the crescent (Rotated Light Space)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(lightAngle);

    // Dark shadow path on the left side, terminator ellipse on the right
    ctx.beginPath();
    ctx.arc(0, 0, moonRadius + 2, Math.PI / 2, -Math.PI / 2, false);
    ctx.ellipse(0, 0, moonRadius * 0.36, moonRadius + 2, 0, -Math.PI / 2, Math.PI / 2, false);
    ctx.closePath();

    // Fill shadow with soft gradient transitioning to light at the terminator
    const shadowGrad = ctx.createLinearGradient(-moonRadius * 0.1, 0, moonRadius * 0.5, 0);
    shadowGrad.addColorStop(0, 'rgba(7, 7, 8, 1.0)'); // Obsidian backdrop matching background
    shadowGrad.addColorStop(0.4, 'rgba(7, 7, 8, 0.98)');
    shadowGrad.addColorStop(0.85, 'rgba(7, 7, 8, 0.4)');
    shadowGrad.addColorStop(1.0, 'rgba(7, 7, 8, 0.0)');
    ctx.fillStyle = shadowGrad;
    ctx.fill();

    // Soft overlay to darken the overall moon features on the crescent transition zone
    const overlayGrad = ctx.createRadialGradient(
      moonRadius * 0.8,
      -moonRadius * 0.2,
      moonRadius * 0.1,
      0,
      0,
      moonRadius
    );
    overlayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.05)'); // subtle highlight
    overlayGrad.addColorStop(0.3, 'rgba(243, 22, 41, 0.12)'); // subtle red atmospheric blend
    overlayGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.5)'); // darken towards shadow
    overlayGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
    ctx.fillStyle = overlayGrad;
    ctx.beginPath();
    ctx.arc(0, 0, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // Restore clipping boundary

    // 6. Draw Outer Crescent Corona Glow (Outside clipping path for light bleed bloom)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(lightAngle);

    // Soft outer crimson envelope
    const outerHaloGrad = ctx.createLinearGradient(0, -moonRadius, 0, moonRadius);
    outerHaloGrad.addColorStop(0, 'rgba(243, 22, 41, 0)');
    outerHaloGrad.addColorStop(0.5, 'rgba(243, 22, 41, 0.55)');
    outerHaloGrad.addColorStop(1, 'rgba(243, 22, 41, 0)');

    ctx.strokeStyle = outerHaloGrad;
    ctx.lineWidth = isMobile ? 2.5 : 4;
    ctx.shadowBlur = isMobile ? 6 : 10;
    ctx.shadowColor = 'rgba(243, 22, 41, 0.65)';
    ctx.beginPath();
    ctx.arc(0, 0, moonRadius + 0.5, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    // Sharp white-hot inner terminator rim
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 0.8;
    ctx.shadowBlur = 3;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, moonRadius, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    ctx.restore();

    // 7. Draw Foreground Shards (z <= 1.5)
    shards.forEach((shard) => {
      if (shard.z <= 1.5) {
        drawShard(ctx, shard, frameCount, width, height, cx, cy);
      }
    });
  };

  const drawShard = (ctx, shard, frameCount, width, height, cx, cy) => {
    const hoverTime = frameCount * 0.005 + shard.phase;
    const hoverY = Math.sin(hoverTime) * 12;

    const isMobile = width < 768;
    const defaultCxPct = isMobile ? 0.50 : 0.11;
    const defaultCyPct = isMobile ? 0.22 : 0.09;

    const bx = cx + (shard.xPct - defaultCxPct) * width;
    const by = cy + (shard.yPct - defaultCyPct) * height + hoverY;

    const scale = 1.3 / shard.z;
    const w = shard.size * scale;
    const h = shard.size * 2 * scale;

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(hoverTime * 0.12 * (shard.speed > 0 ? 1 : -1));

    ctx.shadowBlur = 6;
    ctx.shadowColor = 'hsla(355, 92%, 52%, 0.45)';

    const shardGrad = ctx.createLinearGradient(0, -h, 0, h);
    shardGrad.addColorStop(0, '#ffffff');
    shardGrad.addColorStop(0.35, 'hsl(355, 92%, 55%)');
    shardGrad.addColorStop(1, 'hsl(355, 92%, 25%)');

    ctx.fillStyle = shardGrad;
    ctx.beginPath();
    ctx.moveTo(0, -h);
    ctx.lineTo(w, 0);
    ctx.lineTo(0, h);
    ctx.lineTo(-w, 0);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  };

  const { canvasRef } = useCanvas(draw);

  return (
    <canvas
      ref={canvasRef}
      className="moon-canvas"
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
