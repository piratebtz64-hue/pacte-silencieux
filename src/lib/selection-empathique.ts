/**
 * Parcours de sélection empathique — pas un test clinique.
 * Oriente vers intention (soutenir / être soutenu) et ton préféré.
 */

export type EmpathicAnswer = 'a' | 'b' | 'c' | 'd';

export type EmpathicQuestion = {
  id: string;
  text: string;
  options: { id: EmpathicAnswer; label: string }[];
};

export const EMPATHIC_QUESTIONS: EmpathicQuestion[] = [
  {
    id: 'moment',
    text: 'Comment tu te sens en ce moment ?',
    options: [
      { id: 'a', label: 'Un peu seul·e, sans trop savoir pourquoi' },
      { id: 'b', label: 'Lourd·e, j’aurais besoin qu’on reste un peu' },
      { id: 'c', label: 'Ça va à peu près, je veux plutôt offrir une présence' },
      { id: 'd', label: 'Je ne sais pas trop — je regarde juste' },
    ],
  },
  {
    id: 'parler',
    text: 'Envie de parler à quelqu’un en ce moment ?',
    options: [
      { id: 'a', label: 'Non, pas vraiment — juste une présence' },
      { id: 'b', label: 'Un peu, mais sans devoir tout expliquer' },
      { id: 'c', label: 'Oui, j’aimerais être entendu·e doucement' },
      { id: 'd', label: 'Je préfère plutôt soutenir quelqu’un d’autre' },
    ],
  },
  {
    id: 'soutien',
    text: 'Tu as quelqu’un autour pour te soutenir aujourd’hui ?',
    options: [
      { id: 'a', label: 'Pas vraiment, pas en ce moment' },
      { id: 'b', label: 'Oui, mais je n’ai pas envie de les déranger' },
      { id: 'c', label: 'Oui, et ça va' },
      { id: 'd', label: 'Je suis plutôt disponible pour les autres' },
    ],
  },
  {
    id: 'ton',
    text: 'Quel style de présence te ferait du bien ?',
    options: [
      { id: 'a', label: 'Très doux, presque silencieux' },
      { id: 'b', label: 'Chaleureux, simple, sans pression' },
      { id: 'c', label: 'Un peu de courage / motivation' },
      { id: 'd', label: 'Peu importe, tant que c’est respectueux' },
    ],
  },
];

export type EmpathicResult = {
  intent: 'offer' | 'seek' | 'both';
  toneHint: 'doux' | 'neutre' | 'energique' | 'all';
  message: string;
  suggestion: string;
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

  const messages: Record<EmpathicResult['intent'], string> = {
    seek:
      'Tu sembles avoir besoin d’une présence discrète. Ce n’est pas un échec — c’est un moment où être accompagné·e peut faire du bien.',
    offer:
      'Tu sembles plutôt disponible pour offrir une présence. Merci. Rester là, sans forcer, c’est déjà beaucoup.',
    both:
      'Tu peux à la fois avoir besoin d’être soutenu·e et envie d’en offrir. Les deux sont possibles ici, sans choisir un camp.',
  };

  const suggestion =
    intent === 'offer'
      ? 'Sur le pacte, tu pourras commencer par l’onglet « Je soutiens ».'
      : intent === 'seek'
        ? 'Sur le pacte, tu pourras commencer par « J’ai besoin de soutien ».'
        : 'Tu pourras alterner librement entre soutenir et être soutenu·e.';

  return {
    intent,
    toneHint,
    message: messages[intent],
    suggestion,
  };
}
