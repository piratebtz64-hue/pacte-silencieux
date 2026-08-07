'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { moderateText } from '@/lib/moderation';

export default function SignalerPage() {
  const [sent, setSent] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [crisis, setCrisis] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCrisis(false);

    const mod = moderateText(text);
    if (!mod.allowed) {
      setError(mod.reason || 'Message non autorisé');
      return;
    }
    if (mod.crisisHint) {
      setCrisis(true);
    }

    console.info('Signalement (modéré OK):', text.slice(0, 200).length, 'chars');
    setSent(true);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <article className="flex-1 max-w-md mx-auto px-4 py-12 w-full">
        <Link href="/" className="text-sm" style={{ color: 'var(--muted)' }}>
          ← Accueil
        </Link>
        <h1 className="mt-6 text-3xl font-serif tracking-tight">Signaler un problème</h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Comportement inapproprié, bug, ou demande liée à tes données. Ne mets
          pas d’informations médicales sensibles inutiles.
        </p>

        {sent ? (
          <div className="mt-8 space-y-4">
            <p
              className="p-4 rounded-xl text-center text-sm"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              Merci. Ton signalement a été pris en compte.
            </p>
            {crisis && (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                Si tu es en détresse : <strong>3114</strong> (France), 24h/24.
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border text-sm"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--card-solid)',
              }}
              placeholder="Décris brièvement le problème…"
            />
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <button type="submit" className="btn-primary w-full">
              Envoyer le signalement
            </button>
          </form>
        )}
      </article>
      <Footer />
    </main>
  );
}
