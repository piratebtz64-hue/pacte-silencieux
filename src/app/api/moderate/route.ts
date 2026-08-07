import { NextRequest, NextResponse } from 'next/server';
import { moderateText, moderationLog } from '@/lib/moderation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = String(body.text || '');
    const result = moderateText(text);
    moderationLog('api', result.allowed);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
