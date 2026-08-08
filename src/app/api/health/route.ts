import { NextResponse } from 'next/server';
import { getMessageById, getMessageCount, SUPPORT_MESSAGES } from '@/lib/messages';
import { GESTURES } from '@/lib/gestures';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sampleIds = ['sal-1', 'pr-c1', 'mi-1', 'nu-3a', 'tr-1'];
  const samples: Record<string, string | null> = {};
  for (const id of sampleIds) {
    const m = getMessageById(id);
    samples[id] = m ? m.text.slice(0, 80) : null;
  }

  const categories = Array.from(new Set(SUPPORT_MESSAGES.map((m) => m.category))).sort();

  return NextResponse.json({
    ok: true,
    time: new Date().toISOString(),
    messageCount: getMessageCount(),
    gestureCount: GESTURES.length,
    categories: categories.length,
    categoryList: categories,
    samples,
    hasDatabase: Boolean(process.env.DATABASE_URL),
    hasSupabase: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    appUrl: process.env.NEXT_PUBLIC_APP_URL || null,
  });
}
