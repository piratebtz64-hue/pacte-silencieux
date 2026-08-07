'use client';

import { useEffect, useState } from 'react';

/** Active les notifications navigateur (et rappelle l’e-mail de session) */
export default function NotifyToggle() {
  const [perm, setPerm] = useState<NotificationPermission | 'unsupported'>(
    'default'
  );

  useEffect(() => {
    if (typeof Notification === 'undefined') {
      setPerm('unsupported');
      return;
    }
    setPerm(Notification.permission);
  }, []);

  const enable = async () => {
    if (typeof Notification === 'undefined') return;
    const p = await Notification.requestPermission();
    setPerm(p);
    if (p === 'granted') {
      try {
        new Notification('Le Pacte silencieux', {
          body: 'Notifications activées. Tu seras alerté sur cet appareil.',
          silent: true,
        });
      } catch {
        /* ignore */
      }
    }
  };

  if (perm === 'unsupported') return null;
  if (perm === 'granted') {
    return (
      <p className="text-xs text-[#1f6b67]">Notifications navigateur activées</p>
    );
  }

  return (
    <button
      type="button"
      onClick={enable}
      className="text-xs font-bold text-[#1f6b67] underline"
    >
      Activer les notifications sur cet appareil
    </button>
  );
}
