export type MessageCategory =
  | 'presence'
  | 'difficile'
  | 'fatigue'
  | 'courage'
  | 'gratitude'
  | 'nuit'
  | 'espoir'
  | 'cloture';

export interface SupportOpening {
  id: string;
  category: MessageCategory;
  text: string;
  responses: string[];
}

export const CATEGORY_LABELS: Record<MessageCategory, string> = {
  presence: 'Présence',
  difficile: 'Jour difficile',
  fatigue: 'Fatigue',
  courage: 'Courage',
  gratitude: 'Gratitude',
  nuit: 'Nuit / solitude',
  espoir: 'Espoir léger',
  cloture: 'Clôture',
};

export const SUPPORT_MESSAGES: SupportOpening[] = [
  // PRÉSENCE
  {
    id: 'p1',
    category: 'presence',
    text: 'Je ne connais pas ta journée, mais je reste un peu avec toi.',
    responses: [
      'Merci. Ça m’aide un peu.',
      'Je reçois. Silence aussi.',
      'Ta présence compte.',
      'Je tiens grâce à ça.',
    ],
  },
  {
    id: 'p2',
    category: 'presence',
    text: 'Tu n’as rien à expliquer. Je suis là quand même.',
    responses: [
      'Merci de ne rien demander.',
      'C’est rare et précieux.',
      'Je respire un peu mieux.',
      'Je reçois sans répondre plus.',
    ],
  },
  {
    id: 'p3',
    category: 'presence',
    text: 'Même sans mots, quelqu’un pense à toi en ce moment.',
    responses: [
      'Ça me touche.',
      'Merci d’exister quelque part.',
      'Je me sens moins seul.',
      'Je reçois.',
    ],
  },
  {
    id: 'p4',
    category: 'presence',
    text: 'Je tiens un peu de place pour toi, sans attendre de réponse.',
    responses: [
      'Merci pour cette place.',
      'Je m’y pose un instant.',
      'C’est doux.',
      'Silence reçu.',
    ],
  },
  {
    id: 'p5',
    category: 'presence',
    text: 'Tu n’as pas à être fort ici. Juste présent, si tu peux.',
    responses: [
      'Je suis là, fatigué.',
      'Merci de le dire.',
      'Je reste un peu.',
      'Présent, sans force.',
    ],
  },
  {
    id: 'p6',
    category: 'presence',
    text: 'Je veille un moment avec toi. Rien d’autre.',
    responses: [
      'Merci de veiller.',
      'Ça me rassure.',
      'Je m’endors un peu moins seul.',
      'Reçu.',
    ],
  },

  // JOUR DIFFICILE
  {
    id: 'd1',
    category: 'difficile',
    text: 'Si c’est lourd aujourd’hui, tu n’as pas à le porter seul.',
    responses: [
      'C’est lourd, mais je tiens.',
      'Merci. Ça m’aide un peu.',
      'J’ai besoin de cette présence.',
      'Je reçois. Silence aussi.',
    ],
  },
  {
    id: 'd2',
    category: 'difficile',
    text: 'Les jours difficiles existent. Tu as le droit d’en traverser un.',
    responses: [
      'Oui, c’est un de ces jours.',
      'Merci de le reconnaître.',
      'Je traverse.',
      'Je reçois.',
    ],
  },
  {
    id: 'd3',
    category: 'difficile',
    text: 'Tu n’as pas à faire semblant que tout va bien.',
    responses: [
      'Merci. Je n’y arrive pas aujourd’hui.',
      'C’est vrai, ça soulage.',
      'Je reste honnête ici.',
      'Reçu sans masque.',
    ],
  },
  {
    id: 'd4',
    category: 'difficile',
    text: 'Même si tout semble figé, tu n’es pas abandonné.',
    responses: [
      'Ça fait du bien de l’entendre.',
      'Je m’accroche à ça.',
      'Merci.',
      'Présence reçue.',
    ],
  },
  {
    id: 'd5',
    category: 'difficile',
    text: 'Si la journée t’a pris beaucoup, tu as le droit de te poser.',
    responses: [
      'Je me pose un peu.',
      'Merci pour la permission.',
      'C’était trop, oui.',
      'Je reçois.',
    ],
  },
  {
    id: 'd6',
    category: 'difficile',
    text: 'Tu n’as rien à prouver ce soir.',
    responses: [
      'Merci. Je n’en peux plus de prouver.',
      'Je me repose dans cette phrase.',
      'Silence accepté.',
      'Reçu.',
    ],
  },
  {
    id: 'd7',
    category: 'difficile',
    text: 'Ce n’est pas parce que c’est dur que tu échoues.',
    responses: [
      'J’avais besoin de l’entendre.',
      'Merci.',
      'Je continue quand même.',
      'Reçu avec soulagement.',
    ],
  },

  // FATIGUE
  {
    id: 'f1',
    category: 'fatigue',
    text: 'Tu as le droit d’être fatigué. Vraiment.',
    responses: [
      'Oui, je suis épuisé.',
      'Merci de le dire simplement.',
      'Je m’autorise un peu.',
      'Reçu.',
    ],
  },
  {
    id: 'f2',
    category: 'fatigue',
    text: 'Reposer n’est pas abandonner.',
    responses: [
      'Je me le répète grâce à toi.',
      'Merci.',
      'Je me repose alors.',
      'Silence et repos.',
    ],
  },
  {
    id: 'f3',
    category: 'fatigue',
    text: 'Même les plus solides ont besoin de s’asseoir parfois.',
    responses: [
      'Je m’assieds un moment.',
      'Ça me touche.',
      'Merci.',
      'Reçu.',
    ],
  },
  {
    id: 'f4',
    category: 'fatigue',
    text: 'Si ton corps ou ton cœur demande une pause, écoute-le.',
    responses: [
      'J’essaie d’écouter.',
      'Merci pour ce rappel.',
      'Pause acceptée.',
      'Je reçois.',
    ],
  },
  {
    id: 'f5',
    category: 'fatigue',
    text: 'Tu n’as pas à tout tenir aujourd’hui.',
    responses: [
      'Je lâche un peu.',
      'Merci.',
      'C’est déjà beaucoup.',
      'Reçu.',
    ],
  },
  {
    id: 'f6',
    category: 'fatigue',
    text: 'La fatigue n’efface pas ta valeur.',
    responses: [
      'J’en avais besoin.',
      'Merci de le rappeler.',
      'Je me le note.',
      'Reçu doucement.',
    ],
  },

  // COURAGE
  {
    id: 'c1',
    category: 'courage',
    text: 'Tu continues. Même petit, c’est déjà du courage.',
    responses: [
      'Merci de le voir ainsi.',
      'Je continue alors.',
      'Ça me donne un peu de force.',
      'Reçu.',
    ],
  },
  {
    id: 'c2',
    category: 'courage',
    text: 'Se lever certains matins est déjà une victoire.',
    responses: [
      'Aujourd’hui c’était le cas.',
      'Merci.',
      'Je me le concède.',
      'Reçu.',
    ],
  },
  {
    id: 'c3',
    category: 'courage',
    text: 'Tu n’as pas besoin d’être héroïque pour être digne.',
    responses: [
      'Ça me soulage.',
      'Merci.',
      'Je reste simple alors.',
      'Reçu.',
    ],
  },
  {
    id: 'c4',
    category: 'courage',
    text: 'Demander de l’aide, même en silence, est une force.',
    responses: [
      'C’est pour ça que je suis ici.',
      'Merci de le dire.',
      'Je m’autorise ça.',
      'Reçu.',
    ],
  },
  {
    id: 'c5',
    category: 'courage',
    text: 'Tu as déjà traversé des choses. Tu traverses encore.',
    responses: [
      'Oui, et j’en suis fatigué.',
      'Merci de le reconnaître.',
      'Je tiens encore.',
      'Reçu.',
    ],
  },
  {
    id: 'c6',
    category: 'courage',
    text: 'Un pas très petit reste un pas.',
    responses: [
      'Je fais ce pas-là.',
      'Merci.',
      'Ça me suffit aujourd’hui.',
      'Reçu.',
    ],
  },

  // GRATITUDE
  {
    id: 'g1',
    category: 'gratitude',
    text: 'Merci d’être là, même sans que je te connaisse.',
    responses: [
      'Merci à toi aussi.',
      'Ça me touche.',
      'Présence partagée.',
      'Reçu avec gratitude.',
    ],
  },
  {
    id: 'g2',
    category: 'gratitude',
    text: 'Ta présence, même discrète, a de la valeur.',
    responses: [
      'Merci de le dire.',
      'Je me le rappelle.',
      'Ça compte pour moi aussi.',
      'Reçu.',
    ],
  },
  {
    id: 'g3',
    category: 'gratitude',
    text: 'Je suis reconnaissant qu’on puisse se tenir ainsi.',
    responses: [
      'Moi aussi.',
      'C’est rare et beau.',
      'Merci.',
      'Reçu.',
    ],
  },
  {
    id: 'g4',
    category: 'gratitude',
    text: 'Merci pour ce silence partagé.',
    responses: [
      'Merci aussi.',
      'Ce silence me fait du bien.',
      'Je le garde précieusement.',
      'Reçu.',
    ],
  },
  {
    id: 'g5',
    category: 'gratitude',
    text: 'Tu n’as rien donné de spectaculaire, et pourtant ça compte.',
    responses: [
      'Merci de le voir.',
      'Ça me rassure.',
      'Je continue modestement.',
      'Reçu.',
    ],
  },

  // NUIT / SOLITUDE
  {
    id: 'n1',
    category: 'nuit',
    text: 'Si la nuit est longue, tu n’es pas le seul à la traverser.',
    responses: [
      'Cette nuit est longue, oui.',
      'Merci d’être là.',
      'Je me sens un peu moins seul.',
      'Reçu.',
    ],
  },
  {
    id: 'n2',
    category: 'nuit',
    text: 'Même à cette heure, quelqu’un peut tenir avec toi.',
    responses: [
      'Merci d’être éveillé avec moi.',
      'Ça change quelque chose.',
      'Je reçois.',
      'Silence nocturne partagé.',
    ],
  },
  {
    id: 'n3',
    category: 'nuit',
    text: 'La solitude pèse parfois plus la nuit. Je le sais.',
    responses: [
      'Oui, ce soir surtout.',
      'Merci de le nommer.',
      'Je tiens.',
      'Reçu.',
    ],
  },
  {
    id: 'n4',
    category: 'nuit',
    text: 'Si tu n’arrives pas à dormir, tu n’as pas à le faire seul.',
    responses: [
      'Je n’y arrive pas.',
      'Merci.',
      'Ta présence aide.',
      'Reçu.',
    ],
  },
  {
    id: 'n5',
    category: 'nuit',
    text: 'Cette heure difficile peut être un peu moins froide à deux.',
    responses: [
      'Elle l’est un peu moins.',
      'Merci.',
      'Je reste un moment.',
      'Reçu.',
    ],
  },
  {
    id: 'n6',
    category: 'nuit',
    text: 'Bonsoir, tout simplement. Sans exigence.',
    responses: [
      'Bonsoir.',
      'Merci pour la simplicité.',
      'Bonne nuit presque.',
      'Reçu.',
    ],
  },

  // ESPOIR LÉGER
  {
    id: 'e1',
    category: 'espoir',
    text: 'Rien n’est réglé, mais demain existe encore.',
    responses: [
      'J’y pense avec toi.',
      'Merci pour cette ouverture.',
      'Je m’y accroche un peu.',
      'Reçu.',
    ],
  },
  {
    id: 'e2',
    category: 'espoir',
    text: 'Un jour plus doux est possible. Pas certain, possible.',
    responses: [
      'Possible, oui.',
      'Merci de ne pas promettre trop.',
      'Je garde ça.',
      'Reçu.',
    ],
  },
  {
    id: 'e3',
    category: 'espoir',
    text: 'Tu n’as pas à y croire fort. Juste un peu suffit parfois.',
    responses: [
      'Un peu, j’y arrive.',
      'Merci.',
      'Je tente.',
      'Reçu.',
    ],
  },
  {
    id: 'e4',
    category: 'espoir',
    text: 'Il reste des instants qui ne font pas mal. On peut s’y tenir.',
    responses: [
      'J’en cherche un.',
      'Merci.',
      'Je m’y tiens.',
      'Reçu.',
    ],
  },
  {
    id: 'e5',
    category: 'espoir',
    text: 'Ce n’est pas fini. Même si c’est flou.',
    responses: [
      'Flou, mais pas fini.',
      'Merci.',
      'Je continue.',
      'Reçu.',
    ],
  },
  {
    id: 'e6',
    category: 'espoir',
    text: 'Une petite lumière quelque part suffit parfois à orienter.',
    responses: [
      'J’en cherche une.',
      'Merci pour l’image.',
      'Je m’oriente un peu.',
      'Reçu.',
    ],
  },

  // CLÔTURE
  {
    id: 'cl1',
    category: 'cloture',
    text: 'Merci d’avoir tenu avec moi ces jours-ci.',
    responses: [
      'Merci à toi aussi.',
      'Ça a compté.',
      'Je n’oublierai pas ce silence.',
      'Reçu avec gratitude.',
    ],
  },
  {
    id: 'cl2',
    category: 'cloture',
    text: 'Ce pacte se termine, mais la présence a existé.',
    responses: [
      'Oui, elle a existé.',
      'Merci.',
      'Je la garde.',
      'Reçu.',
    ],
  },
  {
    id: 'cl3',
    category: 'cloture',
    text: 'Je te souhaite une suite un peu plus douce.',
    responses: [
      'À toi aussi.',
      'Merci pour ce vœu.',
      'J’essaie.',
      'Reçu.',
    ],
  },
  {
    id: 'cl4',
    category: 'cloture',
    text: 'On se quitte sans se connaître, et pourtant quelque chose s’est passé.',
    responses: [
      'Oui, quelque chose.',
      'C’était réel.',
      'Merci.',
      'Reçu.',
    ],
  },
  {
    id: 'cl5',
    category: 'cloture',
    text: 'Prends soin de toi, autant que tu peux.',
    responses: [
      'Toi aussi.',
      'J’essaierai.',
      'Merci.',
      'Reçu.',
    ],
  },
  {
    id: 'cl6',
    category: 'cloture',
    text: 'Dernier signe : je suis content d’avoir tenu avec toi.',
    responses: [
      'Moi aussi.',
      'Merci pour tout.',
      'Beau silence.',
      'Reçu jusqu’au bout.',
    ],
  },
];

export function getMessageById(id: string): SupportOpening | undefined {
  return SUPPORT_MESSAGES.find((m) => m.id === id);
}

export function getMessagesByCategory(category: MessageCategory): SupportOpening[] {
  return SUPPORT_MESSAGES.filter((m) => m.category === category);
}
