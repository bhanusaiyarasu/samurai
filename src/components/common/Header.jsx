import React from 'react';
import Magnet from '../ui/Magnet';

export default function Header() {
  return (
    <header className="global-header">
      <div className="header-inner container">
        {/* Left: Branding Logo */}
        <div className="header-logo">
          <Magnet range={40} strength={10}>
            <a href="#hero" className="logo-link">
              <span className="logo-icon-dot">•</span> BHANU SAI
            </a>
          </Magnet>
        </div>


      </div>
    </header>
  );
}
