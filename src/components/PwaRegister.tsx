'use client';

import { useEffect } from 'react';

/** Enregistre le service worker (PWA légère) */
export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    const run = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    };
    if (document.readyState === 'complete') run();
    else window.addEventListener('load', run);
    return () => window.removeEventListener('load', run);
  }, []);
  return null;
}
