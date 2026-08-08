'use client';

import { useEffect, useState, use, useMemo, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExtendPrompt from '@/components/ExtendPrompt';
import CrisisPanel from '@/components/CrisisPanel';
import SoundToggle from '@/components/SoundToggle';
import SessionRecover from '@/components/SessionRecover';
import { readSession, writeSession } from '@/lib/session';
import {
  CATEGORY_LABELS,
  TONE_LABELS,
  getMessageById,
  filterMessages,
  getMessagesByIntent,
  SUPPORT_MESSAGES,
  type MessageCategory,
  type MessageIntent,
  type MessageTone,
  type SupportOpening,
} from '@/lib/messages';
import { GESTURES, GESTURE_GROUPS } from '@/lib/gestures';
import { playSendClick, playSoftChime, isSoundEnabled } from '@/lib/sounds';
import { getChainAfter, repliesForOpening } from '@/lib/chains';
import CheckInBar from '@/components/CheckInBar';

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

function hourSuggestions(): SupportOpening[] {
  const h = new Date().getHours();
  const prefer: MessageCategory[] =
    h >= 22 || h < 6
      ? ['nuit', 'presence', 'solitude', 'repos', 'micro']
      : h < 11
        ? ['matin', 'presence', 'salutation', 'courage', 'micro']
        : h < 18
          ? ['presence', 'difficile', 'travail', 'limites', 'douceur']
          : ['nuit', 'fatigue', 'presence', 'repos', 'remerciement'];

  const picked: SupportOpening[] = [];
  for (const cat of prefer) {
    const pool = SUPPORT_MESSAGES.filter(
      (m) => m.category === cat && (m.intensity ?? 2) <= 2
    );
    if (pool.length) {
      picked.push(pool[Math.floor(Math.random() * Math.min(3, pool.length))]);
    }
    if (picked.length >= 5) break;
  }
  while (picked.length < 5) {
    const m = SUPPORT_MESSAGES[Math.floor(Math.random() * SUPPORT_MESSAGES.length)];
    if (!picked.find((p) => p.id === m.id)) picked.push(m);
  }
  return picked.slice(0, 5);
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
  const [showCatalog, setShowCatalog] = useState(false);
  const [suggestions, setSuggestions] = useState<SupportOpening[]>([]);
  const prevMsgCount = useRef(0);
  const filEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = readSession();
    setUid(s.userId || localStorage.getItem('pacte_userId') || '');
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setSuggestions(hourSuggestions());
  }, []);

  useEffect(() => {
    if (id) writeSession({ pactId: id });
  }, [id]);

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
    if (tab === 'fil') {
      setLastSeenCount(messages.length);
      setTimeout(() => filEnd.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    }
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

  const primaryCategories = useMemo(() => {
    const priority = [
      'presence',
      'douceur',
      'nuit',
      'solitude',
      'difficile',
      'repos',
      'salutation',
      'remerciement',
    ] as MessageCategory[];
    const set = new Set(categoriesForIntent);
    return priority.filter((c) => set.has(c)).concat(
      categoriesForIntent.filter((c) => !priority.includes(c)).slice(0, 4)
    );
  }, [categoriesForIntent]);

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
      setStatusMsg('Session incomplète — reconnecte-toi avec le même email.');
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
        <div className="flex flex-col items-center gap-4">
          <div className="pact-breath" />
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Ouverture du pacte…
          </p>
        </div>
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
            Retourne sur{' '}
            <Link href="/start" className="underline" style={{ color: 'var(--accent)' }}>
              /start
            </Link>{' '}
            avec le <strong>même email</strong>.
          </p>
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

  const isEmptyFil = visibleMessages.length === 0;

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 py-8 md:py-12 pact-shell">
        <div className="max-w-lg mx-auto px-4 relative">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="pact-breath" aria-hidden />
              <div>
                <p className="text-xs font-semibold tracking-wide" style={{ color: 'var(--accent)' }}>
                  Pacte silencieux
                </p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {pact.durationDays} j
                  {pact.status === 'ACTIVE' && daysLeft !== null
                    ? ` · ${daysLeft} restant${daysLeft > 1 ? 's' : ''}`
                    : ''}
                  {pact.status === 'ENDED' ? ' · terminé' : ''}
                  {pact.status === 'WAITING' ? ' · en attente' : ''}
                </p>
              </div>
            </div>
            <SoundToggle />
          </div>

          {!uid && pact.status === 'ACTIVE' && (
            <SessionRecover
              pactId={pact.id || id}
              onRecovered={(userId) => setUid(userId)}
            />
          )}

          {statusMsg && (
            <p className="mt-3 text-center text-sm animate-fade-in" style={{ color: 'var(--accent)' }}>
              {statusMsg}
            </p>
          )}

          {uid && (pact.status === 'ACTIVE' || pact.status === 'ENDED') && (
            <ExtendPrompt
              pactId={pact.id || id}
              userId={uid}
              endsAt={pact.endsAt}
              onResolved={() => load()}
            />
          )}

          {pact.status === 'ENDED' && (
            <div className="pact-close">
              <div
                className="mx-auto mb-6 w-12 h-12 rounded-full grid place-items-center"
                style={{ background: 'var(--accent-soft)' }}
              >
                <span className="text-xl" style={{ color: 'var(--accent)' }}>·</span>
              </div>
              <h1 className="pact-welcome-title">Ce temps-là est terminé</h1>
              <p className="mt-4 text-sm leading-relaxed max-w-[32ch] mx-auto" style={{ color: 'var(--muted)' }}>
                Merci d’avoir tenu une présence. Tu peux relire le Fil ci-dessous,
                ou recommencer un autre jour si tu en ressens le besoin.
              </p>
              {visibleMessages.length > 0 && (
                <div className="mt-10 space-y-5 text-left">
                  {visibleMessages.slice(-6).map((m) => (
                    <div key={m.id} className="msg-bubble msg-bubble-theirs">
                      <p className="msg-body">{m.openingText}</p>
                      {m.responseText && (
                        <p className="msg-body mt-3 opacity-80">{m.responseText}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <Link href="/start" className="btn-primary mt-10 inline-flex">
                Un autre pacte
              </Link>
            </div>
          )}

          {pact.status === 'ACTIVE' && (
            <>
              <nav
                className="mt-6 p-1 rounded-full flex gap-0.5"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                }}
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
                    type="button"
                    key={key}
                    onClick={() => setTab(key)}
                    className={`pact-tab relative ${tab === key ? 'pact-tab-active' : ''}`}
                  >
                    {label}
                    {key === 'fil' && (unreadCount > 0 || pendingForMe > 0) && (
                      <span
                        className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                        style={{ background: 'var(--accent)' }}
                      />
                    )}
                  </button>
                ))}
              </nav>

              {tab === 'fil' && (
                <div className="mt-8">
                  {isEmptyFil ? (
                    <div className="pact-welcome">
                      <p className="pact-welcome-title">
                        Vous êtes reliés. Rien n’est attendu.
                      </p>
                      <p
                        className="mt-4 text-sm leading-relaxed max-w-[28ch] mx-auto"
                        style={{ color: 'var(--muted)' }}
                      >
                        Choisis un premier signe — ou reste en silence un moment.
                      </p>
                      <div className="mt-8 space-y-2.5 text-left max-w-sm mx-auto">
                        {(
                          [
                            ['JE_SUIS_LA', 'Je suis là.'],
                            ['PRESENCE_DISCRETE', 'Présence discrète. Pas besoin de répondre.'],
                            ['DOUCEMENT', 'Doucement.'],
                            ['RESPIRATION', 'Une respiration avec toi.'],
                            ['SANS_PRESSION', 'Sans pression.'],
                            ['C_EST_OK', 'C’est ok de ne rien dire.'],
                          ] as const
                        ).map(([type, label]) => (
                          <button
                            key={type}
                            type="button"
                            disabled={sending}
                            onClick={() => sendGesture(type)}
                            className="suggest-card disabled:opacity-50"
                          >
                            <span className="msg-body text-[1rem]">{label}</span>
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setTab('geste')}
                        className="mt-5 block mx-auto text-sm"
                        style={{ color: 'var(--accent)' }}
                      >
                        Voir tous les gestes →
                      </button>
                      <button
                        type="button"
                        onClick={() => setTab('soutien')}
                        className="mt-2 block mx-auto text-sm"
                        style={{ color: 'var(--muted)' }}
                      >
                        Ou un message →
                      </button>
                      <div className="mt-8 max-w-sm mx-auto">
                        <CheckInBar disabled={sending} onSend={sendGesture} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {pendingForMe > 0 && (
                        <p className="text-center text-xs tracking-wide" style={{ color: 'var(--accent)' }}>
                          Une réponse t’attend
                        </p>
                      )}
                      {visibleMessages.map((m, i) => {
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
                          <div
                            key={m.id}
                            className={`space-y-2 ${isMine ? 'pl-6' : 'pr-6'}`}
                            style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}
                          >
                            <div
                              className={`msg-bubble ${
                                isMine ? 'msg-bubble-mine' : 'msg-bubble-theirs'
                              }`}
                            >
                              <p className="msg-meta">
                                {isSystem ? 'Moment' : isMine ? 'Toi' : 'Présence'}
                                {isGesture ? ' · geste' : ''} ·{' '}
                                {new Date(m.createdAt).toLocaleString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                              <p className="msg-body">{m.openingText}</p>
                            </div>
                            {m.responseText && (
                              <div
                                className={`msg-bubble ${
                                  !isMine ? 'msg-bubble-mine' : 'msg-bubble-theirs'
                                }`}
                              >
                                <p className="msg-meta">Réponse</p>
                                <p className="msg-body">{m.responseText}</p>
                              </div>
                            )}
                            {needsResponse && (
                              <div className="pt-1 space-y-2">
                                <p className="text-xs tracking-wide px-1" style={{ color: 'var(--accent)' }}>
                                  Répondre
                                </p>
                                {repliesForOpening(opening).map((r) => (
                                  <button
                                    type="button"
                                    key={r}
                                    disabled={sending}
                                    onClick={() => sendResponse(m.id, r)}
                                    className="suggest-card text-sm disabled:opacity-50"
                                  >
                                    <span className="msg-body text-[0.95rem]">{r}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <div ref={filEnd} />

                      {(() => {
                        const last = visibleMessages[visibleMessages.length - 1];
                        if (
                          !last ||
                          last.openingId.startsWith('gesture:') ||
                          last.openingId.startsWith('system:')
                        )
                          return null;
                        const op = getMessageById(last.openingId);
                        const chain = getChainAfter(
                          op?.category,
                          visibleMessages.map((x) => x.openingId)
                        );
                        return (
                          <div
                            className="mt-8 pt-6 border-t"
                            style={{ borderColor: 'var(--border)' }}
                          >
                            <p
                              className="text-xs tracking-wide text-center mb-3"
                              style={{ color: 'var(--muted)' }}
                            >
                              Continuer le fil
                            </p>
                            <div className="space-y-2">
                              {chain.map((m) => (
                                <button
                                  key={m.id}
                                  type="button"
                                  disabled={sending}
                                  onClick={() => sendOpening(m)}
                                  className="suggest-card disabled:opacity-50"
                                >
                                  <span className="msg-body text-[0.95rem]">{m.text}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                      <CheckInBar disabled={sending} onSend={sendGesture} />
                    </div>
                  )}
                </div>
              )}

              {tab === 'geste' && (
                <div className="mt-8">
                  <p
                    className="font-serif text-xl leading-snug text-center max-w-[16ch] mx-auto"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    Un signe. Rien d’autre.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-6 mb-6">
                    <button
                      type="button"
                      onClick={() => setGestureGroup('all')}
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: gestureGroup === 'all' ? 'var(--accent-soft)' : 'transparent',
                        color: gestureGroup === 'all' ? 'var(--accent)' : 'var(--muted)',
                      }}
                    >
                      Tous
                    </button>
                    {GESTURE_GROUPS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGestureGroup(g)}
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: gestureGroup === g ? 'var(--accent-soft)' : 'transparent',
                          color: gestureGroup === g ? 'var(--accent)' : 'var(--muted)',
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2.5 max-h-[28rem] overflow-y-auto pr-1">
                    {visibleGestures.map((g) => (
                      <button
                        key={g.type}
                        type="button"
                        disabled={sending}
                        onClick={() => sendGesture(g.type)}
                        className="suggest-card disabled:opacity-50"
                      >
                        <span
                          className="text-[10px] uppercase tracking-wider block mb-1"
                          style={{ color: 'var(--muted)' }}
                        >
                          {g.group}
                        </span>
                        <span className="msg-body text-[1rem]">{g.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'soutien' && (
                <div className="mt-8">
                  <p className="font-serif text-xl leading-snug text-center max-w-[18ch] mx-auto">
                    Quelques mots. Pas tout le catalogue.
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 mt-6 mb-8">
                    <button
                      type="button"
                      onClick={() => {
                        setIntent('offer');
                        setSelectedCategory('all');
                      }}
                      className="p-4 rounded-2xl text-left border"
                      style={{
                        borderColor:
                          intent === 'offer'
                            ? 'color-mix(in srgb, var(--accent) 40%, transparent)'
                            : 'var(--border)',
                        background:
                          intent === 'offer' ? 'var(--accent-soft)' : 'var(--card-solid)',
                      }}
                    >
                      <span className="block text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                        Je soutiens
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIntent('seek');
                        setSelectedCategory('all');
                      }}
                      className="p-4 rounded-2xl text-left border"
                      style={{
                        borderColor:
                          intent === 'seek'
                            ? 'color-mix(in srgb, var(--accent) 40%, transparent)'
                            : 'var(--border)',
                        background:
                          intent === 'seek' ? 'var(--accent-soft)' : 'var(--card-solid)',
                      }}
                    >
                      <span className="block text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                        J’ai besoin
                      </span>
                    </button>
                  </div>

                  {!showCatalog && (
                    <div className="space-y-2.5">
                      <p className="text-xs tracking-wide text-center mb-3" style={{ color: 'var(--muted)' }}>
                        Suggestions du moment
                      </p>
                      {suggestions.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          disabled={sending}
                          onClick={() => sendOpening(m)}
                          className="suggest-card disabled:opacity-50"
                        >
                          <span className="msg-body text-[1rem]">{m.text}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setShowCatalog(true)}
                        className="w-full text-center text-sm py-4"
                        style={{ color: 'var(--muted)' }}
                      >
                        Voir plus de messages →
                      </button>
                    </div>
                  )}

                  {showCatalog && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowCatalog(false)}
                        className="text-sm mb-4"
                        style={{ color: 'var(--accent)' }}
                      >
                        ← Suggestions
                      </button>
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
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <button
                          type="button"
                          onClick={() => setSelectedCategory('all')}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background:
                              selectedCategory === 'all' ? 'var(--accent-soft)' : 'transparent',
                            color:
                              selectedCategory === 'all' ? 'var(--accent)' : 'var(--muted)',
                          }}
                        >
                          Tous
                        </button>
                        {primaryCategories.map((cat) => (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className="px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{
                              background:
                                selectedCategory === cat ? 'var(--accent-soft)' : 'transparent',
                              color:
                                selectedCategory === cat ? 'var(--accent)' : 'var(--muted)',
                            }}
                          >
                            {CATEGORY_LABELS[cat]}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-2 max-h-[26rem] overflow-y-auto">
                        {filteredOpenings.slice(0, 80).map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            disabled={sending}
                            onClick={() => sendOpening(m)}
                            className="suggest-card disabled:opacity-50"
                          >
                            <span
                              className="text-[10px] uppercase tracking-wider"
                              style={{ color: 'var(--muted)' }}
                            >
                              {CATEGORY_LABELS[m.category]}
                              {m.tone ? ` · ${TONE_LABELS[m.tone]}` : ''}
                            </span>
                            <p className="msg-body text-[0.95rem] mt-1">{m.text}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === 'crise' && (
                <div className="mt-8">
                  <CrisisPanel onSendGesture={sendGesture} />
                </div>
              )}
            </>
          )}

          <p className="mt-14 text-xs text-center" style={{ color: 'var(--muted)' }}>
            En détresse : 3114 · 15 · 112
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
