import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BattleExperience.css';

gsap.registerPlugin(ScrollTrigger);

// 236 frames from frame_0001.webp to frame_0236.webp
const START_FRAME = 1;
const END_FRAME = 236;
const TOTAL_FRAMES = END_FRAME - START_FRAME + 1; // 236

const getFramePath = (index) => {
  const frameNum = START_FRAME + index;
  const pad = String(frameNum).padStart(4, '0');
  return `/battle_frames/frame_${pad}.webp`;
};

// 3 Narrative Acts split into Left and Right columns
const BATTLE_ACTS = [
  {
    id: 1,
    left: {
      kanji: '壱・構え',
      subtitle: 'ACT I / THE STANCE',
      title: 'BEFORE THE FIRST STRIKE',
      body: 'In the stillness of the dark corridor, intention precedes all movement. A warrior does not react to the fight — they define it.',
    },
    right: {
      kanji: '深呼吸・BREATH',
      subtitle: 'TACTICAL FOCUS',
      title: 'CALM WITHIN THE SHADOW',
      body: 'Heartbeat steady. Breath controlled. When the blade ignites, absolute discipline is the only weapon that never shatters.',
    },
  },
  {
    id: 2,
    left: {
      kanji: '弐・激突',
      subtitle: 'ACT II / THE CLASH',
      title: 'STEEL AGAINST STEEL',
      body: 'Crimson sparks erupt as weapons collide. Relentless code and uncompromising craft tested under the heat of battle.',
    },
    right: {
      kanji: '火花・IMPACT',
      subtitle: 'PURE EXECUTION',
      title: 'PRECISION IN MOTION',
      body: 'Every millisecond counts. Where thousand-hour muscle memory meets instinct, hesitation is cut down in an instant.',
    },
  },
  {
    id: 3,
    left: {
      kanji: '参・残心',
      subtitle: 'ACT III / ZANSHIN',
      title: 'ONE DECISIVE CUT',
      body: 'Flames disperse into cold mist. A single arc executed with lethal mastery. True power lies in what remains standing.',
    },
    right: {
      kanji: '不滅・LEGACY',
      subtitle: 'THE UNBROKEN',
      title: 'FORGED FOR PERMANENCE',
      body: 'The clash subsides, but the standard endures. Interfaces built not just to look beautiful, but to dominate.',
    },
  },
];

