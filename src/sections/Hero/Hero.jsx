import React, { useEffect, useRef } from 'react';
import HeroParticles from './HeroParticles';
import HeroContent from './HeroContent';
import MoonCanvas from './MoonCanvas';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const glowParallaxRef = useRef(null);
  const cloudsRef = useRef(null);
  const cloudsParallaxRef = useRef(null);
  const cloudsOverlayRef = useRef(null);
  const cloudsOverlayParallaxRef = useRef(null);
  const moonRef = useRef(null);
  const moonParallaxRef = useRef(null);
  const particlesRef = useRef(null);
  const particlesParallaxRef = useRef(null);
  const contentRef = useRef(null);
  const portraitRef = useRef(null);
  const portraitImgRef = useRef(null);
  const haloRef = useRef(null);
  const calligraphyRef = useRef(null);

  const mouseRef = useRef({ x: 0, y: 0 });
  const currentParallaxRef = useRef({
    glowX: 0,
    glowY: 0,
    cloudsX: 0,
    cloudsY: 0,
    cloudsOverlayX: 0,
    cloudsOverlayY: 0,
    moonX: 0,
    moonY: 0,
    particlesX: 0,
    particlesY: 0,
    contentX: 0,
    contentY: 0,
    portraitX: 0,
    portraitY: 0,
  });

  const hasMovedRef = useRef(false);
  const mouseActiveRef = useRef(false);

  useEffect(() => {
    // ── Reset Initial States ──
    gsap.set(glowRef.current, { opacity: 0, scale: 0.5 });
    gsap.set(cloudsRef.current, { opacity: 0, scale: 1.05 });
    gsap.set(cloudsOverlayRef.current, { opacity: 0, scale: 1.15 });
    gsap.set(moonRef.current, { opacity: 0, scale: 0.98 });
    gsap.set(particlesRef.current, { opacity: 0 });
    gsap.set([portraitImgRef.current, haloRef.current], { scale: 0.90, opacity: 0 });
    gsap.set(calligraphyRef.current, { y: 40, opacity: 0 });

    const titleLines = contentRef.current.querySelectorAll('.hero-title-line');
    const roles = contentRef.current.querySelectorAll('.hero-role');
    const roleDots = contentRef.current.querySelectorAll('.hero-role-dot');
    const logline = contentRef.current.querySelector('.hero-logline');
    const cta = contentRef.current.querySelector('.hero-cta');
    const scrollCue = contentRef.current.querySelector('.hero-scroll-cue');

    gsap.set([titleLines, roles, roleDots, logline, cta, scrollCue], { opacity: 0 });

    // ── GSAP Entrance Timeline ──
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    });

    tl.to(
      particlesRef.current,
      {
        opacity: 0.4,
        duration: 1.5,
        ease: 'power2.out',
      },
      0,
    )
      .to(
        glowRef.current,
        {
          opacity: 0.15,
          scale: 1.0,
          duration: 1.8,
        },
        0.3,
      )
      .to(
        cloudsRef.current,
        {
          opacity: 0.72, // Sky Layer A (Deep clouds opacity 0.72)
          scale: 1.0,
          duration: 2.2,
          ease: 'power3.out',
        },
        0.4,
      )
      .to(
        cloudsOverlayRef.current,
        {
          opacity: 0.18, // Sky Layer B (Volumetric clouds overlay opacity 0.18)
          scale: 1.0,
          duration: 2.2,
          ease: 'power3.out',
        },
        0.4,
      )
      .to(
        moonRef.current,
        {
          opacity: 1,
          scale: 1.0,
          duration: 2.2,
          ease: 'power3.out',
        },
        0.5,
      )
      .to(
        [haloRef.current, portraitImgRef.current],
        {
          scale: 1.0,
          opacity: 1,
          duration: 1.8,
          ease: 'power4.out',
          stagger: 0.15,
        },
        0.6,
      )
      .fromTo(
        titleLines,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: 'power4.out' },
        0.8,
      )
      .fromTo(
        [roles, roleDots],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
        1.2,
      )
      .to(
        calligraphyRef.current,
        {
          y: 0,
          opacity: 0.85,
          duration: 1.5,
          ease: 'power3.out',
        },
        1.3,
      )
      .fromTo(
        logline,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        1.5,
      )
      .fromTo(
        cta,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        1.7,
      )
      .fromTo(
        scrollCue,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        2.0,
      )
      .call(
        () => {
          mouseActiveRef.current = true;
        },
        null,
        2.2,
      );

    // ── ScrollTrigger Exit Transition ──
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    scrollTl
      .to(
        cloudsRef.current,
        {
          scale: 0.9,
          opacity: 0,
          y: -50,
          ease: 'power2.inOut',
        },
        0,
      )
      .to(
        cloudsOverlayRef.current,
        {
          scale: 1.1,
          opacity: 0,
          y: -50,
          ease: 'power2.inOut',
        },
        0,
      )
      .to(
        moonRef.current,
        {
          scale: 0.9,
          opacity: 0,
          y: -50,
          ease: 'power2.inOut',
        },
        0,
      )
      .to(
        glowRef.current,
        {
          scale: 0.6,
          opacity: 0,
          y: -40,
          ease: 'power2.inOut',
        },
        0,
      )
      .to(
        particlesRef.current,
        {
          opacity: 0,
          ease: 'power2.inOut',
        },
        0,
      )
      .to(
        [titleLines, roles, roleDots, logline, cta, scrollCue],
        {
          y: -100,
          opacity: 0,
          stagger: 0.04,
          ease: 'power2.inOut',
        },
        0,
      )
      .to(
        portraitRef.current,
        {
          x: 100,
          opacity: 0,
          ease: 'power2.inOut',
        },
        0,
      )
      .to(
        calligraphyRef.current,
        {
          y: -60,
          opacity: 0,
          ease: 'power2.inOut',
        },
        0,
      );

    return () => {
      tl.kill();
      scrollTl.kill();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!mouseActiveRef.current) return;
      hasMovedRef.current = true;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseRef.current.x = e.clientX - centerX;
      mouseRef.current.y = e.clientY - centerY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animFrameId;
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    const updateParallax = () => {
      if (hasMovedRef.current && mouseActiveRef.current) {
        const targetX = mouseRef.current.x;
        const targetY = mouseRef.current.y;

        const glowTargetX = targetX * -0.01;
        const glowTargetY = targetY * -0.01;
        const cloudsTargetX = targetX * 0.004; // Parallax Layer A: 0.004
        const cloudsTargetY = targetY * 0.004;
        const cloudsOverlayTargetX = targetX * 0.016; // Parallax Layer B: 0.016
        const cloudsOverlayTargetY = targetY * 0.016;
        const moonTargetX = targetX * 0.01;
        const moonTargetY = targetY * 0.01;
        const particlesTargetX = targetX * 0.04;
        const particlesTargetY = targetY * 0.04;
        const contentTargetX = targetX * 0.01;
        const contentTargetY = targetY * 0.01;
        const portraitTargetX = targetX * 0.02;
        const portraitTargetY = targetY * 0.02;

        const cp = currentParallaxRef.current;
        cp.glowX = lerp(cp.glowX, glowTargetX, 0.08);
        cp.glowY = lerp(cp.glowY, glowTargetY, 0.08);
        cp.cloudsX = lerp(cp.cloudsX, cloudsTargetX, 0.08);
        cp.cloudsY = lerp(cp.cloudsY, cloudsTargetY, 0.08);
        cp.cloudsOverlayX = lerp(cp.cloudsOverlayX, cloudsOverlayTargetX, 0.08);
        cp.cloudsOverlayY = lerp(cp.cloudsOverlayY, cloudsOverlayTargetY, 0.08);
        cp.moonX = lerp(cp.moonX, moonTargetX, 0.08);
        cp.moonY = lerp(cp.moonY, moonTargetY, 0.08);
        cp.particlesX = lerp(cp.particlesX, particlesTargetX, 0.08);
        cp.particlesY = lerp(cp.particlesY, particlesTargetY, 0.08);
        cp.contentX = lerp(cp.contentX, contentTargetX, 0.08);
        cp.contentY = lerp(cp.contentY, contentTargetY, 0.08);
        cp.portraitX = lerp(cp.portraitX, portraitTargetX, 0.08);
        cp.portraitY = lerp(cp.portraitY, portraitTargetY, 0.08);

        if (glowParallaxRef.current) {
          glowParallaxRef.current.style.transform = `translate3d(${cp.glowX}px, ${cp.glowY}px, 0)`;
        }
        if (cloudsParallaxRef.current) {
          cloudsParallaxRef.current.style.transform = `translate3d(${cp.cloudsX}px, ${cp.cloudsY}px, 0)`;
        }
        if (cloudsOverlayParallaxRef.current) {
          cloudsOverlayParallaxRef.current.style.transform = `translate3d(${cp.cloudsOverlayX}px, ${cp.cloudsOverlayY}px, 0)`;
        }
        if (moonParallaxRef.current) {
          moonParallaxRef.current.style.transform = `translate3d(${cp.moonX}px, ${cp.moonY}px, 0)`;
        }
        if (particlesParallaxRef.current) {
          particlesParallaxRef.current.style.transform = `translate3d(${cp.particlesX}px, ${cp.particlesY}px, 0)`;
        }
        if (contentRef.current) {
          contentRef.current.style.transform = `translate3d(${cp.contentX}px, ${cp.contentY}px, 0)`;
        }
        if (portraitRef.current) {
          portraitRef.current.style.transform = `translate3d(${cp.portraitX}px, ${cp.portraitY}px, 0)`;
        }
      }

      animFrameId = requestAnimationFrame(updateParallax);
    };

    animFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <section ref={containerRef} className="hero-container" id="hero">
      {/* ── L0: Background Base ── */}
      <div ref={glowRef} className="hero-glow-container">
        <div ref={glowParallaxRef} className="hero-glow" aria-hidden="true" />
      </div>

      {/* ── L1: Sky Clouds Environmental Layer (Layer A - Deep) ── */}
      <div ref={cloudsRef} className="hero-layer hero-layer-clouds-deep">
        <div ref={cloudsParallaxRef} className="clouds-parallax-wrapper">
          <img src="/sky.png" alt="Atmospheric Clouds Deep" className="atmos-clouds-img" />
        </div>
      </div>

      {/* ── L2: Celestial Moon Layer ── */}
      <div ref={moonRef} className="hero-layer hero-layer-moon">
        <div ref={moonParallaxRef} className="moon-parallax-wrapper" style={{ width: '100%', height: '100%' }}>
          <div className="moon-ambient-bloom" />
          <MoonCanvas />
        </div>
      </div>

      {/* ── L3: Volumetric Clouds Overlay Layer (Layer B - Overlay) ── */}
      <div ref={cloudsOverlayRef} className="hero-layer hero-layer-clouds-overlay">
        <div ref={cloudsOverlayParallaxRef} className="clouds-overlay-parallax-wrapper">
          <img src="/sky.png" alt="Atmospheric Clouds Volumetric Overlay" className="atmos-clouds-overlay-img" />
        </div>
      </div>

      {/* ── L3: Procedural Atmosphere Layers ── */}
      <div className="hero-atmosphere" aria-hidden="true">
        {/* Cinematic dark vignette frame */}
        <div className="atmos-vignette" />
        
        {/* Soft linear bottom horizon light leak */}
        <div className="atmos-horizon-glow" />

        {/* Dynamic volumetric fog clouds */}
        <div className="atmos-fog-layer">
          <div className="atmos-fog-1" />
          <div className="atmos-fog-2" />
          <div className="atmos-fog-3" />
        </div>
      </div>

      {/* ── L4 & L5: Portrait & Halo Container (Absolute Right Side) ── */}
      <div ref={portraitRef} className="hero-portrait-container">
        <div ref={haloRef} className="hero-solar-halo" />
        <img ref={portraitImgRef} src="/developer.png" alt="Y. Bhanu Sai Portrait" className="portrait-img" />
      </div>

      {/* ── L7: Typography & Calligraphy Overlay Grid ── */}
      <div className="hero-grid container">
        {/* Left column (4.5fr): Content overlays */}
        <div ref={contentRef} className="hero-grid-left">
          <HeroContent />
        </div>

        {/* Center column (1fr): Vertical Japanese Calligraphy */}
        <div className="hero-grid-center">
          <div ref={calligraphyRef} className="hero-neon-text">
            改善は進歩
          </div>
        </div>

        {/* Right column (4.5fr): Negative space placeholder for absolute portrait */}
        <div className="hero-grid-right" />
      </div>

      {/* ── L6: Floating Embers Canvas Layer ── */}
      <div ref={particlesRef} className="hero-layer hero-layer-particles">
        <div ref={particlesParallaxRef} className="particles-parallax-wrapper" style={{ width: '100%', height: '100%' }}>
          <HeroParticles />
        </div>
      </div>
    </section>
  );
}
