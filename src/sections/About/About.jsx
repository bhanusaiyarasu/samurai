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
  const bgArtworkRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
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
            trigger: sectionRef.current,
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

      // 5. Background artwork subtle parallax & floating pulse
      if (bgArtworkRef.current) {
        gsap.to(bgArtworkRef.current, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="about-section" id="about">
      {/* Background radial atmosphere */}
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

      {/* Background Mythical Beast / Dragon Artwork Layer (Modular Placeholder) */}
      <div ref={bgArtworkRef} className="about-bg-artwork">
        {/* Stylized Red Dragon / Beast Silhouette SVG (Replaced when user provides custom image) */}
        <svg
          className="about-dragon-silhouette"
          viewBox="0 0 800 650"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <g stroke="currentColor" strokeWidth="1.2" opacity="0.85">
            {/* Dragon Horns & Crest */}
            <path d="M 680,60 C 620,110 570,180 540,240 C 510,190 470,150 430,120 C 470,170 480,230 460,280 C 410,240 350,220 300,210 C 350,250 380,300 370,360 C 330,330 280,310 230,300 C 270,340 290,390 280,440" />
            <path d="M 720,100 C 660,150 610,210 580,280 C 630,260 690,270 740,300 C 690,320 630,320 590,340 C 640,350 690,380 730,420 C 670,410 610,400 560,420" />

            {/* Fierce Eye & Brow Ridge */}
            <path d="M 450,290 C 480,280 520,290 540,320 C 500,330 460,320 450,290 Z" fill="#ff1e38" fillOpacity="0.4" />
            <path d="M 430,275 C 470,260 520,270 560,310" strokeWidth="2.5" />
            <circle cx="495" cy="305" r="5" fill="#ff2a40" />

            {/* Dragon Snout & Teeth */}
            <path d="M 540,320 C 580,340 640,360 700,370 C 640,390 580,390 520,380" strokeWidth="2" />
            <path d="M 530,380 L 545,410 L 560,385 L 580,415 L 595,385 L 620,410 L 640,380" strokeWidth="1.8" />
            <path d="M 510,430 C 560,420 620,415 670,410 C 610,440 550,450 490,440" strokeWidth="2" />
            <path d="M 510,435 L 530,415 L 545,435 L 565,415 L 585,435 L 610,415" strokeWidth="1.8" />

            {/* Whiskers & Flames */}
            <path d="M 520,350 C 460,370 380,360 310,300 C 260,250 200,210 120,180" strokeWidth="1.8" />
            <path d="M 500,380 C 440,410 370,420 290,390 C 210,360 150,340 80,330" strokeWidth="1.8" />
            <path d="M 490,440 C 430,480 360,510 280,510 C 200,510 130,470 60,420" strokeWidth="1.8" />
            <path d="M 560,420 C 530,480 490,540 430,590 C 370,640 290,660 210,650" strokeWidth="1.8" />

            {/* Mane & Spikes */}
            <path d="M 370,360 C 340,430 330,500 340,570 C 310,530 290,480 280,440" />
            <path d="M 460,280 C 420,340 400,420 400,500 C 370,460 360,410 370,360" />
            <path d="M 580,280 C 560,220 550,170 560,110 C 580,160 590,210 580,280" />
            <path d="M 640,240 C 630,190 640,140 660,90 C 660,150 660,200 640,240" />
          </g>
        </svg>
      </div>

      {/* Subtle Hollow Numeral Watermark in Bottom-Right */}
      <div className="about-corner-numeral" aria-hidden="true">
        03
      </div>
    </section>
  );
}