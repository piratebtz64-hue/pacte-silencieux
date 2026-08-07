'use client';

import { useEffect, useState, use, useMemo, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExtendPrompt from '@/components/ExtendPrompt';
import CrisisPanel from '@/components/CrisisPanel';
import SoundToggle from '@/components/SoundToggle';
import {
  CATEGORY_LABELS,
  TONE_LABELS,
  getMessageById,
  filterMessages,
  getMessagesByIntent,
  type MessageCategory,
  type MessageIntent,
  type MessageTone,
  type SupportOpening,
} from '@/lib/messages';
import { GESTURES, GESTURE_GROUPS } from '@/lib/gestures';
import { playSendClick, playSoftChime, isSoundEnabled } from '@/lib/sounds';

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
  const [tab, setTab] = useState<'fil' | 'geste' | 'soutien' | 'crise'>('fil');
  const [intent, setIntent] = useState<MessageIntent | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<
    MessageCategory | 'all' | 'fav'
  >('all');
  const [tone, setTone] = useState<MessageTone | 'all'>('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [lastSeenCount, setLastSeenCount] = useState(0);
  const [uid, setUid] = useState('');
  const [gestureGroup, setGestureGroup] = useState<string>('all');
  const prevMsgCount = useRef(0);

  useEffect(() => {
    setUid(localStorage.getItem('pacte_userId') || '');
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
      setPact(await pactRes.json());
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        const list = (msgData.messages || []).filter(
          (m: SupportMsg) =>
            !m.openingId.startsWith('system:extend:yes') &&
            !m.openingId.startsWith('system:extend:no')
        );
        if (list.length > prevMsgCount.current && prevMsgCount.current > 0) {
          if (isSoundEnabled()) playSoftChime();
        }
        prevMsgCount.current = list.length;
        setMessages(list);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (tab === 'fil') setLastSeenCount(messages.length);
  }, [tab, messages.length]);

  const unreadCount = Math.max(0, messages.length - lastSeenCount);
  const pendingForMe = messages.filter(
    (m) =>
      uid &&
      m.receiverUserId === uid &&
      !m.responseText &&
      m.senderUserId !== uid &&
      !m.openingId.startsWith('gesture:') &&
      !m.openingId.startsWith('system:')
  ).length;

  const filteredOpenings = useMemo(
    () =>
      filterMessages({
        intent,
        category: selectedCategory,
        tone,
        search,
        favorites,
      }),
    [intent, selectedCategory, tone, search, favorites]
  );

  const categoriesForIntent = useMemo(() => {
    return Array.from(
      new Set(getMessagesByIntent(intent).map((m) => m.category))
    );
  }, [intent]);

  const visibleGestures = useMemo(() => {
    if (gestureGroup === 'all') return GESTURES;
    return GESTURES.filter((g) => g.group === gestureGroup);
  }, [gestureGroup]);

  const daysLeft = useMemo(() => {
    if (!pact?.endsAt) return null;
    const ms = new Date(pact.endsAt).getTime() - Date.now();
    if (ms <= 0) return 0;
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  }, [pact?.endsAt]);

  const sendGesture = async (type: string) => {
    const pactId = pact?.id || id;
    if (!pactId) {
      setStatusMsg('Pacte introuvable. Recharge la page.');
      return;
    }
    const senderUserId =
      uid || localStorage.getItem('pacte_userId') || pact?.userAId || '';

    setSending(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/gesture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pactId,
          type,
          gestureType: type,
          senderUserId,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || d.detail || `Erreur ${res.status}`);
      playSendClick();
      setStatusMsg('Geste envoyé.');
      await load();
      setTab('fil');
    } catch (e) {
      setStatusMsg(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSending(false);
    }
  };

  const sendOpening = async (opening: SupportOpening) => {
    const senderUserId = uid || localStorage.getItem('pacte_userId') || '';
    if (!pact || !senderUserId) {
      setStatusMsg('Session incomplète. Repars depuis /start avec le même email.');
      return;
    }
    setSending(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pactId: pact.id || id,
          senderUserId,
          openingId: opening.id,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Erreur');
      playSendClick();
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
      playSendClick();
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
        <p style={{ color: 'var(--muted)' }}>Chargement du pacte…</p>
      </main>
    );
  }

  if (error || !pact) {
    return (
      <main className="min-h-screen grid place-items-center px-4">
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-serif">Pacte introuvable</h1>
          <p className="mt-2" style={{ color: 'var(--muted)' }}>
            {error}
          </p>
          <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
            Pour retrouver un pacte actif : retourne sur{' '}
            <Link href="/start" className="underline" style={{ color: 'var(--accent)' }}>
              /start
            </Link>{' '}
            avec le <strong>même email</strong>.
          </p>
          <Link href="/" className="mt-6 inline-block font-bold" style={{ color: 'var(--accent)' }}>
            Accueil
          </Link>
        </div>
      </main>
    );
  }

  const visibleMessages = messages.filter(
    (m) =>
      m.openingId === 'system:extend:done' ||
      m.openingId === 'system:extend:ended' ||
      (!m.openingId.startsWith('system:extend:yes') &&
        !m.openingId.startsWith('system:extend:no'))
  );

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 py-10">
        <div className="max-w-xl mx-auto px-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif tracking-tight">Votre pacte</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                {pact.durationDays} jour{pact.durationDays > 1 ? 's' : ''}
                {pact.status === 'ACTIVE'
                  ? ' · actif'
                  : pact.status === 'ENDED'
                    ? ' · terminé'
                    : ' · en attente'}
                {daysLeft !== null && pact.status === 'ACTIVE'
                  ? ` · ${daysLeft} j restant${daysLeft > 1 ? 's' : ''}`
                  : ''}
                {visibleMessages.length > 0
                  ? ` · ${visibleMessages.length} échange${visibleMessages.length > 1 ? 's' : ''}`
                  : ''}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <SoundToggle />
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background:
                    pact.status === 'ACTIVE'
                      ? 'var(--accent-soft)'
                      : 'var(--card)',
                  color:
                    pact.status === 'ACTIVE'
                      ? 'var(--accent)'
                      : 'var(--muted)',
                }}
              >
                {pact.status === 'ACTIVE'
                  ? 'Actif'
                  : pact.status === 'ENDED'
                    ? 'Terminé'
                    : 'En attente'}
              </span>
            </div>
          </div>

          <div
            className="mt-4 p-3 rounded-xl text-xs leading-relaxed"
            style={{
              background: 'var(--accent-soft)',
              color: 'var(--muted)',
            }}
          >
            <strong style={{ color: 'var(--accent)' }}>Reconnexion :</strong>{' '}
            avec le même email sur /start, tu reprends ce pacte et tout le Fil
            (historique conservé pendant toute la durée).
          </div>

          {statusMsg && (
            <div
              className="mt-4 p-3 rounded-lg text-sm text-center"
              style={{ background: 'var(--card)' }}
            >
              {statusMsg}
            </div>
          )}

          {uid && (pact.status === 'ACTIVE' || pact.status === 'ENDED') && (
            <ExtendPrompt
              pactId={pact.id || id}
              userId={uid}
              endsAt={pact.endsAt}
              onResolved={() => load()}
            />
          )}

          {pact.status === 'ACTIVE' && (
            <>
              <div
                className="mt-8 flex gap-1 border-b overflow-x-auto"
                style={{ borderColor: 'var(--border)' }}
              >
                {(
                  [
                    ['fil', 'Fil'],
                    ['geste', 'Geste'],
                    ['soutien', 'Soutien'],
                    ['crise', 'Crise'],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className="relative px-3.5 py-2 text-sm font-bold rounded-t-lg transition shrink-0"
                    style={
                      tab === key
                        ? {
                            background: 'var(--accent)',
                            color: '#fff',
                          }
                        : { color: 'var(--muted)' }
                    }
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
                    <div
                      className="p-3 rounded-lg text-sm text-center"
                      style={{
                        background: 'var(--accent-soft)',
                        color: 'var(--accent)',
                      }}
                    >
                      {pendingForMe} message
                      {pendingForMe > 1 ? 's' : ''} en attente de ta réponse
                    </div>
                  )}
                  {visibleMessages.length === 0 && (
                    <p
                      className="text-sm text-center py-10"
                      style={{ color: 'var(--muted)' }}
                    >
                      Aucun message encore. Va dans <strong>Soutien</strong>,{' '}
                      <strong>Geste</strong> ou <strong>Crise</strong>.
                    </p>
                  )}
                  {visibleMessages.map((m) => {
                    const isMine = uid ? m.senderUserId === uid : false;
                    const isGesture = m.openingId.startsWith('gesture:');
                    const isSystem = m.openingId.startsWith('system:');
                    const needsResponse =
                      !!uid &&
                      !isMine &&
                      !m.responseText &&
                      m.receiverUserId === uid &&
                      !isGesture &&
                      !isSystem;
                    const opening = getMessageById(m.openingId);
                    return (
                      <div key={m.id} className="space-y-2">
                        <div
                          className={`p-4 rounded-2xl border ${
                            isMine ? 'ml-6' : 'mr-6'
                          }`}
                          style={{
                            borderColor: isSystem
                              ? 'color-mix(in srgb, var(--accent) 25%, transparent)'
                              : 'var(--border)',
                            background: isMine
                              ? 'var(--accent-soft)'
                              : 'var(--card)',
                          }}
                        >
                          <p
                            className="text-xs mb-1"
                            style={{ color: 'var(--muted)' }}
                          >
                            {isSystem
                              ? 'Système'
                              : isMine
                                ? 'Toi'
                                : 'L’autre'}
                            {isGesture ? ' · geste' : ''} ·{' '}
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
                              !isMine ? 'ml-6' : 'mr-6'
                            }`}
                            style={{
                              borderColor: 'var(--border)',
                              background: !isMine
                                ? 'var(--accent-soft)'
                                : 'var(--card)',
                            }}
                          >
                            <p
                              className="text-xs mb-1"
                              style={{ color: 'var(--muted)' }}
                            >
                              Réponse
                            </p>
                            <p>{m.responseText}</p>
                          </div>
                        )}
                        {needsResponse && opening && (
                          <div
                            className="mr-6 p-4 rounded-xl border"
                            style={{
                              borderColor:
                                'color-mix(in srgb, var(--accent) 35%, transparent)',
                            }}
                          >
                            <p
                              className="text-xs font-bold mb-3"
                              style={{ color: 'var(--accent)' }}
                            >
                              Choisir une réponse
                            </p>
                            <div className="space-y-2">
                              {opening.responses.map((r) => (
                                <button
                                  key={r}
                                  disabled={sending}
                                  onClick={() => sendResponse(m.id, r)}
                                  className="w-full text-left px-3 py-2.5 rounded-lg border text-sm disabled:opacity-50"
                                  style={{ borderColor: 'var(--border)' }}
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
                <div className="mt-6">
                  <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>
                    Un signe simple. <strong>{GESTURES.length} gestes</strong>.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setGestureGroup('all')}
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background:
                          gestureGroup === 'all'
                            ? 'var(--accent)'
                            : 'var(--card)',
                        color: gestureGroup === 'all' ? '#fff' : 'var(--muted)',
                      }}
                    >
                      Tous
                    </button>
                    {GESTURE_GROUPS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGestureGroup(g)}
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background:
                            gestureGroup === g ? 'var(--accent)' : 'var(--card)',
                          color: gestureGroup === g ? '#fff' : 'var(--muted)',
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2 max-h-[28rem] overflow-y-auto">
                    {visibleGestures.map((g) => (
                      <button
                        key={g.type}
                        type="button"
                        disabled={sending}
                        onClick={() => sendGesture(g.type)}
                        className="w-full p-3.5 rounded-xl border text-left font-medium disabled:opacity-50"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <span
                          className="text-[10px] uppercase block mb-0.5"
                          style={{ color: 'var(--muted)' }}
                        >
                          {g.group}
                        </span>
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'soutien' && (
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIntent('offer');
                        setSelectedCategory('all');
                      }}
                      className="p-4 rounded-2xl border text-left"
                      style={{
                        borderColor:
                          intent === 'offer'
                            ? 'var(--accent)'
                            : 'var(--border)',
                        background:
                          intent === 'offer'
                            ? 'var(--accent-soft)'
                            : 'transparent',
                      }}
                    >
                      <span
                        className="block text-sm font-bold"
                        style={{ color: 'var(--accent)' }}
                      >
                        Je soutiens
                      </span>
                      <span
                        className="block text-xs mt-1"
                        style={{ color: 'var(--muted)' }}
                      >
                        Présence, courage…
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIntent('seek');
                        setSelectedCategory('all');
                      }}
                      className="p-4 rounded-2xl border text-left"
                      style={{
                        borderColor:
                          intent === 'seek' ? 'var(--accent)' : 'var(--border)',
                        background:
                          intent === 'seek'
                            ? 'var(--accent-soft)'
                            : 'transparent',
                      }}
                    >
                      <span
                        className="block text-sm font-bold"
                        style={{ color: 'var(--accent)' }}
                      >
                        J’ai besoin de soutien
                      </span>
                      <span
                        className="block text-xs mt-1"
                        style={{ color: 'var(--muted)' }}
                      >
                        Jour difficile, trac…
                      </span>
                    </button>
                  </div>

                  <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>
                    <strong>Échanges illimités</strong>. Historique dans le Fil
                    pendant toute la durée.
                  </p>

                  <input
                    type="search"
                    placeholder="Rechercher…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm mb-3"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--card-solid)',
                    }}
                  />

                  <div className="flex flex-wrap gap-2 mb-3">
                    {(
                      [
                        ['all', 'Tous'],
                        ['doux', 'Doux'],
                        ['neutre', 'Neutre'],
                        ['energique', 'Énergique'],
                        ['court', 'Court'],
                      ] as const
                    ).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setTone(key)}
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background:
                            tone === key ? 'var(--accent)' : 'var(--card)',
                          color: tone === key ? '#fff' : 'var(--muted)',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background:
                          selectedCategory === 'all'
                            ? 'var(--accent)'
                            : 'var(--card)',
                        color:
                          selectedCategory === 'all' ? '#fff' : 'var(--muted)',
                      }}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setSelectedCategory('fav')}
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background:
                          selectedCategory === 'fav'
                            ? 'var(--accent)'
                            : 'var(--card)',
                        color:
                          selectedCategory === 'fav' ? '#fff' : 'var(--muted)',
                      }}
                    >
                      ♥ Favoris
                    </button>
                    {categoriesForIntent.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background:
                            selectedCategory === cat
                              ? 'var(--accent)'
                              : 'var(--card)',
                          color:
                            selectedCategory === cat ? '#fff' : 'var(--muted)',
                        }}
                      >
                        {CATEGORY_LABELS[cat]}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 max-h-[28rem] overflow-y-auto">
                    {filteredOpenings.map((m) => {
                      const isFav = favorites.includes(m.id);
                      return (
                        <div
                          key={m.id}
                          className="flex gap-2 items-start p-3 rounded-xl border"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <button
                            type="button"
                            onClick={() => toggleFavorite(m.id)}
                            className={`mt-1 text-lg ${
                              isFav ? 'text-red-500' : ''
                            }`}
                            style={!isFav ? { color: 'var(--muted)' } : undefined}
                          >
                            {isFav ? '♥' : '♡'}
                          </button>
                          <button
                            type="button"
                            disabled={sending}
                            onClick={() => sendOpening(m)}
                            className="flex-1 text-left disabled:opacity-50"
                          >
                            <span
                              className="text-[10px] uppercase"
                              style={{ color: 'var(--muted)' }}
                            >
                              {CATEGORY_LABELS[m.category]}
                              {m.tone ? ` · ${TONE_LABELS[m.tone]}` : ''}
                            </span>
                            <p className="mt-0.5 text-sm leading-relaxed">
                              {m.text}
                            </p>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {tab === 'crise' && (
                <div className="mt-6">
                  <CrisisPanel onSendGesture={sendGesture} />
                </div>
              )}
            </>
          )}

          <p
            className="mt-12 text-xs text-center"
            style={{ color: 'var(--muted)' }}
          >
            En cas de détresse : 3114 (France).
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
