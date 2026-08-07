import type { SupportOpening } from './messages-types';

/**
 * Micro-patterns : écoute active + communication non violente (CNV)
 *
 * Écoute active (résumé) :
 * 1. Accueillir sans juger
 * 2. Refléter le ressenti / le besoin
 * 3. Valider (« ça a du sens »)
 * 4. Rester présent sans solutionner
 *
 * CNV (4 temps, adaptés au cadre sans chat libre) :
 * Observation → Sentiment → Besoin → Demande (douce, non exigeante)
 *
 * Ici : scripts courts, concrets, utilisables tels quels.
 */

const R_HEARD = [
  'Merci. Je me sens entendu.',
  'Ça me fait du bien.',
  'Reçu. Moins seul.',
  'Merci d’avoir accueilli ça.',
  'Je garde ces mots.',
];

const R_PRESENCE = [
  'Merci.',
  'Reçu.',
  'Ça m’aide.',
  'Présence reçue.',
  'Merci d’être resté.',
];

export const PART8: SupportOpening[] = [
  // ——— 1. ACCUEIL SANS JUGEMENT ———
  {
    id: 'ea1',
    category: 'presence',
    intent: 'offer',
    tone: 'doux',
    text: 'Ce que tu ressens a de la place ici. Pas de jugement de mon côté.',
    responses: R_PRESENCE,
  },
  {
    id: 'ea2',
    category: 'difficile',
    intent: 'offer',
    tone: 'neutre',
    text: 'Tu peux poser ça tel quel. Je n’ai pas à le corriger ni à le minimiser.',
    responses: R_HEARD,
  },

  // ——— 2. REFLET DU RESSENTI (écoute active) ———
  {
    id: 'ea3',
    category: 'anxiete',
    intent: 'offer',
    tone: 'doux',
    text: 'Si je reformule : tu te sens débordé et tu as besoin de calme, pas d’explications. C’est bien ça ?',
    responses: [
      'Oui, c’est ça.',
      'Presque — j’ai surtout besoin de présence.',
      'Merci d’avoir reformulé.',
      'Reçu. Ça aide.',
    ],
  },
  {
    id: 'ea4',
    category: 'fatigue',
    intent: 'offer',
    tone: 'doux',
    text: 'J’entends de la fatigue profonde — le genre où même les petites tâches coûtent cher.',
    responses: R_HEARD,
  },
  {
    id: 'ea5',
    category: 'colere',
    intent: 'offer',
    tone: 'neutre',
    text: 'Il y a de la colère, et derrière peut-être un besoin de respect ou de justice. Je laisse de la place aux deux.',
    responses: R_HEARD,
  },
  {
    id: 'ea6',
    category: 'deuil',
    intent: 'offer',
    tone: 'doux',
    text: 'Je reflète : le manque est encore vif, et tu n’as pas envie qu’on te presse. Je respecte ça.',
    responses: R_HEARD,
  },

  // ——— 3. VALIDATION EXPLICITE ———
  {
    id: 'ea7',
    category: 'difficile',
    intent: 'offer',
    tone: 'doux',
    text: 'Ta réaction a du sens au vu de ce que tu vis. Tu n’es pas “trop sensible”.',
    responses: R_HEARD,
  },
  {
    id: 'ea8',
    category: 'anxiete',
    intent: 'offer',
    tone: 'neutre',
    text: 'Avoir peur quand on ne contrôle pas, c’est une réaction humaine — pas un défaut de caractère.',
    responses: R_HEARD,
  },
  {
    id: 'ea9',
    category: 'presence',
    intent: 'offer',
    tone: 'court',
    text: 'Ça a du sens.',
    responses: R_PRESENCE,
  },
  {
    id: 'ea10',
    category: 'presence',
    intent: 'offer',
    tone: 'court',
    text: 'Je te crois.',
    responses: R_PRESENCE,
  },

  // ——— 4. CNV — OBSERVATION (faits, pas étiquettes) ———
  {
    id: 'cnv1',
    category: 'difficile',
    intent: 'seek',
    tone: 'neutre',
    text: 'Aujourd’hui j’ai enchaîné trois mauvaises nouvelles. Je me sens saturé. J’ai besoin d’un peu de présence, pas de solutions.',
    responses: [
      'Présence, sans solution. Je reste.',
      'Saturé, c’est compréhensible.',
      'Je suis là. Tu n’as pas à gérer ça seul.',
      'Reçu. Pas de conseil de mon côté.',
    ],
  },
  {
    id: 'cnv2',
    category: 'anxiete',
    intent: 'seek',
    tone: 'doux',
    text: 'Depuis ce matin mon estomac est noué et les pensées tournent. J’ai besoin de calme et d’être entendu sans qu’on me dise de relativiser.',
    responses: [
      'Je t’entends. Sans relativiser.',
      'Calme de mon côté. Je reste.',
      'Tes sensations sont reçues.',
      'Pas de “ça va aller” forcé — juste présence.',
    ],
  },
  {
    id: 'cnv3',
    category: 'fatigue',
    intent: 'seek',
    tone: 'neutre',
    text: 'J’ai dormi peu et travaillé toute la journée. Je me sens à bout. J’ai besoin qu’on me dise que ralentir est légitime.',
    responses: [
      'Ralentir est légitime.',
      'À bout, c’est une limite — pas un échec.',
      'Tu as le droit de te poser.',
      'Repose-toi. Je ne juge pas.',
    ],
  },
  {
    id: 'cnv4',
    category: 'colere',
    intent: 'seek',
    tone: 'neutre',
    text: 'On m’a manqué de respect aujourd’hui. Je suis en colère. J’ai besoin d’être cru, pas calmé de force.',
    responses: [
      'Je te crois.',
      'Ta colère a de la place.',
      'Manquer de respect, ça blesse. C’est reçu.',
      'Je ne te dis pas de te calmer.',
    ],
  },
  {
    id: 'cnv5',
    category: 'deuil',
    intent: 'seek',
    tone: 'doux',
    text: 'Ça fait des mois et le chagrin revient par vagues. J’ai besoin de douceur, pas qu’on me parle d’“avancer”.',
    responses: [
      'Les vagues ont le droit d’exister.',
      'Douceur, sans “avancer”.',
      'Je reste avec le chagrin, sans le chasser.',
      'Ton rythme est respecté.',
    ],
  },

  // ——— 5. CNV — CÔTÉ SOUTIEN (offre alignée besoin) ———
  {
    id: 'cnv6',
    category: 'presence',
    intent: 'offer',
    tone: 'doux',
    text: 'Si tu as besoin de présence sans questions : je suis là, en silence utile.',
    responses: R_PRESENCE,
  },
  {
    id: 'cnv7',
    category: 'douceur',
    intent: 'offer',
    tone: 'doux',
    text: 'Si tu as besoin d’entendre que tu n’es pas “trop” : tu n’es pas trop. Ton ressenti est proportionné à ta vie, pas à un standard extérieur.',
    responses: R_HEARD,
  },
  {
    id: 'cnv8',
    category: 'courage',
    intent: 'offer',
    tone: 'neutre',
    text: 'Si tu as besoin de courage sans pression : un seul pas compte. Pas toute la montagne d’un coup.',
    responses: R_PRESENCE,
  },
  {
    id: 'cnv9',
    category: 'espoir',
    intent: 'offer',
    tone: 'doux',
    text: 'Si tu as besoin d’espoir sans mensonge : ce moment est dur, et d’autres moments existent encore. Les deux sont vrais.',
    responses: R_HEARD,
  },

  // ——— 6. MICRO-SCRIPTS “JE / TU” SOIGNÉS ———
  {
    id: 'cnv10',
    category: 'presence',
    intent: 'offer',
    tone: 'neutre',
    text: 'Je ne peux pas tout résoudre. Je peux rester. C’est ce que je choisis de faire maintenant.',
    responses: R_PRESENCE,
  },
  {
    id: 'cnv11',
    category: 'difficile',
    intent: 'offer',
    tone: 'doux',
    text: 'Quand tu dis que c’est trop, je reçois une limite — pas une plainte. Les limites méritent d’être respectées.',
    responses: R_HEARD,
  },
  {
    id: 'cnv12',
    category: 'nuit',
    intent: 'offer',
    tone: 'doux',
    text: 'La nuit, le besoin de sécurité augmente souvent. Une présence discrète peut suffire. J’en propose une.',
    responses: R_PRESENCE,
  },
  {
    id: 'cnv13',
    category: 'matin',
    intent: 'offer',
    tone: 'neutre',
    text: 'Le matin, le besoin d’élan peut manquer. Commencer petit n’est pas échouer — c’est s’adapter.',
    responses: R_PRESENCE,
  },
  {
    id: 'cnv14',
    category: 'motivation',
    intent: 'offer',
    tone: 'doux',
    text: 'Avant un entretien : le besoin d’être respecté compte autant que celui de “réussir”. Tu peux viser les deux sans te trahir.',
    responses: R_PRESENCE,
  },

  // ——— 7. DEMANDES DOUCES (CNV — 4e temps) ———
  {
    id: 'cnv15',
    category: 'presence',
    intent: 'seek',
    tone: 'doux',
    text: 'Est-ce que tu peux juste rester un moment avec moi, sans me poser de questions ?',
    responses: [
      'Oui. Je reste.',
      'Présence sans questions. OK.',
      'Je suis là, en silence.',
      'Reçu. Pas de questions.',
    ],
  },
  {
    id: 'cnv16',
    category: 'douceur',
    intent: 'seek',
    tone: 'doux',
    text: 'Est-ce que tu peux m’envoyer un mot doux, même court ? J’en ai besoin là, maintenant.',
    responses: [
      'Tu comptes. Doucement.',
      'Je suis avec toi.',
      'Tu n’es pas seul.',
      'Douceur envoyée. Sans condition.',
    ],
  },
  {
    id: 'cnv17',
    category: 'courage',
    intent: 'seek',
    tone: 'neutre',
    text: 'Est-ce que tu peux me rappeler que je n’ai pas à tout gérer seul aujourd’hui ?',
    responses: [
      'Tu n’as pas à tout gérer seul.',
      'Une chose à la fois. Je suis là.',
      'Tu peux demander de l’aide.',
      'On porte un peu avec toi.',
    ],
  },
  {
    id: 'cnv18',
    category: 'remerciement',
    intent: 'both',
    tone: 'doux',
    text: 'Merci d’avoir écouté sans me “réparer”. C’est rare et précieux.',
    responses: R_HEARD,
  },
  {
    id: 'cnv19',
    category: 'cloture',
    intent: 'offer',
    tone: 'doux',
    text: 'Si on s’arrête là : ce n’est pas un rejet. C’est parfois le besoin de silence après avoir été entendu.',
    responses: R_PRESENCE,
  },
  {
    id: 'cnv20',
    category: 'reconnexion',
    intent: 'seek',
    tone: 'doux',
    text: 'Je reviens après un moment loin. Mon besoin : reprendre contact sans devoir tout raconter.',
    responses: [
      'Bienvenue. Sans tout raconter.',
      'Reprise simple. OK.',
      'Je suis là.',
      'Pas besoin d’expliquer.',
    ],
  },
];
