import React, { forwardRef } from 'react';

/**
 * 3-Tier Kinetic Typography behind Katana using "Cinzel" font.
 * Controlled strictly by scroll progress (word-by-word scroll glide with micro-tilt and shake)
 * instead of continuous auto-marquee.
 */
const KatanaBackgroundText = forwardRef(function KatanaBackgroundText(props, ref) {
  return (
    <div ref={ref} className="katana-bg-typography-container" aria-hidden="true">
      {/* Tier 1: Top Muted Silver Cinzel ("FLINCH × FEAR × CONQUER") */}
      <div className="katana-text-tier tier-top">
        <div className="katana-text-track track-top">
          <span className="cinzel-word">FLINCH</span>
          <span className="cinzel-cross">&times;</span>
          <span className="cinzel-word">FEAR</span>
          <span className="cinzel-cross">&times;</span>
          <span className="cinzel-word">CONQUER</span>
          <span className="cinzel-cross">&times;</span>
          <span className="cinzel-word">STRIKE</span>
          <span className="cinzel-cross">&times;</span>
          <span className="cinzel-word">SILENCE</span>
          <span className="cinzel-cross">&times;</span>
          <span className="cinzel-word">FLINCH</span>
        </div>
      </div>

      {/* Tier 2: Middle Deep Crimson & Japanese Kanji ("GO ANYWAY 侍の道") */}
      <div className="katana-text-tier tier-middle">
        <div className="katana-text-track track-middle">
          <span className="crimson-word">GO ANYWAY</span>
          <span className="kanji-accent">侍の道</span>
          <span className="crimson-word">BUSHIDO</span>
          <span className="kanji-accent">武士道</span>
          <span className="crimson-word">FORWARD</span>
          <span className="kanji-accent">侍の道</span>
          <span className="crimson-word">GO ANYWAY</span>
        </div>
      </div>

      {/* Tier 3: Bottom Ghost Italic Mantra ("the hand will shake the heart will not") */}
      <div className="katana-text-tier tier-bottom">
        <div className="katana-text-track track-bottom">
          <span className="mantra-phrase">the hand will shake &nbsp; the heart will not &nbsp; the hand will shake &nbsp; the heart will not &nbsp; the hand will shake &nbsp; the heart will not</span>
        </div>
      </div>
    </div>
  );
});

export default KatanaBackgroundText;
