import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Magnet - A premium wrapper component that attracts its child slightly towards the cursor.
 * Uses GSAP for smooth acceleration, deceleration, and return eases.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child element to magnetize
 * @param {number} [props.range=60] - The pixel radius around the center where attraction triggers
 * @param {number} [props.strength=18] - The maximum distance (in pixels) the element will move
 */
export default function Magnet({ children, range = 60, strength = 18 }) {
  const magnetRef = useRef(null);

  useEffect(() => {
    const el = magnetRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const elX = rect.left + rect.width / 2;
      const elY = rect.top + rect.height / 2;

      const dx = e.clientX - elX;
      const dy = e.clientY - elY;
      const distance = Math.hypot(dx, dy);

      if (distance < range && distance > 0) {
        const ratio = 1 - distance / range;
        const targetX = (dx / distance) * strength * ratio;
        const targetY = (dy / distance) * strength * ratio;

        gsap.to(el, {
          x: targetX,
          y: targetY,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        // Return smoothly to center
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      // Clean up active GSAP tweens on unmount
      gsap.killTweensOf(el);
    };
  }, [range, strength]);

  return (
    <div ref={magnetRef} style={{ display: 'inline-block' }}>
      {children}
    </div>
  );
}