export default function BattleExperience() {
  const containerRef = useRef(null);
  const pinTargetRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  // Animation interpolation refs
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const rafIdRef = useRef(null);

  // Cards refs for scroll scrub animation
  const act1LeftRef = useRef(null);
  const act1RightRef = useRef(null);
  const act2LeftRef = useRef(null);
  const act2RightRef = useRef(null);
  const act3LeftRef = useRef(null);
  const act3RightRef = useRef(null);

  // 1. High-Performance Frame Preloading into Memory
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
      };
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
      imagesRef.current = [];
    };
  }, []);

  // 2. High-DPI Canvas Draw with Aspect Ratio Preservation
  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const safeIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex)));
    const img = imagesRef.current[safeIndex];

    if (img && img.complete && img.naturalWidth !== 0) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const imgW = img.naturalWidth || 640;
      const imgH = img.naturalHeight || 360;
      const imgRatio = imgW / imgH;
      const canvasRatio = w / h;

      let drawW, drawH;
      if (canvasRatio > imgRatio) {
        drawH = h;
        drawW = drawH * imgRatio;
      } else {
        drawW = w;
        drawH = drawW / imgRatio;
      }

      const drawX = (w - drawW) / 2;
      const drawY = (h - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }

    ctx.restore();
  };

  // 3. Smooth Lerp Loop (Decoupled RAF for 60-120fps scrubbing)
  useEffect(() => {
    let lastRenderedFrame = -1;

    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.005) {
        currentFrameRef.current += diff * 0.28; // Responsive inertial smoothing
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const rounded = Math.round(currentFrameRef.current);
      if (rounded !== lastRenderedFrame) {
        drawFrame(currentFrameRef.current);
        lastRenderedFrame = rounded;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // 4. GSAP Timeline: Pinning + Frame Scrubbing + Dual Left/Right Disappearing Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinTargetRef.current,
          start: 'top top',
          end: '+=260%', // Generous distance for all 3 battle acts
          pin: true,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            targetFrameRef.current = self.progress * (TOTAL_FRAMES - 1);
          },
        },
      });

      // Initially hide all cards
      gsap.set([act1LeftRef.current, act2LeftRef.current, act3LeftRef.current], {
        opacity: 0,
        x: -40,
        y: 40,
      });
      gsap.set([act1RightRef.current, act2RightRef.current, act3RightRef.current], {
        opacity: 0,
        x: 40,
        y: 40,
      });

      // --- ACT 1 (0.05 to 0.32) ---
      // Enter from bottom-left / bottom-right
      tl.to([act1LeftRef.current, act1RightRef.current], {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.08,
        ease: 'power2.out',
      }, 0.04);

      // Hold in place, then disappear to UP-LEFT and UP-RIGHT!
      tl.to(act1LeftRef.current, {
        opacity: 0,
        x: -90,
        y: -80,
        filter: 'blur(10px)',
        duration: 0.08,
        ease: 'power3.in',
      }, 0.26);

      tl.to(act1RightRef.current, {
        opacity: 0,
        x: 90,
        y: -80,
        filter: 'blur(10px)',
        duration: 0.08,
        ease: 'power3.in',
      }, 0.26);

      // --- ACT 2 (0.36 to 0.64) ---
      // Enter from bottom-left / bottom-right
      tl.to([act2LeftRef.current, act2RightRef.current], {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.08,
        ease: 'power2.out',
      }, 0.38);

      // Hold, then disappear to UP-LEFT and UP-RIGHT!
      tl.to(act2LeftRef.current, {
        opacity: 0,
        x: -90,
        y: -80,
        filter: 'blur(10px)',
        duration: 0.08,
        ease: 'power3.in',
      }, 0.58);

      tl.to(act2RightRef.current, {
        opacity: 0,
        x: 90,
        y: -80,
        filter: 'blur(10px)',
        duration: 0.08,
        ease: 'power3.in',
      }, 0.58);

      // --- ACT 3 (0.68 to 0.96) ---
      // Enter from bottom-left / bottom-right
      tl.to([act3LeftRef.current, act3RightRef.current], {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.08,
        ease: 'power2.out',
      }, 0.70);

      // Hold, then disappear to UP-LEFT and UP-RIGHT into the finale!
      tl.to(act3LeftRef.current, {
        opacity: 0,
        x: -90,
        y: -80,
        filter: 'blur(10px)',
        duration: 0.08,
        ease: 'power3.in',
      }, 0.90);

      tl.to(act3RightRef.current, {
        opacity: 0,
        x: 90,
        y: -80,
        filter: 'blur(10px)',
        duration: 0.08,
        ease: 'power3.in',
      }, 0.90);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="battle-experience-section" id="battle-experience">
      {/* Pinned Cinematic Stage */}
      <div ref={pinTargetRef} className="battle-pin-stage">
        {/* Background Atmospheric Red Glow & Grid */}
        <div className="battle-ambient-glow" />

        {/* Center Canvas Stage (The Video in the middle) */}
        <div className="battle-canvas-wrapper">
          <canvas ref={canvasRef} className="battle-frame-canvas" />
        </div>

        {/* Left Side Text Cards (Disappearing Up-Left) */}
        <div className="battle-text-column battle-text-left">
          {/* Act 1 Left */}
          <div ref={act1LeftRef} className="battle-card battle-card-left">
            <div className="battle-card-kanji-wrap">
              <span className="battle-kanji">{BATTLE_ACTS[0].left.kanji}</span>
              <span className="battle-badge">{BATTLE_ACTS[0].left.subtitle}</span>
            </div>
            <h3 className="battle-card-title">{BATTLE_ACTS[0].left.title}</h3>
            <p className="battle-card-body">{BATTLE_ACTS[0].left.body}</p>
          </div>

          {/* Act 2 Left */}
          <div ref={act2LeftRef} className="battle-card battle-card-left">
            <div className="battle-card-kanji-wrap">
              <span className="battle-kanji">{BATTLE_ACTS[1].left.kanji}</span>
              <span className="battle-badge">{BATTLE_ACTS[1].left.subtitle}</span>
            </div>
            <h3 className="battle-card-title">{BATTLE_ACTS[1].left.title}</h3>
            <p className="battle-card-body">{BATTLE_ACTS[1].left.body}</p>
          </div>

          {/* Act 3 Left */}
          <div ref={act3LeftRef} className="battle-card battle-card-left">
            <div className="battle-card-kanji-wrap">
              <span className="battle-kanji">{BATTLE_ACTS[2].left.kanji}</span>
              <span className="battle-badge">{BATTLE_ACTS[2].left.subtitle}</span>
            </div>
            <h3 className="battle-card-title">{BATTLE_ACTS[2].left.title}</h3>
            <p className="battle-card-body">{BATTLE_ACTS[2].left.body}</p>
          </div>
        </div>

        {/* Right Side Text Cards (Disappearing Up-Right) */}
        <div className="battle-text-column battle-text-right">
          {/* Act 1 Right */}
          <div ref={act1RightRef} className="battle-card battle-card-right">
            <div className="battle-card-kanji-wrap">
              <span className="battle-badge">{BATTLE_ACTS[0].right.subtitle}</span>
              <span className="battle-kanji">{BATTLE_ACTS[0].right.kanji}</span>
            </div>
            <h3 className="battle-card-title">{BATTLE_ACTS[0].right.title}</h3>
            <p className="battle-card-body">{BATTLE_ACTS[0].right.body}</p>
          </div>

          {/* Act 2 Right */}
          <div ref={act2RightRef} className="battle-card battle-card-right">
            <div className="battle-card-kanji-wrap">
              <span className="battle-badge">{BATTLE_ACTS[1].right.subtitle}</span>
              <span className="battle-kanji">{BATTLE_ACTS[1].right.kanji}</span>
            </div>
            <h3 className="battle-card-title">{BATTLE_ACTS[1].right.title}</h3>
            <p className="battle-card-body">{BATTLE_ACTS[1].right.body}</p>
          </div>

          {/* Act 3 Right */}
          <div ref={act3RightRef} className="battle-card battle-card-right">
            <div className="battle-card-kanji-wrap">
              <span className="battle-badge">{BATTLE_ACTS[2].right.subtitle}</span>
              <span className="battle-kanji">{BATTLE_ACTS[2].right.kanji}</span>
            </div>
            <h3 className="battle-card-title">{BATTLE_ACTS[2].right.title}</h3>
            <p className="battle-card-body">{BATTLE_ACTS[2].right.body}</p>
          </div>
        </div>

        {/* Edge Vignettes for Seamless Transitions */}
        <div className="battle-vignette-top" />
        <div className="battle-vignette-bottom" />
      </div>
    </section>
  );
}
