import React from 'react';
import FrameSequencePlayer from '../../components/ui/FrameSequencePlayer';
import './FrameSequenceTest.css';

export default function FrameSequenceTest() {
  return (
    <FrameSequencePlayer
      frameFolder="/frames"
      framePrefix="frame_"
      frameExtension="webp"
      totalFrames={192}
      scrollDistance="300vh"
      title="FRAME SEQUENCE TEST"
      className="frame-sequence-test-section"
    />
  );
}
