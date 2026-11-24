import React, { forwardRef } from 'react';

/**
 * Center Poetic Statement Lines
 * Masks lines through a fixed-height center viewport slot so that
 * as the user scrolls, each line emerges from the bottom, centers cleanly
 * behind the katana blade, then floats up and out.
 */
export const STATEMENT_LINES = [
  {
    id: 1,
    words: [
      { text: 'THE GREATEST\u00A0', red: false },
      { text: 'BOUNDARIES', red: true },
    ],
  },
  {
    id: 2,
    words: [
      { text: 'ARE THE ONES WE\u00A0', red: false },
      { text: 'ACCEPT.', red: true },
    ],
  },
  {
    id: 3,
    words: [
      { text: 'THE GREATEST\u00A0', red: false },
      { text: 'BATTLES', red: true },
    ],
  },
  {
    id: 4,
    words: [
      { text: 'ARE THE ONES\u00A0', red: false },
      { text: 'WITHIN.', red: true },
    ],
  },
  {
    id: 5,
    words: [
      { text: 'AND THE GREATEST\u00A0', red: false },
      { text: 'VICTORIES', red: true },
    ],
  },
  {
    id: 6,
    words: [
      { text: 'BEGIN WHEN WE\u00A0', red: false },
      { text: 'REFUSE', red: true },
    ],
  },
  {
    id: 7,
    words: [
      { text: 'TO STAY\u00A0', red: false },
      { text: 'WHERE WE ARE.', red: true },
    ],
  },
];

const KatanaCenterText = forwardRef(function KatanaCenterText(props, ref) {
  return (
    <div ref={ref} className="katana-center-text-mask" aria-live="polite">
      {STATEMENT_LINES.map((line, idx) => (
        <div
          key={line.id}
          className="katana-center-line"
          data-index={idx}
          style={{
            transform: idx === 0 ? 'translate3d(0, 0%, 0)' : 'translate3d(0, 110%, 0)',
            opacity: idx === 0 ? 1 : 0,
          }}
        >
          {line.words.map((chunk, cIdx) => (
            <span
              key={cIdx}
              className={chunk.red ? 'center-text-red' : 'center-text-white'}
            >
              {chunk.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
});

export default KatanaCenterText;
