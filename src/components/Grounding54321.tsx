'use client';

import { useState } from 'react';

/**
 * Technique d’ancrage sensoriel 5-4-3-2-1
 * Usage clinique courant (anxiété, dissociation légère) — stabilisation, pas thérapie.
 */
const STEPS: {
  count: number;
  sense: string;
  title: string;
  prompt: string;
  tips: string[];
}[] = [
  {
    count: 5,
    sense: 'Vue',
    title: '5 choses que tu vois',
    prompt:
      'Regarde autour de toi. Nomme 5 choses précises — pas « un mur », plutôt « la fissure au-dessus de l’interrupteur ».',
    tips: [
      'La couleur d’un objet',
      'Une ombre',
      'Un détail sur ton téléphone',
      'Quelque chose au loin',
      'Quelque chose tout près',
    ],
  },
  {
    count: 4,
    sense: 'Toucher',
    title: '4 choses que tu sens au toucher',
    prompt:
      'Pieds au sol, dos contre le dossier, tissu des vêtements… Ressens volontairement chaque contact.',
    tips: [
      'Le sol sous tes pieds',
      'Le tissu sur ta peau',
      'La température de l’air',
      'Le poids de ton corps sur l’assise',
    ],
  },
  {
    count: 3,
    sense: 'Ouïe',
    title: '3 choses que tu entends',
    prompt:
      'Les bruits de fond comptent : ventilateur, rue, ton souffle. Écoute les couches.',
    tips: [
      'Un son proche',
      'Un son plus lointain',
      'Le son de ta respiration',
    ],
  },
  {
    count: 2,
    sense: 'Odorat',
    title: '2 odeurs',
    prompt:
      'Si rien n’est évident : odeur de tes vêtements, de ta peau, d’une pièce voisine. Cherche sans forcer.',
    tips: ['Une odeur dans la pièce', 'Une odeur sur toi ou un objet'],
  },
  {
    count: 1,
    sense: 'Goût',
    title: '1 goût',
    prompt:
      'Le goût dans ta bouche, une gorgée d’eau, ou un goût neutre. Si difficile : une chose pour laquelle tu es un peu reconnaissant·e.',
    tips: ['Le goût présent maintenant'],
  },
];

export default function Grounding54321() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const current = STEPS[step];

  if (done) {
    return (
      <div className="text-center py-6">
        <p className="font-serif text-xl">Tu es ici, maintenant.</p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Trois respirations lentes si tu veux. Si ça ne redescend pas : 3114.
        </p>
        <button
          type="button"
          onClick={() => {
            setStep(0);
            setDone(false);
          }}
          className="btn-ghost !text-sm mt-6"
        >
          Recommencer
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-1.5 mb-5 justify-center">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className="h-1.5 rounded-full flex-1 max-w-[2.5rem]"
            style={{
              background:
                i <= step ? 'var(--accent)' : 'var(--border)',
            }}
          />
        ))}
      </div>

      <p
        className="text-[10px] uppercase tracking-[0.14em] font-semibold text-center"
        style={{ color: 'var(--accent)' }}
      >
        {current.sense} · {current.count}
      </p>
      <h3 className="mt-2 font-serif text-xl text-center tracking-tight">
        {current.title}
      </h3>
      <p
        className="mt-4 text-sm leading-relaxed text-center max-w-[36ch] mx-auto"
        style={{ color: 'var(--muted)' }}
      >
        {current.prompt}
      </p>

      <ul className="mt-5 space-y-2">
        {current.tips.map((tip, i) => (
          <li
            key={tip}
            className="text-sm px-3.5 py-2.5 rounded-xl border"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--card-solid)',
            }}
          >
            <span style={{ color: 'var(--accent)' }}>{i + 1}.</span> {tip}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {step > 0 && (
          <button
            type="button"
            className="btn-ghost !text-sm"
            onClick={() => setStep((s) => s - 1)}
          >
            Précédent
          </button>
        )}
        <button
          type="button"
          className="btn-primary !text-sm"
          onClick={() => {
            if (step >= STEPS.length - 1) setDone(true);
            else setStep((s) => s + 1);
          }}
        >
          {step >= STEPS.length - 1 ? 'Terminer' : 'Étape suivante'}
        </button>
      </div>
    </div>
  );
}
