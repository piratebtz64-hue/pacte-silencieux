'use client';

import { useEffect, useState, use, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  SUPPORT_MESSAGES,
  CATEGORY_LABELS,
  getMessageById,
  searchMessages,
  getMessagesByIntent,
  type MessageCategory,
  type MessageIntent,
  type SupportOpening,
} from '@/lib/messages';

const GESTURES = [
  { type: 'JE_SUIS_LA', label: 'Je suis là.' },
  { type: 'JE_TIENS', label: 'Je tiens.' },
  { type: 'AUJOURDHUI_FRAGILE', label: 'Aujourd’hui c’est fragile.' },
  { type: 'JE_VEILLE_AVEC_TOI', label: 'Je veille un peu avec toi.' },
];

const FAV_KEY = 'pacte-favorites';

interface Pact {
  id: string;
  status: string;
  durationDays: number;
  startedAt: string | null;
  endsAt: string | null;
  userAId: string | null;
  userBId: string | null;
  userA: { id: string } | null;
  userB: { id: string } | null;
}

interface SupportMsg {
  id: string;
  senderUserId: string;
  receiverUserId: string;
  openingId: string;
  openingText: string;
  responseText: string | null;
  createdAt: string;
  respondedAt: string | null;
}

export default function PactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [pact, setPact] = useState<Pact | null>(null);
  const [messages, setMessages] = useState<SupportMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'fil' | 'geste' | 'soutien'>('fil');
  const [intent, setIntent] = useState<MessageIntent | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<
    MessageCategory | 'all' | 'fav'
  >('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [lastSeenCount, setLastSeenCount] = useState(0);

  // Identité locale (plus fiable que seulement userA)
  const localUserId =
    typeof window !== 'undefined'
      ? localStorage.getItem('pacte_userId') || ''
      : '';
  const currentUserId =
    localUserId ||
    (pact?.userAId && pact?.userBId
      ? ''
      : pact?.userAId || pact?.userBId || '');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleFavorite = (msgId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(msgId)
        ? prev.filter((x) => x !== msgId)
        : [...prev, msgId];
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      return next;
    });
  };

  const load = async () => {
    try {
      const [pactRes, msgRes] = await Promise.all([
        fetch(`/api/pact?pactId=${id}`),
        fetch(`/api/support?pactId=${id}`),
      ]);
      if (!pactRes.ok) throw new Error('Pacte non trouvé');
      const pactData = await pactRes.json();
      setPact(pactData);
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData.messages || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 12000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (tab === 'fil') setLastSeenCount(messages.length);
  }, [tab, messages.length]);

  const unreadCount = Math.max(0, messages.length - lastSeenCount);

  const resolvedUserId =
    currentUserId ||
    (messages[0]
      ? localStorage.getItem('pacte_userId') || messages[0].senderUserId
      : '');

  const pendingForMe = messages.filter(
    (m) =>
      resolvedUserId &&
      m.receiverUserId === resolvedUserId &&
      !m.responseText &&
      m.senderUserId !== resolvedUserId
  ).length;

  const filteredOpenings = useMemo(() => {
    let list = search
      ? searchMessages(search, intent)
      : getMessagesByIntent(intent);
    if (selectedCategory === 'fav') {
      list = list.filter((m) => favorites.includes(m.id));
    } else if (selectedCategory !== 'all') {
      list = list.filter((m) => m.category === selectedCategory);
    }
    return list;
  }, [search, selectedCategory, favorites, intent]);

  const categoriesForIntent = useMemo(() => {
    const set = new Set(
      getMessagesByIntent(intent).map((m) => m.category)
    );
    return Array.from(set);
  }, [intent]);

  const sendGesture = async (type: string) => {
    const uid = localStorage.getItem('pacte_userId');
    if (!pact || !uid) {
      setStatusMsg('Session incomplète. Repars depuis /start.');
      return;
    }
    setSending(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/gesture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pactId: id, type, senderUserId: uid }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Erreur');
      }
      setStatusMsg('Geste envoyé.');
      setTab('fil');
    } catch (e) {
      setStatusMsg(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSending(false);
    }
  };

  const sendOpening = async (opening: SupportOpening) => {
    const uid = localStorage.getItem('pacte_userId');
    if (!pact || !uid) {
      setStatusMsg('Session incomplète. Repars depuis /start.');
      return;
    }
    setSending(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pactId: id,
          senderUserId: uid,
          openingId: opening.id,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Erreur');
      setStatusMsg('Message envoyé.');
      await load();
      setTab('fil');
    } catch (e) {
      setStatusMsg(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSending(false);
    }
  };

  const sendResponse = async (messageId: string, responseText: string) => {
    setSending(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, responseText }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Erreur');
      setStatusMsg('Réponse envoyée.');
      await load();
    } catch (e) {
      setStatusMsg(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center">
        <p className="text-[#706b63]">Chargement du pacte…</p>
      </main>
    );
  }

  if (error || !pact) {
    return (
      <main className="min-h-screen grid place-items-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-serif">Pacte introuvable</h1>
          <p className="mt-2 text-[#706b63]">{error}</p>
          <Link href="/" className="mt-6 inline-block text-[#1f6b67] font-bold">
            Retour
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 py-10">
        <div className="max-w-xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif">Votre pacte</h1>
              <p className="text-sm text-[#a49f96] mt-1">
                {pact.durationDays} jour{pact.durationDays > 1 ? 's' : ''}
                {pact.status === 'ACTIVE' ? ' · actif' : ' · en attente'}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                pact.status === 'ACTIVE'
                  ? 'bg-[#1f6b67]/15 text-[#1f6b67]'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
              }`}
            >
              {pact.status === 'ACTIVE' ? 'Actif' : 'En attente'}
            </span>
          </div>

          {statusMsg && (
            <div className="mt-4 p-3 rounded-lg bg-[#f2eee5] dark:bg-white/5 text-sm text-center">
              {statusMsg}
            </div>
          )}

          {pact.status === 'ACTIVE' && (
            <>
              <div className="mt-8 flex gap-2 border-b border-black/10 dark:border-white/10 pb-px">
                {([
                  ['fil', 'Fil'],
                  ['geste', 'Geste'],
                  ['soutien', 'Soutien'],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`relative px-4 py-2 text-sm font-bold rounded-t-lg transition ${
                      tab === key
                        ? 'bg-[#1f6b67] text-white'
                        : 'text-[#706b63] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {label}
                    {key === 'fil' && (unreadCount > 0 || pendingForMe > 0) && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] grid place-items-center">
                        {pendingForMe || unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {tab === 'fil' && (
                <div className="mt-6 space-y-4">
                  {pendingForMe > 0 && (
                    <div className="p-3 rounded-lg bg-[#1f6b67]/10 border border-[#1f6b67]/20 text-sm text-[#1f6b67] text-center">
                      {pendingForMe} message
                      {pendingForMe > 1 ? 's' : ''} en attente de ta réponse
                    </div>
                  )}
                  {messages.length === 0 && (
                    <p className="text-sm text-[#a49f96] text-center py-10">
                      Aucun message pour l’instant.
                      <br />
                      Va dans <strong>Soutien</strong> pour écrire ou demander.
                    </p>
                  )}
                  {messages.map((m) => {
                    const uid = localStorage.getItem('pacte_userId');
                    const isMine = uid ? m.senderUserId === uid : false;
                    const needsResponse =
                      uid &&
                      !isMine &&
                      !m.responseText &&
                      m.receiverUserId === uid;
                    const opening = getMessageById(m.openingId);

                    return (
                      <div key={m.id} className="space-y-2">
                        <div
                          className={`p-4 rounded-2xl border ${
                            isMine
                              ? 'bg-[#1f6b67]/10 border-[#1f6b67]/20 ml-6'
                              : 'bg-[#f2eee5] dark:bg-white/5 border-black/5 dark:border-white/10 mr-6'
                          }`}
                        >
                          <p className="text-xs text-[#a49f96] mb-1">
                            {isMine ? 'Toi' : 'L’autre personne'} ·{' '}
                            {new Date(m.createdAt).toLocaleString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p className="leading-relaxed">{m.openingText}</p>
                        </div>

                        {m.responseText && (
                          <div
                            className={`p-4 rounded-2xl border ${
                              !isMine
                                ? 'bg-[#1f6b67]/10 border-[#1f6b67]/20 ml-6'
                                : 'bg-[#f2eee5] dark:bg-white/5 border-black/5 dark:border-white/10 mr-6'
                            }`}
                          >
                            <p className="text-xs text-[#a49f96] mb-1">Réponse</p>
                            <p className="leading-relaxed">{m.responseText}</p>
                          </div>
                        )}

                        {needsResponse && opening && (
                          <div className="mr-6 p-4 rounded-xl border border-[#1f6b67]/30 bg-white dark:bg-white/5">
                            <p className="text-xs font-bold text-[#1f6b67] mb-3">
                              Choisir une réponse
                            </p>
                            <div className="space-y-2">
                              {opening.responses.map((r) => (
                                <button
                                  key={r}
                                  disabled={sending}
                                  onClick={() => sendResponse(m.id, r)}
                                  className="w-full text-left px-3 py-2.5 rounded-lg border border-black/10 dark:border-white/10 text-sm hover:border-[#1f6b67] hover:bg-[#1f6b67]/5 transition disabled:opacity-50"
                                >
                                  {r}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {tab === 'geste' && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm text-[#706b63] dark:text-[#a49f96] mb-4">
                    Un signe simple, sans explication.
                  </p>
                  {GESTURES.map((g) => (
                    <button
                      key={g.type}
                      disabled={sending}
                      onClick={() => sendGesture(g.type)}
                      className="w-full p-4 rounded-xl border border-black/10 dark:border-white/10 text-left font-medium hover:border-[#1f6b67] hover:bg-[#1f6b67]/5 transition disabled:opacity-50"
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              )}

              {tab === 'soutien' && (
                <div className="mt-6">
                  {/* Deux zones d’intention */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <button
                      type="button"
                      onClick={() => {
                        setIntent('offer');
                        setSelectedCategory('all');
                      }}
                      className={`p-4 rounded-2xl border text-left transition ${
                        intent === 'offer'
                          ? 'border-[#1f6b67] bg-[#1f6b67]/10 ring-2 ring-[#1f6b67]/30'
                          : 'border-black/10 dark:border-white/10 hover:border-[#1f6b67]/40'
                      }`}
                    >
                      <span className="block text-sm font-bold text-[#1f6b67]">
                        Je soutiens
                      </span>
                      <span className="block text-xs text-[#706b63] dark:text-[#a49f96] mt-1 leading-snug">
                        Offrir une présence, du courage, de la douceur…
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIntent('seek');
                        setSelectedCategory('all');
                      }}
                      className={`p-4 rounded-2xl border text-left transition ${
                        intent === 'seek'
                          ? 'border-[#1f6b67] bg-[#1f6b67]/10 ring-2 ring-[#1f6b67]/30'
                          : 'border-black/10 dark:border-white/10 hover:border-[#1f6b67]/40'
                      }`}
                    >
                      <span className="block text-sm font-bold text-[#1f6b67]">
                        J’ai besoin de soutien
                      </span>
                      <span className="block text-xs text-[#706b63] dark:text-[#a49f96] mt-1 leading-snug">
                        Dire que c’est lourd, la fatigue, la nuit…
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIntent('all')}
                    className={`mb-4 text-xs font-bold ${
                      intent === 'all' ? 'text-[#1f6b67]' : 'text-[#a49f96]'
                    }`}
                  >
                    Voir tous les messages
                  </button>

                  <p className="text-sm text-[#706b63] dark:text-[#a49f96] mb-3">
                    {intent === 'offer'
                      ? 'Messages pour soutenir l’autre personne.'
                      : intent === 'seek'
                        ? 'Messages pour exprimer ton besoin de soutien.'
                        : 'Choisis d’abord une zone, ou parcours tout.'}
                    {' '}
                    Limite : 2 messages / 12 h.
                  </p>

                  <input
                    type="search"
                    placeholder="Rechercher…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f6b67]/30 mb-4"
                  />

                  <div className="flex flex-wrap gap-2 mb-5">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedCategory === 'all'
                          ? 'bg-[#1f6b67] text-white'
                          : 'bg-black/5 dark:bg-white/10 text-[#706b63]'
                      }`}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setSelectedCategory('fav')}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedCategory === 'fav'
                          ? 'bg-[#1f6b67] text-white'
                          : 'bg-black/5 dark:bg-white/10 text-[#706b63]'
                      }`}
                    >
                      ♥ Favoris
                    </button>
                    {categoriesForIntent.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          selectedCategory === cat
                            ? 'bg-[#1f6b67] text-white'
                            : 'bg-black/5 dark:bg-white/10 text-[#706b63]'
                        }`}
                      >
                        {CATEGORY_LABELS[cat]}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
                    {filteredOpenings.length === 0 && (
                      <p className="text-sm text-[#a49f96] text-center py-8">
                        Aucun message dans cette zone.
                      </p>
                    )}
                    {filteredOpenings.map((m) => {
                      const isFav = favorites.includes(m.id);
                      return (
                        <div
                          key={m.id}
                          className="flex gap-2 items-start p-3 rounded-xl border border-black/10 dark:border-white/10 hover:border-[#1f6b67]/40 transition"
                        >
                          <button
                            type="button"
                            onClick={() => toggleFavorite(m.id)}
                            className={`mt-1 text-lg leading-none shrink-0 ${
                              isFav ? 'text-red-500' : 'text-[#a49f96]'
                            }`}
                          >
                            {isFav ? '♥' : '♡'}
                          </button>
                          <button
                            type="button"
                            disabled={sending}
                            onClick={() => sendOpening(m)}
                            className="flex-1 text-left disabled:opacity-50"
                          >
                            <span className="text-[10px] uppercase tracking-wide text-[#a49f96]">
                              {CATEGORY_LABELS[m.category]}
                              {m.intent === 'offer'
                                ? ' · soutenir'
                                : m.intent === 'seek'
                                  ? ' · besoin'
                                  : ''}
                            </span>
                            <p className="mt-0.5 text-sm leading-relaxed">{m.text}</p>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          <p className="mt-12 text-xs text-center text-[#a49f96] leading-relaxed">
            Ce n’est pas un substitut à une aide professionnelle.
            <br />
            En cas de détresse : 3114 (France).
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
