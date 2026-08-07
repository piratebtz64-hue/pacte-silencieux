import type { SupportOpening } from './messages-types';

/** Conversations concrètes — réponses cliquables pour enchaîner */
export const PART13: SupportOpening[] = [
  // —— Travail ——
  {
    id: 'tr-1',
    category: 'travail',
    intent: 'seek',
    tone: 'neutre',
    text: 'La journée de travail m’a vidé. J’ai l’impression de ne plus avoir d’espace pour moi.',
    responses: [
      'C’est compréhensible. Tu as le droit de poser le travail ce soir.',
      'Tu n’as pas à être productif jusqu’à minuit. Repose-toi un peu.',
      'Je t’entends. La charge a été trop lourde.',
      'Merci de le dire. On reste un moment sans solution miracle.',
      'Un pas après l’autre. Ce soir, juste survivre à la journée suffit.',
    ],
  },
  {
    id: 'tr-2',
    category: 'travail',
    intent: 'offer',
    tone: 'doux',
    text: 'Si le boulot t’a usé aujourd’hui, tu n’as pas à prouver quoi que ce soit ce soir.',
    responses: [
      'Merci. J’en avais besoin.',
      'Oui… j’essaie de m’arrêter un peu.',
      'C’est dur d’arrêter dans ma tête.',
      'Je reste un moment avec ça.',
    ],
  },
  {
    id: 'tr-3',
    category: 'travail',
    intent: 'seek',
    tone: 'court',
    text: 'Trop de mails. Trop de demandes. La tête tourne.',
    responses: [
      'Ferme l’onglet mental une minute. Respire.',
      'Tu peux tout laisser en attente jusqu’à demain.',
      'Je suis là. Pas de to-do list ici.',
      'OK. On pose ça ensemble.',
    ],
  },
  {
    id: 'tr-4',
    category: 'travail',
    intent: 'both',
    tone: 'neutre',
    text: 'Avant une réunion difficile : tu as le droit d’avoir le trac et d’y aller quand même.',
    responses: [
      'Merci. J’y vais avec ça.',
      'Le trac est encore là, mais moins seul.',
      'Je reviendrai te dire comment ça s’est passé.',
      'Ça m’aide à ne pas tout dramatiser.',
    ],
  },
  {
    id: 'tr-5',
    category: 'travail',
    intent: 'seek',
    tone: 'doux',
    text: 'J’ai peur de décevoir au travail. Ça me pèse même le soir.',
    responses: [
      'Tu n’es pas ta performance. Tu es plus large que ça.',
      'La peur de décevoir est humaine. Elle ne te définit pas.',
      'Ce soir, tu peux juste exister sans “réussir”.',
      'Je reste avec toi dans ce poids, sans le minimiser.',
    ],
  },

  // —— Panique ——
  {
    id: 'pa-1',
    category: 'panique',
    intent: 'seek',
    tone: 'doux',
    text: 'Ça monte trop vite. J’ai du mal à respirer normalement.',
    responses: [
      'Tu es en sécurité ici. Inspire 4 secondes, expire 6.',
      'Pose les pieds au sol. Nomme 3 choses que tu vois.',
      'Je suis là. On ralentit ensemble, sans forcer.',
      'Ce pic va redescendre. Tu n’es pas seul·e dedans.',
      'Pas besoin de parler. Juste rester, respirer.',
    ],
  },
  {
    id: 'pa-2',
    category: 'panique',
    intent: 'offer',
    tone: 'court',
    text: 'Si ça panique : une main sur le ventre, expire plus long que l’inspire.',
    responses: [
      'J’essaie.',
      'Merci. Ça aide un peu.',
      'Encore trop fort, mais je reste.',
      'Je recommence la respiration.',
    ],
  },
  {
    id: 'pa-3',
    category: 'panique',
    intent: 'seek',
    tone: 'neutre',
    text: 'J’ai l’impression que quelque chose de grave va arriver, sans raison claire.',
    responses: [
      'L’alarme du corps peut se tromper. Tu es encore là.',
      'On reste dans le présent : maintenant, tu es en train de lire ça.',
      'Pas de “il faut te calmer”. Juste : je suis avec toi.',
      'Si ça déborde vraiment : 3114. Ici, on tient le lien.',
    ],
  },
  {
    id: 'pa-4',
    category: 'panique',
    intent: 'both',
    tone: 'doux',
    text: 'Après une vague d’angoisse : tu n’as pas “échoué”. Tu as traversé un orage.',
    responses: [
      'Merci de le dire comme ça.',
      'Je suis lessivé·e, mais encore là.',
      'Ça me rassure un peu.',
      'Je vais m’hydrater et me poser.',
    ],
  },

  // —— Famille ——
  {
    id: 'fa-1',
    category: 'famille',
    intent: 'seek',
    tone: 'neutre',
    text: 'C’est compliqué avec un proche. Je ne sais plus quoi dire.',
    responses: [
      'Tu n’as pas à tout résoudre ce soir.',
      'Le silence peut aussi être une pause, pas un échec.',
      'Je t’écoute. Tu peux juste poser le poids ici.',
      'Les liens difficiles fatiguent. C’est légitime.',
    ],
  },
  {
    id: 'fa-2',
    category: 'famille',
    intent: 'offer',
    tone: 'doux',
    text: 'Si la famille tire sur ton énergie, tu as le droit de te protéger un peu.',
    responses: [
      'Oui… j’ai du mal à poser des limites.',
      'Merci. J’en avais besoin d’entendre ça.',
      'Je vais essayer de prendre de la distance douce.',
      'C’est exactement ça le nœud.',
    ],
  },
  {
    id: 'fa-3',
    category: 'famille',
    intent: 'seek',
    tone: 'doux',
    text: 'Je m’inquiète pour quelqu’un que j’aime, et je me sens impuissant·e.',
    responses: [
      'L’impuissance fait mal. Ta présence compte déjà.',
      'Tu ne peux pas tout porter à sa place.',
      'Prendre soin de toi t’aide aussi à tenir pour l’autre.',
      'Je reste avec toi dans cette inquiétude.',
    ],
  },

  // —— Solitude conversationnelle ——
  {
    id: 'so-c1',
    category: 'solitude',
    intent: 'seek',
    tone: 'doux',
    text: 'Ce soir je me sens seul·e, même si j’ai des gens quelque part.',
    responses: [
      'La solitude peut être là même avec un carnet d’adresses.',
      'Je suis un peu avec toi, sans demander de performance.',
      'Tu n’as pas à justifier ce sentiment.',
      'On peut juste rester côte à côte ici.',
      'Merci d’avoir osé l’écrire.',
    ],
  },
  {
    id: 'so-c2',
    category: 'solitude',
    intent: 'offer',
    tone: 'court',
    text: 'Si tu te sens seul·e : je ne remplis pas le vide, je le partage un instant.',
    responses: [
      'Ça suffit déjà.',
      'Merci.',
      'Je reste un moment.',
      'J’avais besoin de ça, simplement.',
    ],
  },

  // —— Présence en dialogue ——
  {
    id: 'pr-c1',
    category: 'presence',
    intent: 'offer',
    tone: 'doux',
    text: 'Je ne cherche pas à te “réparer”. Je reste juste un peu de ton côté.',
    responses: [
      'C’est exactement ce qu’il me faut.',
      'Merci de ne pas forcer les solutions.',
      'Je me sens moins seul·e.',
      'Je reviens te dire un signe plus tard.',
    ],
  },
  {
    id: 'pr-c2',
    category: 'presence',
    intent: 'seek',
    tone: 'neutre',
    text: 'J’ai besoin de savoir qu’il y a quelqu’un, même sans grande conversation.',
    responses: [
      'Je suis là. Tu peux le relire autant que tu veux.',
      'Présence confirmée. Sans pression de répondre.',
      'On tient ce fil ensemble.',
      'Reçu. Je reste disponible dans ce pacte.',
    ],
  },
  {
    id: 'pr-c3',
    category: 'presence',
    intent: 'both',
    tone: 'court',
    text: 'Check-in discret : tu es encore là ? Moi oui.',
    responses: [
      'Oui, toujours.',
      'Oui. Merci d’avoir demandé.',
      'Un peu fragile, mais là.',
      'Présent·e. On continue.',
    ],
  },

  // —— Difficile en chaîne ——
  {
    id: 'di-c1',
    category: 'difficile',
    intent: 'seek',
    tone: 'neutre',
    text: 'Aujourd’hui tout a été un cran trop dur. Je n’ai plus beaucoup d’énergie.',
    responses: [
      'Tu as tenu jusqu’ici. C’est déjà énorme.',
      'Pose ce que tu peux. Le reste peut attendre.',
      'Je ne minimise pas. C’était vraiment lourd.',
      'On abaisse la barre ensemble pour ce soir.',
      'Un verre d’eau, un lit, et ce message. Rien de plus exigé.',
    ],
  },
  {
    id: 'di-c2',
    category: 'difficile',
    intent: 'offer',
    tone: 'doux',
    text: 'Si la journée a été trop dure : tu n’as pas à la raconter en détail pour être légitime.',
    responses: [
      'Merci. Je n’avais pas les mots.',
      'Oui. Juste le poids, sans histoire.',
      'Ça me soulage d’entendre ça.',
      'Je reste avec le poids, sans le dérouler.',
    ],
  },

  // —— Courage dialogue ——
  {
    id: 'co-c1',
    category: 'courage',
    intent: 'offer',
    tone: 'energique',
    text: 'Tu n’as pas besoin d’être héroïque. Juste de faire le prochain tout petit pas.',
    responses: [
      'OK. Le tout petit pas, j’y vais.',
      'Merci. J’avais besoin de baisser la barre.',
      'Je reviens te dire quand c’est fait.',
      'Ça m’aide à ne pas viser trop grand.',
    ],
  },
  {
    id: 'co-c2',
    category: 'courage',
    intent: 'seek',
    tone: 'neutre',
    text: 'J’ai peur d’y aller, et en même temps je sais que je dois y aller.',
    responses: [
      'La peur et le mouvement peuvent cohabiter.',
      'Tu peux avoir peur et avancer quand même.',
      'Je tiens avec toi jusqu’au seuil.',
      'Après, tu pourras te reposer. D’abord le pas.',
    ],
  },

  // —— Anxiété dialogue ——
  {
    id: 'an-c1',
    category: 'anxiete',
    intent: 'seek',
    tone: 'doux',
    text: 'Mon cerveau rejoue les scénarios catastrophes en boucle.',
    responses: [
      'On peut coller une étiquette : “scénario, pas fait”.',
      'Reviens au corps : pieds, respiration, maintenant.',
      'Tu n’as pas à gagner contre l’anxiété ce soir.',
      'Je suis le filet, pas le juge.',
    ],
  },
  {
    id: 'an-c2',
    category: 'anxiete',
    intent: 'offer',
    tone: 'neutre',
    text: 'Si l’anxiété parle fort : ce n’est pas toute la vérité sur ta vie.',
    responses: [
      'J’essaie d’y croire.',
      'Merci. Elle parlait trop fort.',
      'Je vais faire une pause écran.',
      'Ça calme un cran.',
    ],
  },

  // —— Remerciement en dialogue ——
  {
    id: 're-c1',
    category: 'remerciement',
    intent: 'both',
    tone: 'doux',
    text: 'Merci d’avoir été là. Même court, ça a compté.',
    responses: [
      'Merci à toi aussi d’avoir tendu la main.',
      'Ça m’a fait du bien d’être utile un instant.',
      'On a tenu ce bout de chemin ensemble.',
      'Prends soin de toi. Moi aussi.',
    ],
  },
  {
    id: 're-c2',
    category: 'remerciement',
    intent: 'offer',
    tone: 'court',
    text: 'Merci. Ta présence discrète m’a aidé·e plus que tu ne crois.',
    responses: [
      'Je suis touché·e.',
      'Ça me va droit au cœur.',
      'On continue encore un peu si tu veux.',
      'Merci de me le dire.',
    ],
  },

  // —— Clôture / prolongation soft ——
  {
    id: 'cl-c1',
    category: 'cloture',
    intent: 'both',
    tone: 'doux',
    text: 'Le temps du pacte touche à sa fin. Si tu veux, on pourra prolonger — sinon, merci pour le chemin.',
    responses: [
      'Je voudrais bien prolonger.',
      'Merci. Je pense que c’est le bon moment de clôturer.',
      'J’hésite encore, mais merci pour tout.',
      'On se dit au revoir en douceur.',
    ],
  },
  {
    id: 'cl-c2',
    category: 'cloture',
    intent: 'both',
    tone: 'neutre',
    text: 'Fin de cycle : ce n’est pas un échec. C’est un temps qui s’est refermé proprement.',
    responses: [
      'Oui. Proprement.',
      'Merci pour cette manière de le dire.',
      'Je repars un peu moins seul·e qu’à l’arrivée.',
      'Bonne route de ton côté.',
    ],
  },

  // —— Motivation concrète ——
  {
    id: 'mo-c1',
    category: 'motivation',
    intent: 'offer',
    tone: 'energique',
    text: 'Tu as un entretien / un rendez-vous important ? Vas-y avec ce que tu es. Ça suffit.',
    responses: [
      'J’y vais. Merci.',
      'Le trac est là, mais je bouge.',
      'Je te dirai comment ça s’est passé.',
      'Ça me donne un peu de souffle.',
    ],
  },
  {
    id: 'mo-c2',
    category: 'motivation',
    intent: 'seek',
    tone: 'neutre',
    text: 'J’ai un truc important devant moi et j’ai peur de tout foirer.',
    responses: [
      'La peur ne veut pas dire que tu vas échouer.',
      'Prépare le minimum vital, puis lâche le reste.',
      'Je suis dans ton coin, sans jugement sur le résultat.',
      'Un pas. Puis le suivant.',
    ],
  },

  // —— Fatigue ——
  {
    id: 'fa-c1',
    category: 'fatigue',
    intent: 'seek',
    tone: 'doux',
    text: 'Je suis vidé·e. Même répondre à un message me demande un effort.',
    responses: [
      'Alors ne réponds que si tu en as envie. Je reste.',
      'Le repos est une réponse valide.',
      'Tu n’as rien à performer ici.',
      'Ferme les yeux un moment. On se retrouve après.',
    ],
  },
  {
    id: 'fa-c2',
    category: 'fatigue',
    intent: 'offer',
    tone: 'court',
    text: 'Si tu es épuisé·e : pause autorisée. Sans culpabilité.',
    responses: [
      'Pause prise.',
      'Merci.',
      'J’en avais besoin.',
      'Je reviens plus tard.',
    ],
  },

  // —— Transition ——
  {
    id: 'te-c1',
    category: 'transition',
    intent: 'seek',
    tone: 'neutre',
    text: 'Tout change en même temps. J’ai le vertige.',
    responses: [
      'Les changements empilés donnent le vertige. C’est normal.',
      'Tu n’as pas à tout stabiliser ce soir.',
      'On ancre une chose simple : tu es encore là.',
      'Je tiens la rambarde avec toi un instant.',
    ],
  },
  {
    id: 'te-c2',
    category: 'transition',
    intent: 'offer',
    tone: 'doux',
    text: 'En période de changement, avancer tout doucement compte déjà.',
    responses: [
      'OK. Tout doucement alors.',
      'Merci de ralentir la pression.',
      'Je prends ça pour aujourd’hui.',
      'Ça m’aide.',
    ],
  },

  // —— Fierté ——
  {
    id: 'fi-c1',
    category: 'fierte',
    intent: 'seek',
    tone: 'energique',
    text: 'J’ai réussi un petit truc aujourd’hui. Ça paraît rien, mais pour moi c’est grand.',
    responses: [
      'Ce n’est pas rien. Bravo.',
      'Je suis content·e pour toi.',
      'Garde cette preuve : tu avances.',
      'Merci de l’avoir partagé.',
    ],
  },
  {
    id: 'fi-c2',
    category: 'fierte',
    intent: 'offer',
    tone: 'neutre',
    text: 'Si tu as tenu aujourd’hui malgré tout : c’est une victoire discrète. Elle compte.',
    responses: [
      'Merci. J’avais oublié de me le dire.',
      'Oui… j’ai tenu.',
      'Ça me fait du bien de l’entendre.',
      'Je la note, cette victoire.',
    ],
  },
];
