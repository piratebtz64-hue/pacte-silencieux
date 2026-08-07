import { createServerSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const pactId = request.nextUrl.searchParams.get('pactId');

  if (!code || !pactId) {
    return NextResponse.redirect(new URL('/start?error=invalid-link', request.url));
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL('/start?error=expired-link', request.url));
  }

  return NextResponse.redirect(new URL(`/pact/${encodeURIComponent(pactId)}`, request.url));
}
