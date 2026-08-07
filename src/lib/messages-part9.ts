import type { SupportOpening } from './messages-types';

/**
 * Scripts concrets :
 * - crise d’angoisse / panique (ancrage + respiration simple)
 * - conflit (désescalade, besoins)
 * - colère très forte (accueil + limites + orientation aide pro si besoin)
 *
 * Cadre : présence entre pairs, pas un traitement médical.
 */

const R_PANIC = [
  'Je le fais avec toi.',
  'Merci. Je respire.',
  'Je suis encore là.',
  'Ça redescend un peu.',
  'Merci de guider sans juger.',
];

const R_ANGER = [
  'Je t’entends.',
  'Ta colère a de la place — pas la violence.',
  'Je reste, sans te juger.',
  'Reçu. On ralentit.',
  'Merci de l’avoir dit avec des mots.',
];

const R_CONFLICT = [
  'Je comprends le besoin.',
  'On peut ralentir.',
  'Pas d’ennemi ici.',
  'Reçu. Présence calme.',
  'Merci d’avoir clarifié.',
];

export const PART9: SupportOpening[] = [
  // ——— CRISE DE PANIQUE / ANGOISSE AIGUË ———
  {
    id: 'pan1',
    category: 'anxiete',
    intent: 'offer',
    tone: 'doux',
    text: 'Si ça monte trop fort : pose les pieds au sol. Inspire par le nez en comptant jusqu’à 4. Expire par la bouche en comptant jusqu’à 6. Je compte avec toi si tu veux.',
    responses: R_PANIC,
  },
  {
    id: 'pan2',
    category: 'anxiete',
    intent: 'offer',
    tone: 'neutre',
    text: 'Crise ou vague d’angoisse : tu n’es pas en danger parce que tu as peur. Nomme 5 choses que tu vois, 4 que tu touches, 3 que tu entends. Je reste pendant ce temps.',
    responses: R_PANIC,
  },
  {
    id: 'pan3',
    category: 'anxiete',
    intent: 'offer',
    tone: 'doux',
    text: 'Respiration carrée, tout doux : inspire 4 — retiens 4 — expire 4 — pause 4. Une seule fois suffit pour recommencer. Je ne te quitte pas.',
    responses: R_PANIC,
  },
  {
    id: 'pan4',
    category: 'anxiete',
    intent: 'offer',
    tone: 'court',
    text: 'Pieds au sol. Souffle long. Je suis là.',
    responses: R_PANIC,
  },
  {
    id: 'pan5',
    category: 'anxiete',
    intent: 'offer',
    tone: 'doux',
    text: 'Si le cœur s’emballe : ce n’est pas “pour rien”, et ça peut redescendre. Expire plus long que l’inspire. Je reste en silence utile.',
    responses: R_PANIC,
  },
  {
    id: 'pan6',
    category: 'anxiete',
    intent: 'seek',
    tone: 'doux',
    text: 'Je crois que je fais une crise d’angoisse. J’ai besoin qu’on me guide pour respirer, sans me dire que ce n’est rien.',
    responses: [
      'Ce n’est pas rien. Inspire 4, expire 6. Je suis avec toi.',
      'Pieds au sol. Souffle long. Je reste.',
      'Tu n’es pas seul. Une respiration après l’autre.',
      'Je guide : nez 4, bouche 6. On recommence.',
    ],
  },
  {
    id: 'pan7',
    category: 'anxiete',
    intent: 'seek',
    tone: 'court',
    text: 'Panique. Aide-moi à souffler.',
    responses: [
      'Expire long. Je suis là.',
      '4 inspire, 6 expire. Ensemble.',
      'Pieds au sol. Je reste.',
      'Ça peut redescendre. Présence ici.',
    ],
  },
  {
    id: 'pan8',
    category: 'nuit',
    intent: 'offer',
    tone: 'doux',
    text: 'Angoisse de nuit : allume une faible lumière si tu peux, pieds au sol, expire long. Tu n’as pas à “réussir” à dormir tout de suite. Je veille un peu.',
    responses: R_PANIC,
  },

  // ——— CONFLIT (désescalade) ———
  {
    id: 'cf1',
    category: 'colere',
    intent: 'offer',
    tone: 'neutre',
    text: 'En conflit, le besoin d’être respecté est souvent au centre. On peut ralentir sans abandonner ce besoin.',
    responses: R_CONFLICT,
  },
  {
    id: 'cf2',
    category: 'colere',
    intent: 'offer',
    tone: 'doux',
    text: 'Script possible : « Là, je suis trop monté pour parler juste. J’ai besoin d’une pause, puis on reprend. » Ce n’est pas fuir — c’est protéger le lien.',
    responses: R_CONFLICT,
  },
  {
    id: 'cf3',
    category: 'colere',
    intent: 'offer',
    tone: 'neutre',
    text: 'Désescalade : une phrase à la fois, pas de “toujours” / “jamais”, coller aux faits. « Quand X s’est passé, je me suis senti Y, j’avais besoin de Z. »',
    responses: R_CONFLICT,
  },
  {
    id: 'cf4',
    category: 'difficile',
    intent: 'seek',
    tone: 'neutre',
    text: 'Je suis en conflit avec quelqu’un et je ne veux pas aggraver. J’ai besoin d’un ancrage calme, pas de prendre parti.',
    responses: [
      'Ancrage calme. Je ne prends pas parti.',
      'Ralentis. Une phrase à la fois.',
      'Ton besoin de respect compte. Pause possible.',
      'Je reste neutre et présent.',
    ],
  },
  {
    id: 'cf5',
    category: 'colere',
    intent: 'seek',
    tone: 'doux',
    text: 'Je viens d’une dispute. Je suis encore chaud. J’ai besoin qu’on m’aide à ne pas tout casser avec des mots.',
    responses: [
      'On ralentit ensemble.',
      'Tu peux être en colère sans tout détruire.',
      'Pause. Souffle. Puis les mots justes.',
      'Je suis là pour calmer le cadre, pas pour juger.',
    ],
  },

  // ——— COLÈRE TRÈS FORTE / “VIOLENTE” (émotion, pas acte) ———
  {
    id: 'cv1',
    category: 'colere',
    intent: 'offer',
    tone: 'neutre',
    text: 'La colère peut être explosive à l’intérieur. L’émotion est légitime. Casser, menacer ou blesser ne l’est pas. Ici, on accueille la colère avec des mots.',
    responses: R_ANGER,
  },
  {
    id: 'cv2',
    category: 'colere',
    intent: 'offer',
    tone: 'doux',
    text: 'Si la colère est énorme : sors du lieu du conflit si tu peux, serre un objet froid, expire fort plusieurs fois. Puis un seul mot : « Pause. »',
    responses: R_ANGER,
  },
  {
    id: 'cv3',
    category: 'colere',
    intent: 'offer',
    tone: 'neutre',
    text: 'Script : « Je suis trop en colère pour parler sans blesser. Je reviens quand je serai redescendu. » C’est de la responsabilité, pas de la faiblesse.',
    responses: R_ANGER,
  },
  {
    id: 'cv4',
    category: 'colere',
    intent: 'offer',
    tone: 'energique',
    text: 'La rage veut parfois détruire. Canalise : marche rapide, crier dans un coussin, écrire tout noir sur une page — pas sur une personne.',
    responses: R_ANGER,
  },
  {
    id: 'cv5',
    category: 'colere',
    intent: 'seek',
    tone: 'neutre',
    text: 'Ma colère est violente dans ma tête. J’ai peur de mal parler ou de mal faire. J’ai besoin d’aide pour redescendre sans être jugé.',
    responses: [
      'Tu n’es pas jugé. Redescend avec moi : expire long.',
      'La peur de blesser montre déjà un frein. Pause.',
      'Mots seulement ici. Je reste.',
      'Tu peux être en rage et choisir de ne pas agir.',
    ],
  },
  {
    id: 'cv6',
    category: 'colere',
    intent: 'seek',
    tone: 'doux',
    text: 'Je bouille. Si je parle maintenant, ça va sortir trop fort. J’ai besoin qu’on me dise que je peux attendre.',
    responses: [
      'Tu peux attendre. C’est sage.',
      'Attendre n’efface pas ta colère — ça la protège de faire du dégât.',
      'Je suis là pendant la pause.',
      'Reviens quand le souffle est plus long.',
    ],
  },
  {
    id: 'cv7',
    category: 'colere',
    intent: 'offer',
    tone: 'court',
    text: 'Colère OK. Violence non. Pause.',
    responses: R_ANGER,
  },
  {
    id: 'cv8',
    category: 'colere',
    intent: 'offer',
    tone: 'doux',
    text: 'Si tu crains de perdre le contrôle : contacte quelqu’un de confiance, ou les secours si tu te sens en danger (15 / 112). Ici, on tient les mots, pas les actes.',
    responses: [
      'Merci pour le rappel.',
      'Je vais freiner.',
      'Reçu. Présence d’abord.',
      'Je sais où appeler si besoin.',
    ],
  },

  // ——— APRÈS LA VAGUE ———
  {
    id: 'pan9',
    category: 'anxiete',
    intent: 'offer',
    tone: 'doux',
    text: 'Après une crise, la fatigue est normale. Bois un peu d’eau si tu peux, reste au chaud. Tu n’as pas à “être productif” juste après.',
    responses: R_PANIC,
  },
  {
    id: 'cv9',
    category: 'colere',
    intent: 'offer',
    tone: 'doux',
    text: 'Après la colère : honte ou vide possibles. Tu n’es pas “mauvais” pour avoir ressenti fort. Tu es responsable de ce que tu fais ensuite.',
    responses: R_ANGER,
  },
  {
    id: 'cf6',
    category: 'remerciement',
    intent: 'both',
    tone: 'doux',
    text: 'Merci d’avoir choisi les mots plutôt que d’exploser. Ça compte énormément.',
    responses: R_CONFLICT,
  },
];
