'use client';

import { useState } from 'react';

/**
 * Micro-pratiques de pleine conscience — courtes, sans jargon,
 * compatibles avec un espace de soutien pair (pas un cours de méditation).
 */
const PRACTICES = [
  {
    id: 'pieds',
    label: 'Pieds au sol',
    duration: '1 min',
    steps: [
      'Assieds-toi ou tiens-toi debout.',
      'Sens le contact des deux pieds avec le sol.',
      'Sans rien changer : juste remarquer la pression, la température.',
      'Si l’esprit part : reviens aux pieds. Encore une fois.',
      'C’est tout. Tu es ici.',
    ],
  },
  {
    id: 'souffle',
    label: 'Suivre le souffle',
    duration: '2 min',
    steps: [
      'Pose une main sur le ventre si tu veux.',
      'Remarque l’air qui entre… et qui sort.',
      'Tu n’as pas à contrôler. Juste observer.',
      'Quand une pensée arrive : « pensé », puis retour au souffle.',
      'Trois cycles encore, puis ouvre les yeux si tu les avais fermés.',
    ],
  },
  {
    id: 'corps',
    label: 'Balayage doux',
    duration: '2 min',
    steps: [
      'Parcours mentalement : pieds → jambes → bassin.',
      'Puis ventre → poitrine → épaules.',
      'Puis mâchoire → front.',
      'Là où c’est tendu : ne force pas. Note juste « tension ».',
      'Reviens à l’ensemble du corps, une seconde.',
    ],
  },
  {
    id: 'laisser',
    label: 'Laisser passer',
    duration: '1 min',
    steps: [
      'Imagine les pensées comme des nuages.',
      'Tu n’as pas à les attraper ni à les chasser.',
      'Une pensée difficile : « c’est une pensée », puis laisse-la glisser.',
      'Reviens à ce que tu vois ou touches maintenant.',
      'Fin. Rien à réussir.',
    ],
  },
] as const;

export default function MindfulnessMini() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const practice = PRACTICES.find((p) => p.id === activeId);

  if (practice) {
    const last = step >= practice.steps.length - 1;
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            setActiveId(null);
            setStep(0);
          }}
          className="text-xs"
          style={{ color: 'var(--muted)' }}
        >
          ← Pratiques
        </button>
        <h3 className="mt-3 font-serif text-xl tracking-tight">{practice.label}</h3>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          {practice.duration} · étape {step + 1}/{practice.steps.length}
        </p>
        <p className="mt-5 text-sm leading-relaxed font-serif text-[1.05rem]">
          {practice.steps[step]}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {step > 0 && (
            <button
              type="button"
              className="btn-ghost !text-sm"
              onClick={() => setStep((s) => s - 1)}
            >
              Précédent
            </button>
          )}
          {!last ? (
            <button
              type="button"
              className="btn-primary !text-sm"
              onClick={() => setStep((s) => s + 1)}
            >
              Suite
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary !text-sm"
              onClick={() => {
                setActiveId(null);
                setStep(0);
              }}
            >
              Terminer
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--muted)' }}>
        Courtes, sans obligation de « vider l’esprit ». Juste revenir un instant.
      </p>
      {PRACTICES.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => {
            setActiveId(p.id);
            setStep(0);
          }}
          className="w-full text-left p-3.5 rounded-xl border"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--card-solid)',
          }}
        >
          <span className="block text-sm font-semibold">{p.label}</span>
          <span className="block text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {p.duration}
          </span>
        </button>
      ))}
    </div>
  );
}
