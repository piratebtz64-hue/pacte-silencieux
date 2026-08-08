/**
 * Temps réel via Supabase Realtime (WebSocket géré par Supabase).
 * Sur Vercel, un serveur WS maison n’est pas viable : on s’appuie sur Realtime.
 */

import { createClient, type RealtimeChannel, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

export function getRealtimeClient(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  if (!browserClient) {
    browserClient = createClient(url, key, {
      realtime: {
        params: { eventsPerSecond: 15 },
      },
    });
  }
  return browserClient;
}

export function pactChannelName(pactId: string) {
  return `pact:${pactId}`;
}

/** Écoute le match en temps réel (broadcast + changement de ligne Pact). */
export function subscribePactMatch(
  pactId: string,
  onMatched: (activePactId: string) => void
): () => void {
  const client = getRealtimeClient();
  if (!client) return () => {};

  let channel: RealtimeChannel | null = null;
  let closed = false;

  const handleMatch = (id: string) => {
    if (closed || !id) return;
    onMatched(id);
  };

  channel = client
    .channel(pactChannelName(pactId), {
      config: { broadcast: { self: true } },
    })
    .on('broadcast', { event: 'matched' }, (payload) => {
      const id =
        (payload.payload as { pactId?: string } | undefined)?.pactId || pactId;
      handleMatch(id);
    })
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'Pact',
        filter: `id=eq.${pactId}`,
      },
      (payload) => {
        const row = payload.new as { status?: string; id?: string } | null;
        if (row?.status === 'ACTIVE' && row.id) handleMatch(row.id);
      }
    )
    .subscribe();

  return () => {
    closed = true;
    if (channel) client.removeChannel(channel);
  };
}

/** Écoute les nouveaux messages de soutien sur un pacte actif. */
export function subscribeSupportMessages(
  pactId: string,
  onChange: () => void
): () => void {
  const client = getRealtimeClient();
  if (!client) return () => {};

  const channel = client
    .channel(`support:${pactId}`)
    .on('broadcast', { event: 'support' }, () => onChange())
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'SupportMessage',
        filter: `pactId=eq.${pactId}`,
      },
      () => onChange()
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

/** Côté serveur : notifier les canaux après un match (si service role dispo). */
export async function notifyMatchRealtime(
  waitingPactIds: string[],
  activePactId: string
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return;

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const admin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    await Promise.all(
      waitingPactIds.map(async (id) => {
        const ch = admin.channel(pactChannelName(id));
        await new Promise<void>((resolve) => {
          ch.subscribe((status) => {
            if (status === 'SUBSCRIBED') resolve();
          });
          setTimeout(() => resolve(), 800);
        });
        await ch.send({
          type: 'broadcast',
          event: 'matched',
          payload: { pactId: activePactId },
        });
        await admin.removeChannel(ch);
      })
    );
  } catch (e) {
    console.error('notifyMatchRealtime:', e);
  }
}
