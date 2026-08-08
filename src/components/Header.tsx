'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import ShareButton from './ShareButton';
import { readSession, writeSession } from '@/lib/session';

export default function Header({ showCta = true }: { showCta?: boolean }) {
  const [hasSession, setHasSession] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const s = readSession();
    if (s.email || s.pactId || s.userId) setHasSession(true);
  }, []);

  const openMyPact = async () => {
    const s = readSession();
    if (!s.email) {
      window.location.assign('/start');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: s.email,
          durationDays: Number(s.duration) || 3,
          forceNew: false,
        }),
      });
      const data = await res.json();
      if (res.ok && data.pactId) {
        writeSession({
          userId: data.userId || s.userId,
          pactId: data.pactId,
        });
        if (data.status === 'ACTIVE') {
          window.location.assign(`/pact/${data.pactId}`);
          return;
        }
        window.location.assign('/waiting');
        return;
      }
      window.location.assign('/start');
    } catch {
      window.location.assign('/start');
    } finally {
      setBusy(false);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: 'var(--border)',
        background: 'color-mix(in srgb, var(--background) 78%, transparent)',
        backdropFilter: 'blur(16px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-2">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3">
          {hasSession && (
            <button
              type="button"
              onClick={openMyPact}
              disabled={busy}
              className="text-sm font-semibold hidden sm:inline disabled:opacity-50"
              style={{ color: 'var(--accent)' }}
            >
              {busy ? '…' : 'Mon pacte'}
            </button>
          )}
          <ShareButton label="Partager" className="hidden sm:inline-block" />
          {showCta && (
            <Link href="/start" className="btn-primary !py-2 !px-4 !text-sm">
              {hasSession ? 'Reprendre' : 'Commencer'}
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
