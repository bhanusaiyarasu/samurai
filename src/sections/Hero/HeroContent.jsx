import React from 'react';
import Magnet from '../../components/ui/Magnet';

const ROLES = [
  'FRONTEND DEVELOPER',
  'AUTOMATION ENGINEER',
  'AI EXPLORER',
];

export default function HeroContent() {

  return (
    <div className="hero-content-inner">
      <div className="hero-main">
        {/* Roles / Subtitle stacked horizontally with custom orange divider dots */}
        <div className="hero-roles">
          {ROLES.map((role, idx) => (
            <React.Fragment key={role}>
              {idx > 0 && <span className="hero-role-dot" aria-hidden="true">•</span>}
              <span className="hero-role">{role}</span>
            </React.Fragment>
          ))}
        </div>

        {/* Large Cinematic Title on a single line */}
        <h1 className="hero-title">
          <span className="hero-title-line">
            <span className="accent">Y.</span> BHANU SAI
          </span>
        </h1>

        {/* Cinematic Logline */}
        <p className="hero-logline">
          I build interactive experiences,
          <br className="hero-logline-break" />
          automate testing and explore <span className="accent">AI</span> powered solutions.
        </p>

        {/* Call to Actions */}
        <div className="hero-cta">
          <Magnet range={50} strength={15}>
            <a href="#projects" className="cta-button cta-button-primary">
              <span>EXPLORE WORK</span>
              <svg className="cta-arrow-diagonal" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </Magnet>

          <Magnet range={50} strength={15}>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="cta-button cta-button-secondary">
              <span>VIEW RESUME</span>
              <svg className="cta-arrow-down" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 5V19M12 19L5 12M12 19L19 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </Magnet>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll-cue">
          <span className="scroll-text">SCROLL</span>
          <div className="scroll-track">
            <div className="scroll-bullet" />
          </div>
        </div>
      </div>
    </div>
  );
}
