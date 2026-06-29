import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Manifesto.css';

gsap.registerPlugin(ScrollTrigger);

const EDITORIAL_TITLE = "The digital canvas. 匠";
const SUPPORTING_TEXT = "Where code behaves as art. We bridge *raw technical performance* with *refined aesthetic details* — crafting interfaces that feel alive, responsive, and permanent.";
const SIGNATURE_TEXT = "BHANU SAI  三  B.98";

const splitTextToChars = (text, isHeading = false) => {
  if (!text) return null;
  const KANJI_SET = ['匠', '精', '魂', '創'];
  
  return text.split('\n').map((line, lIdx) => {
    const segments = line.split('*');
    
    return (
      <span key={lIdx} className="statement-line">
        {segments.map((segment, sIdx) => {
          const isHighlighted = sIdx % 2 === 1;
          const words = segment.split(/(\s+)/);
          
          return words.map((word, wIdx) => {
            if (/^\s+$/.test(word)) {
              return <span key={`space-${sIdx}-${wIdx}`} className="reveal-space">&nbsp;</span>;
            }
            
            // Check if the word contains a Kanji character
            const hasKanji = isHeading && word.split('').some(char => KANJI_SET.includes(char));
            
            if (hasKanji) {
              return (
                <span key={`word-${sIdx}-${wIdx}`} className="reveal-word">
                  {word.split('').map((char, cIdx) => {
                    const isKanji = KANJI_SET.includes(char);
                    return (
                      <span key={cIdx} className={isKanji ? "accent-kanji" : ""}>
                        {char}
                      </span>
                    );
                  })}
                </span>
              );
            }
            
            return (
              <span 
                key={`word-${sIdx}-${wIdx}`} 
                className={`reveal-word ${isHighlighted ? 'accent-text' : ''}`}
              >
                {word}
              </span>
            );
          });
        })}
        {lIdx < text.split('\n').length - 1 && <br />}
      </span>
    );
  });
};




export default function Manifesto() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const metaRef = useRef(null);
  const overlayRef = useRef(null);
  const exitLightRef = useRef(null);
  
  const statementRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State Configurations
      gsap.set(metaRef.current, { opacity: 0, y: 15 });
      gsap.set(document.querySelector('.manifesto-header-divider'), { opacity: 0 });
      gsap.set(document.querySelector('.manifesto-header-right'), { opacity: 0, y: 15 });
      gsap.set(document.querySelector('.manifesto-bg-circle'), { opacity: 0, scale: 0.8 });
      
      gsap.set(statementRef.current, { opacity: 0 });
      const words = statementRef.current.querySelectorAll('.reveal-word');
      gsap.set(words, {
        opacity: 0,
        filter: 'blur(10px)',
        y: 10,
      });
      
      gsap.set(document.querySelector('.manifesto-signature'), { opacity: 0, y: 10 });
      gsap.set(exitLightRef.current, { opacity: 0, scale: 0, height: '8px' });

      // Hide global header naturally
      gsap.to(document.querySelector('.global-header'), {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.4,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'top 30%',
          scrub: true,
        }
      });

      // 2. Master Scrub-Driven ScrollTrigger Timeline
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%', // Starts when the top of section is 75% down viewport
          end: 'bottom 25%', // Ends when the bottom of section is 25% down viewport
          scrub: 1.2, // scroll scrub!
        },
      });

      // Entrance animation sequence scrubbed
      masterTl
        .to([metaRef.current, document.querySelector('.manifesto-header-right')], {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power2.out',
          stagger: 0.15,
        })
        .to(document.querySelector('.manifesto-header-divider'), {
          opacity: 1,
          duration: 0.8,
        }, '-=0.5')
        .to(document.querySelector('.manifesto-bg-circle'), {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
        }, '-=0.8')
        .set(statementRef.current, { opacity: 1 }, '-=0.5')
        .to(words, {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          stagger: 0.1, // scrubbed sequential word reveal
          duration: 3.5,
          ease: 'power1.out',
        }, '-=0.5')
        .to(document.querySelector('.manifesto-signature'), {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power2.out',
        }, '-=0.8')
        .to(exitLightRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.6')
        .to(exitLightRef.current, {
          height: '280px',
          scaleX: 0.25,
          borderRadius: '2px',
          duration: 1.5,
          ease: 'power3.inOut',
        });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="manifesto-section" id="manifesto">
      {/* Dark Overlay for handoff */}
      <div ref={overlayRef} className="manifesto-overlay" />

      {/* Background outline circle */}
      <div className="manifesto-bg-circle" />

      {/* Content Area */}
      <div ref={contentRef} className="manifesto-content-v5">
        {/* Header Block */}
        <div className="manifesto-header-area">
          <div ref={metaRef} className="manifesto-meta-label">
            <span className="meta-title">— MANIFESTO</span>
          </div>

          <div className="manifesto-header-right">
            <span className="manifesto-header-num">01</span>
            <span className="manifesto-header-subtext">SO_ WHAT DEFINES MY CRAFT?</span>
          </div>
        </div>

        {/* Dotted header divider */}
        <div className="manifesto-header-divider" />

        {/* Statements container */}
        <div className="manifesto-statements-container">
          <div
            ref={statementRef}
            className="manifesto-statement-wrapper statement-single"
          >
            <h2 className="manifesto-editorial-text">
              {splitTextToChars(EDITORIAL_TITLE, true)}
            </h2>
            <p className="manifesto-supporting-text">
              {splitTextToChars(SUPPORTING_TEXT)}
            </p>
            
            <div className="manifesto-signature">
              <span className="signature-dash" />
              {splitTextToChars(SIGNATURE_TEXT)}
            </div>
          </div>
        </div>
      </div>

      {/* Exit Light Element */}
      <div className="manifesto-particles-wrapper">
        <div ref={exitLightRef} className="manifesto-exit-light" />
      </div>
    </section>
  );
}
