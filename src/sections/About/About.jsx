import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const topBarRef = useRef(null);
  const interactiveBgRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);

  // 1. Scroll-driven entrance reveals & smooth mouse spotlight setup
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Fast GSAP quickTo setters for 60-120fps buttery mouse spotlight tracking
    const setMaskX = gsap.quickTo(section, '--mouse-x', {
      duration: 0.28,
      ease: 'power2.out',
      unit: 'px',
    });
    const setMaskY = gsap.quickTo(section, '--mouse-y', {
      duration: 0.28,
      ease: 'power2.out',
      unit: 'px',
    });

    const handlePointerMove = (e) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMaskX(x);
      setMaskY(y);
    };

    const handlePointerEnter = () => {
      gsap.to(section, {
        '--mask-opacity': 1,
        duration: 0.45,
        ease: 'power2.out',
      });
    };

    const handlePointerLeave = () => {
      gsap.to(section, {
        '--mask-opacity': 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    };

    section.addEventListener('pointermove', handlePointerMove);
    section.addEventListener('pointerenter', handlePointerEnter);
    section.addEventListener('pointerleave', handlePointerLeave);

    const ctx = gsap.context(() => {
      // 1. Top bar reveal
      gsap.fromTo(
        topBarRef.current,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 2. Headline stroked text reveal
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 40, letterSpacing: '0.12em' },
        {
          opacity: 1,
          y: 0,
          letterSpacing: '0.04em',
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 3. Left column bio reveal
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: leftColRef.current,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 4. Right column specs reveal
      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current.querySelectorAll('.about-spec-row'),
          { opacity: 0, x: 25 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: rightColRef.current,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 5. Subtle background parallax on scroll
      if (interactiveBgRef.current) {
        gsap.to(interactiveBgRef.current, {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    }, section);

    return () => {
      section.removeEventListener('pointermove', handlePointerMove);
      section.removeEventListener('pointerenter', handlePointerEnter);
      section.removeEventListener('pointerleave', handlePointerLeave);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="about-section" id="about">
      {/* Background Dual-Layer Artwork: B&W Base + Mouse Spotlight Colored Reveal */}
      <div ref={interactiveBgRef} className="about-interactive-bg" aria-hidden="true">
        {/* Layer 1: High-contrast Black & White Base (Always visible) */}
        <div className="about-bg-layer about-bg-base" />

        {/* Layer 2: Vivid Full-Color Image with mouse-following radial mask */}
        <div className="about-bg-layer about-bg-reveal" />

        {/* Layer 3: Soft crimson spotlight aura around cursor */}
        <div className="about-spotlight-lens" />

        {/* Layer 4: Deep obsidian atmospheric scrim to ensure text legibility */}
        <div className="about-bg-scrim" />
      </div>

      {/* Background ambient radial glow */}
      <div className="about-bg-radial" />

      {/* Editorial Left Rail / HUD Sidebar (Responsive Awwwards-style) */}
      <aside className="about-left-rail" aria-label="Editorial sidebar">
        <div className="about-rail-badge">
          <span className="badge-letter">W.</span>
          <span className="badge-honors">HONORS</span>
        </div>

        <nav className="about-rail-chapters">
          <span className="rail-ch">零</span>
          <span className="rail-ch">一</span>
          <span className="rail-ch">二</span>
          <span className="rail-ch active">
            <span className="active-dash" />
            <span className="ch-kanji">三</span>
            <span className="ch-name">KITSUNE</span>
          </span>
          <span className="rail-ch">四</span>
          <span className="rail-ch">六</span>
          <span className="rail-ch">七</span>
          <span className="rail-ch">八</span>
        </nav>

        <button
          type="button"
          className={`about-rail-audio ${isMuted ? 'muted' : 'playing'}`}
          onClick={() => setIsMuted((prev) => !prev)}
          title={isMuted ? 'Enable Sound' : 'Mute Sound'}
          aria-label="Toggle ambient sound"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            {isMuted ? (
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            ) : (
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            )}
          </svg>
        </button>
      </aside>

      {/* Main Container */}
      <div className="about-container">
        {/* Top Header Rail */}
        <div ref={topBarRef} className="about-top-bar">
          <div className="about-label-badge">
            <span className="equal-bars">
              <span className="bar" />
              <span className="bar" />
            </span>
            <span className="label-text">ABOUT</span>
          </div>

          <div className="about-top-meta">
            <span className="meta-index">№.26</span>
            <span className="meta-kanji">生きてる</span>
          </div>
        </div>

        {/* Hero Outline Headline */}
        <div className="about-headline-wrap">
          <h2 ref={headlineRef} className="about-headline-stroked">
            I AM STILL ALIVE.
          </h2>
        </div>

        {/* Content Body: Two Columns */}
        <div className="about-content-grid">
          {/* Left Column: Bio & Philosophy */}
          <div ref={leftColRef} className="about-left-col">
            <p className="about-lead-text">
              Frontend developer &amp; Creative Engineer. Based in{' '}
              <span className="about-accent-crimson">india — hyderabad.</span>{' '}
              Survived years of rigorous engineering, mastered 3+ years of frontend
              sorcery. Still debugging my life.
            </p>

            <p className="about-philosophy-text">
              I build interfaces the way a sword gets forged — slow, obsessive, a
              little dramatic. Motion, pixels, and the quiet parts of a product
              nobody notices when they're done right.
            </p>
          </div>

          {/* Right Column: Spec Sheet / Metadata HUD */}
          <div ref={rightColRef} className="about-right-col">
            <div className="about-spec-table">
              <div className="about-spec-row">
                <span className="spec-label">LOCATION</span>
                <span className="spec-value">
                  HYDERABAD, INDIA <span className="spec-sub-kanji">インド</span>
                </span>
              </div>

              <div className="about-spec-row">
                <span className="spec-label">ROLE</span>
                <span className="spec-value">CREATIVE FRONTEND ENGINEER</span>
              </div>

              <div className="about-spec-row">
                <span className="spec-label">YEARS</span>
                <span className="spec-value">3+ IN THE CRAFT</span>
              </div>

              <div className="about-spec-row">
                <span className="spec-label">STATUS</span>
                <span className="spec-value status-active">
                  <span className="status-pulse-dot" />
                  AVAILABLE FOR WORK 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Hollow Numeral Watermark in Bottom-Right */}
      <div className="about-corner-numeral" aria-hidden="true">
        03
      </div>
    </section>
  );
}
