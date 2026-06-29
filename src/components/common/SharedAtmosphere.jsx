import React, { useEffect, useRef } from 'react';
import HeroParticles from '../../sections/Hero/HeroParticles';
import { useDeviceFallback } from '../../hooks/useDeviceFallback';

export default function SharedAtmosphere() {
  const isTouchOrReducedMotion = useDeviceFallback();
  const atmosphereRef = useRef(null);
  
  const glowParallaxRef = useRef(null);
  const cloudsParallaxRef = useRef(null);
  const cloudsOverlayParallaxRef = useRef(null);
  const particlesParallaxRef = useRef(null);

  const mouseRef = useRef({ x: 0, y: 0 });
  const currentParallax = useRef({
    glowX: 0, glowY: 0,
    cloudsX: 0, cloudsY: 0,
    cloudsOverlayX: 0, cloudsOverlayY: 0,
    particlesX: 0, particlesY: 0
  });

  useEffect(() => {
    if (isTouchOrReducedMotion) return;

    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseRef.current.x = e.clientX - centerX;
      mouseRef.current.y = e.clientY - centerY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTouchOrReducedMotion]);

  useEffect(() => {
    let animFrameId;
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    const updateParallax = () => {
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;

      const cp = currentParallax.current;
      cp.glowX = lerp(cp.glowX, targetX * -0.01, 0.08);
      cp.glowY = lerp(cp.glowY, targetY * -0.01, 0.08);
      cp.cloudsX = lerp(cp.cloudsX, targetX * 0.004, 0.08);
      cp.cloudsY = lerp(cp.cloudsY, targetY * 0.004, 0.08);
      cp.cloudsOverlayX = lerp(cp.cloudsOverlayX, targetX * 0.016, 0.08);
      cp.cloudsOverlayY = lerp(cp.cloudsOverlayY, targetY * 0.016, 0.08);
      cp.particlesX = lerp(cp.particlesX, targetX * 0.04, 0.08);
      cp.particlesY = lerp(cp.particlesY, targetY * 0.04, 0.08);

      if (glowParallaxRef.current) {
        glowParallaxRef.current.style.transform = `translate3d(${cp.glowX}px, ${cp.glowY}px, 0)`;
      }
      if (cloudsParallaxRef.current) {
        cloudsParallaxRef.current.style.transform = `translate3d(${cp.cloudsX}px, ${cp.cloudsY}px, 0)`;
      }
      if (cloudsOverlayParallaxRef.current) {
        cloudsOverlayParallaxRef.current.style.transform = `translate3d(${cp.cloudsOverlayX}px, ${cp.cloudsOverlayY}px, 0)`;
      }
      if (particlesParallaxRef.current) {
        particlesParallaxRef.current.style.transform = `translate3d(${cp.particlesX}px, ${cp.particlesY}px, 0)`;
      }

      animFrameId = requestAnimationFrame(updateParallax);
    };

    animFrameId = requestAnimationFrame(updateParallax);
    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div ref={atmosphereRef} className="shared-atmosphere">
      {/* ── L0: Background Base Glow ── */}
      <div className="shared-glow-container">
        <div ref={glowParallaxRef} className="shared-glow" aria-hidden="true" />
      </div>

      {/* ── L1: Sky Clouds Environmental Layer (Layer A - Deep) ── */}
      <div className="shared-layer shared-layer-clouds-deep">
        <div ref={cloudsParallaxRef} className="clouds-parallax-wrapper">
          <img src="/sky.png" alt="Atmospheric Clouds Deep" className="atmos-clouds-img" />
        </div>
      </div>

      {/* ── L3: Volumetric Clouds Overlay Layer (Layer B - Overlay) ── */}
      <div className="shared-layer shared-layer-clouds-overlay">
        <div ref={cloudsOverlayParallaxRef} className="clouds-overlay-parallax-wrapper">
          <img src="/sky.png" alt="Atmospheric Clouds Volumetric Overlay" className="atmos-clouds-overlay-img" />
        </div>
      </div>

      {/* ── L3: Procedural Atmosphere Layers ── */}
      <div className="shared-atmosphere-layers" aria-hidden="true">
        {/* Soft linear bottom horizon light leak */}
        <div className="atmos-horizon-glow" />

        {/* Dynamic volumetric fog clouds */}
        <div className="atmos-fog-layer">
          <div className="atmos-fog-1" />
          <div className="atmos-fog-2" />
          <div className="atmos-fog-3" />
        </div>
      </div>

      {/* Noise Overlay */}
      <div className="shared-noise" />

      {/* ── L6: Floating Embers Canvas Layer ── */}
      <div className="shared-layer shared-layer-particles">
        <div ref={particlesParallaxRef} className="particles-parallax-wrapper" style={{ width: '100%', height: '100%' }}>
          <HeroParticles />
        </div>
      </div>

      {/* Vignette */}
      <div className="shared-vignette" />
    </div>
  );
}
