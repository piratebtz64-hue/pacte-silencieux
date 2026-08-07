'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SignalerPage() {
  const [sent, setSent] = useState(false);
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Enregistrement local / futur endpoint — pour l’instant confirmation UX
    console.info('Signalement:', text.slice(0, 500));
    setSent(true);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <article className="flex-1 max-w-md mx-auto px-4 py-12 w-full">
        <Link href="/" className="text-sm text-[#706b63] hover:underline">
          ← Accueil
        </Link>
        <h1 className="mt-6 text-3xl font-serif">Signaler un problème</h1>
        <p className="mt-3 text-sm text-[#706b63] dark:text-[#a49f96] leading-relaxed">
          Comportement inapproprié, bug, ou demande liée à tes données. Ne mets
          pas d’informations médicales sensibles inutiles.
        </p>

        {sent ? (
          <p className="mt-8 p-4 rounded-xl bg-[#1f6b67]/10 text-[#1f6b67] text-center">
            Merci. Ton signalement a été pris en compte.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1f6b67]/30"
              placeholder="Décris brièvement le problème…"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#1f6b67] text-white font-bold"
            >
              Envoyer le signalement
            </button>
          </form>
        )}
      </article>
      <Footer />
    </main>
  );
}
