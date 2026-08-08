'use client';

import { useEffect, useState } from 'react';

/**
 * Suggestion discrète : ajouter à l’écran d’accueil (iOS / Android).
 * Pas de prompt agressif — juste une aide une fois par appareil.
 */
export default function InstallHint() {
  const [show, setShow] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('pacte_install_dismissed') === '1') return;
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        // @ts-expect-error iOS
        window.navigator.standalone === true;
      if (standalone) return;

      const ua = navigator.userAgent;
      const ios = /iPad|iPhone|iPod/.test(ua);
      setIsIos(ios);
      // Afficher après un court délai pour ne pas gêner
      const t = setTimeout(() => setShow(true), 4000);
      return () => clearTimeout(t);
    } catch {
      /* ignore */
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    localStorage.setItem('pacte_install_dismissed', '1');
    setShow(false);
  };

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md p-4 rounded-2xl border shadow-lg text-sm"
      style={{
        background: 'var(--card-solid)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-lift)',
      }}
    >
      <p className="font-semibold" style={{ color: 'var(--accent)' }}>
        Sur ton téléphone
      </p>
      <p className="mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
        {isIos
          ? 'Safari → Partager → « Sur l’écran d’accueil » pour rouvrir le Pacte comme une appli.'
          : 'Menu du navigateur → « Installer l’application » ou « Ajouter à l’écran d’accueil ».'}
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="mt-3 text-xs font-semibold"
        style={{ color: 'var(--accent)' }}
      >
        Compris
      </button>
    </div>
  );
}
