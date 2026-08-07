'use client';

import { useEffect, useState } from 'react';
import { isSoundEnabled, setSoundEnabled } from '@/lib/sounds';

export default function SoundToggle({ className = '' }: { className?: string }) {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(isSoundEnabled());
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        const next = !on;
        setOn(next);
        setSoundEnabled(next);
      }}
      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${
        className
      }`}
      style={{
        borderColor: 'var(--border)',
        color: on ? 'var(--accent)' : 'var(--muted)',
        background: on ? 'var(--accent-soft)' : 'transparent',
      }}
      title={on ? 'Sons activés' : 'Sons coupés'}
    >
      {on ? '🔊 Sons' : '🔇 Muet'}
    </button>
  );
}
