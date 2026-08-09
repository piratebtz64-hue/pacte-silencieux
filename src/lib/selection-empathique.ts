/**
 * Sélection empathique — orientation douce, pas un test clinique.
 */

export type EmpathicAnswer = 'a' | 'b' | 'c' | 'd';

export type EmpathicQuestion = {
  id: string;
  text: string;
  hint?: string;
  options: { id: EmpathicAnswer; label: string }[];
};

export const EMPATHIC_QUESTIONS: EmpathicQuestion[] = [
  {
    id: 'moment',
    text: 'Où en es-tu, là, maintenant ?',
    hint: 'Une impression suffit. Pas besoin d’analyser.',
    options: [
      { id: 'a', label: 'Un peu seul·e' },
      { id: 'b', label: 'C’est lourd aujourd’hui' },
      { id: 'c', label: 'Ça va — j’ai de la place pour quelqu’un' },
      { id: 'd', label: 'Je ne sais pas trop' },
    ],
  },
  {
    id: 'parler',
    text: 'As-tu envie de parler à quelqu’un ?',
    hint: 'Ici, on ne discute pas librement : seulement des messages déjà écrits.',
    options: [
      { id: 'a', label: 'Non — juste savoir que quelqu’un est là' },
      { id: 'b', label: 'Un peu, sans tout raconter' },
      { id: 'c', label: 'Oui, être entendu·e doucement' },
      { id: 'd', label: 'Je préfère plutôt soutenir quelqu’un' },
    ],
  },
  {
    id: 'soutien',
    text: 'As-tu quelqu’un de disponible près de toi ?',
    options: [
      { id: 'a', label: 'Pas vraiment, pas en ce moment' },
      { id: 'b', label: 'Oui, mais je ne veux pas déranger' },
      { id: 'c', label: 'Oui, et c’est ok' },
      { id: 'd', label: 'Je suis plutôt dispo pour les autres' },
    ],
  },
  {
    id: 'ton',
    text: 'Quelle présence te ferait du bien ?',
    options: [
      { id: 'a', label: 'Très douce, presque silencieuse' },
      { id: 'b', label: 'Simple et chaleureuse' },
      { id: 'c', label: 'Un peu de courage' },
      { id: 'd', label: 'Peu importe, tant que c’est respectueux' },
    ],
  },
];

export type EmpathicResult = {
  intent: 'offer' | 'seek' | 'both';
  toneHint: 'doux' | 'neutre' | 'energique' | 'all';
  title: string;
  message: string;
  suggestion: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export function computeEmpathicResult(
  answers: Record<string, EmpathicAnswer>
): EmpathicResult {
  let seek = 0;
  let offer = 0;

  if (answers.moment === 'a' || answers.moment === 'b') seek += 2;
  if (answers.moment === 'c') offer += 2;
  if (answers.moment === 'd') {
    seek += 1;
    offer += 1;
  }

  if (answers.parler === 'a' || answers.parler === 'b' || answers.parler === 'c')
    seek += 1;
  if (answers.parler === 'd') offer += 2;

  if (answers.soutien === 'a' || answers.soutien === 'b') seek += 2;
  if (answers.soutien === 'd') offer += 2;
  if (answers.soutien === 'c') offer += 1;

  let intent: EmpathicResult['intent'] = 'both';
  if (seek > offer + 1) intent = 'seek';
  else if (offer > seek + 1) intent = 'offer';

  let toneHint: EmpathicResult['toneHint'] = 'all';
  if (answers.ton === 'a') toneHint = 'doux';
  else if (answers.ton === 'b') toneHint = 'neutre';
  else if (answers.ton === 'c') toneHint = 'energique';

  const titles: Record<EmpathicResult['intent'], string> = {
    seek: 'Tu sembles avoir besoin d’une présence',
    offer: 'Tu sembles prêt·e à offrir une présence',
    both: 'Les deux sont possibles ici',
  };

  const messages: Record<EmpathicResult['intent'], string> = {
    seek:
      'Pas besoin d’expliquer toute ton histoire. Un pacte, c’est quelqu’un d’anonyme qui reste un peu, avec des gestes et des messages déjà écrits.',
    offer:
      'Rester là sans forcer, c’est déjà beaucoup. Tu pourras choisir des messages de soutien — sans chat libre.',
    both:
      'Tu peux avoir besoin d’être soutenu·e et aussi envie d’en offrir. Tu n’as pas à choisir un camp.',
  };

  const toneLine =
    toneHint === 'doux'
      ? 'Préférence : ton très doux.'
      : toneHint === 'neutre'
        ? 'Préférence : ton simple et chaleureux.'
        : toneHint === 'energique'
          ? 'Préférence : un peu de courage.'
          : 'Ton : selon ce qui te convient sur le moment.';

  const suggestion =
    intent === 'offer'
      ? `${toneLine} Ensuite : commence un pacte, ou respire d’abord si tu en as besoin.`
      : intent === 'seek'
        ? `${toneLine} Si c’est trop fort : 3114. Sinon, un pacte ou un outil de respiration.`
        : `${toneLine}`;

  return {
    intent,
    toneHint,
    title: titles[intent],
    message: messages[intent],
    suggestion,
    primaryHref: '/start',
    primaryLabel: 'Commencer un pacte',
    secondaryHref:
      intent === 'seek' ? '/outils?outil=coherence' : '/outils',
    secondaryLabel:
      intent === 'seek' ? 'Respirer d’abord' : 'Voir les outils',
  };
}
