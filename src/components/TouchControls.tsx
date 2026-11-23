import React, { useRef, useState } from 'react';

interface TouchControlsProps {
  onMove: (x: number, y: number) => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onMove }) => {
  const padRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const activePointer = useRef<number | null>(null);

  const updateVector = (clientX: number, clientY: number) => {
    const el = padRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxR = rect.width / 2 - 16;

    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > maxR) {
      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
    }

    setKnob({ x: dx, y: dy });
    onMove(dx / maxR, -dy / maxR);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    activePointer.current = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateVector(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activePointer.current !== e.pointerId) return;
    e.stopPropagation();
    updateVector(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activePointer.current !== e.pointerId) return;
    e.stopPropagation();
    activePointer.current = null;
    setKnob({ x: 0, y: 0 });
    onMove(0, 0);
  };

  return (
    <div
      ref={padRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="fixed bottom-28 start-5 z-20 flex h-24 w-24 touch-none items-center justify-center rounded-full border border-[#C7A572]/40 bg-[#181614]/80 md:hidden"
      aria-label="Movement joystick"
    >
      <div
        className="h-10 w-10 rounded-full border border-[#EEE7DA]/60 bg-[#C7A572]/85"
        style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
      />
    </div>
  );
};
