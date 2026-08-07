import { NextResponse } from 'next/server';

/** Mot de passe désactivé — route neutralisée pour ne pas casser le build */
export async function GET() {
  return NextResponse.json({ exists: false, hasPassword: false });
}

export async function POST() {
  return NextResponse.json(
    { error: 'Fonction mot de passe désactivée' },
    { status: 410 }
  );
}
