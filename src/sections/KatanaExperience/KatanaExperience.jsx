import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './KatanaExperience.css';

gsap.registerPlugin(ScrollTrigger);

export default function KatanaExperience() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State
      gsap.set(lineRef.current, { 
        height: '280px', 
        scaleX: 0.25, 
        rotation: 0, 
        opacity: 1 
      });
      gsap.set(contentRef.current, { 
        opacity: 0, 
        y: 30 
      });

      // 2. ScrollTrigger to handle transition slash & reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom', // Start animating as soon as the top of this section enters from bottom
          end: 'top top',    // Complete transition when the section is fully in viewport
          scrub: 1.0,
        }
      });

      tl
        // Rotate the line to match a dynamic sword angle (from 0 to 45 deg) and stretch
        .to(lineRef.current, {
          rotation: 45,
          scaleX: 1.5,
          height: '400px',
          duration: 1.5,
          ease: 'power2.inOut',
        })
        // Slash across the screen (scale up width, slide out/fade out)
        .to(lineRef.current, {
          scaleX: 0,
          scaleY: 0,
          opacity: 0,
          duration: 1.0,
          ease: 'power3.in',
        })
        // Fade in the section content
        .to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
        }, '-=0.5');

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="katana-experience-section" id="katana-experience">
      {/* Seamless transition line target */}
      <div ref={lineRef} className="katana-transition-line" />

      {/* Main Content */}
      <div ref={contentRef} className="katana-experience-content">
        <span className="katana-experience-label">04 / EXPERIENCE</span>
        <h2 className="katana-experience-heading">KATANA EXPERIENCE</h2>
        <p className="katana-experience-paragraph">
          An interactive, high-performance visual workspace. Slicing through code layers with cinematic feedback and precise responsiveness.
        </p>
      </div>
    </section>
  );
}
