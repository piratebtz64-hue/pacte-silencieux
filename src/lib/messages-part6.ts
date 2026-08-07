import type { SupportOpening, MessageCategory, MessageTone } from './messages-types';

const R = ['Merci.', 'Reçu.', 'Ça m’aide.', 'Je garde ça.', 'Merci d’être là.'];
const R_SEEK = [
  'Je suis là.',
  'Tu n’es pas seul.',
  'Reçu. Je reste.',
  'Doucement. Je suis avec toi.',
  'Merci de l’avoir dit.',
];

function mk(
  id: string,
  category: MessageCategory,
  tone: MessageTone,
  text: string,
  intent: 'offer' | 'seek' | 'both' = 'both',
  responses: string[] = R
): SupportOpening {
  return { id, category, tone, text, intent, responses };
}

/** Remplit chaque catégorie avec plusieurs tons pour éviter les filtres vides */
export const PART6: SupportOpening[] = [
  // ——— ANXIÉTÉ (tous tons) ———
  mk('a-d1', 'anxiete', 'doux', 'Si le cœur bat trop vite, tu peux juste poser une main sur toi. Je reste un peu ici.', 'seek', R_SEEK),
  mk('a-d2', 'anxiete', 'doux', 'L’angoisse peut passer par vagues. Tu n’as pas à la combattre seule.', 'seek', R_SEEK),
  mk('a-d3', 'anxiete', 'doux', 'Respire doucement. Rien d’urgent à résoudre dans la minute.', 'seek', R_SEEK),
  mk('a-d4', 'anxiete', 'doux', 'C’est ok si tout semble trop. On ralentit ensemble un instant.', 'seek', R_SEEK),
  mk('a-d5', 'anxiete', 'doux', 'Tu n’as pas à calmer tout de suite. Juste tenir ce moment-ci.', 'seek', R_SEEK),
  mk('a-n1', 'anxiete', 'neutre', 'L’anxiété est là. Tu peux la nommer sans te juger.', 'seek', R_SEEK),
  mk('a-n2', 'anxiete', 'neutre', 'Une chose à la fois. Le reste peut attendre.', 'seek', R_SEEK),
  mk('a-n3', 'anxiete', 'neutre', 'Ce n’est pas une faiblesse d’avoir peur. C’est humain.', 'seek', R_SEEK),
  mk('a-e1', 'anxiete', 'energique', 'Ancrage : pieds au sol, souffle, ici. Tu reviens.', 'seek', R_SEEK),
  mk('a-e2', 'anxiete', 'energique', 'Tu as déjà traversé des vagues. Celle-ci aussi passera.', 'seek', R_SEEK),
  mk('a-c1', 'anxiete', 'court', 'Ça tourne trop vite.', 'seek', R_SEEK),
  mk('a-c2', 'anxiete', 'court', 'J’ai besoin de calme.', 'seek', R_SEEK),
  mk('a-c3', 'anxiete', 'court', 'Anxiété présente.', 'seek', R_SEEK),
  mk('a-o1', 'anxiete', 'doux', 'Si l’angoisse monte, je suis un point fixe discret de ton côté.', 'offer'),
  mk('a-o2', 'anxiete', 'neutre', 'Pas besoin d’expliquer. Je reste disponible sans pression.', 'offer'),

  // ——— COLÈRE ———
  mk('co-d1', 'colere', 'doux', 'La colère a le droit d’exister. Tu n’as pas à la justifier ici.', 'seek', R_SEEK),
  mk('co-d2', 'colere', 'doux', 'Si c’est injuste, tu peux le poser sans te censurer.', 'seek', R_SEEK),
  mk('co-n1', 'colere', 'neutre', 'Colère présente. C’est une info, pas un échec.', 'seek', R_SEEK),
  mk('co-n2', 'colere', 'neutre', 'Tu as le droit d’être en colère et de rester digne.', 'seek', R_SEEK),
  mk('co-e1', 'colere', 'energique', 'Cette énergie peut se transformer. Pour l’instant, elle est entendue.', 'seek', R_SEEK),
  mk('co-c1', 'colere', 'court', 'Je suis en colère.', 'seek', R_SEEK),
  mk('co-c2', 'colere', 'court', 'C’est injuste.', 'seek', R_SEEK),
  mk('co-o1', 'colere', 'doux', 'Je reçois ta colère sans te juger.', 'offer'),

  // ——— DEUIL ———
  mk('de-d1', 'deuil', 'doux', 'Le manque peut être immense. Tu n’as pas à le minimiser.', 'seek', R_SEEK),
  mk('de-d2', 'deuil', 'doux', 'Pleurer ou se taire : les deux sont permis ici.', 'seek', R_SEEK),
  mk('de-d3', 'deuil', 'doux', 'La personne absente compte encore. Ton chagrin aussi.', 'seek', R_SEEK),
  mk('de-n1', 'deuil', 'neutre', 'Le deuil n’a pas d’horaire. Tu prends le temps qu’il faut.', 'seek', R_SEEK),
  mk('de-c1', 'deuil', 'court', 'Ça manque.', 'seek', R_SEEK),
  mk('de-c2', 'deuil', 'court', 'Jour de deuil.', 'seek', R_SEEK),
  mk('de-o1', 'deuil', 'doux', 'Je tiens un silence respectueux avec toi.', 'offer'),

  // ——— NUIT ———
  mk('nu-d1', 'nuit', 'doux', 'La nuit allonge les pensées. Tu n’es pas obligé de les suivre toutes.', 'seek', R_SEEK),
  mk('nu-d2', 'nuit', 'doux', 'Si tu ne dors pas, je veille un peu avec toi, sans parler fort.', 'seek', R_SEEK),
  mk('nu-n1', 'nuit', 'neutre', 'Insomnie ou solitude nocturne : c’est réel, pas “rien”.', 'seek', R_SEEK),
  mk('nu-e1', 'nuit', 'energique', 'Même à 3 h, tu peux revenir à une respiration. Je suis là.', 'seek', R_SEEK),
  mk('nu-c1', 'nuit', 'court', 'Nuit difficile.', 'seek', R_SEEK),
  mk('nu-c2', 'nuit', 'court', 'Je n’arrive pas à dormir.', 'seek', R_SEEK),
  mk('nu-o1', 'nuit', 'doux', 'Bonne nuit discrète. Présence légère de mon côté.', 'offer'),

  // ——— FATIGUE ———
  mk('fa-d1', 'fatigue', 'doux', 'L’épuisement demande du repos, pas une performance.', 'seek', R_SEEK),
  mk('fa-d2', 'fatigue', 'doux', 'Tu as le droit de tout poser un moment.', 'seek', R_SEEK),
  mk('fa-n1', 'fatigue', 'neutre', 'Fatigue profonde. Ce n’est pas de la paresse.', 'seek', R_SEEK),
  mk('fa-e1', 'fatigue', 'energique', 'Repos. Même un micro-repos compte.', 'seek', R_SEEK),
  mk('fa-c1', 'fatigue', 'court', 'Je suis vidé.', 'seek', R_SEEK),
  mk('fa-c2', 'fatigue', 'court', 'Plus d’énergie.', 'seek', R_SEEK),
  mk('fa-o1', 'fatigue', 'doux', 'Repose-toi autant que tu peux. Je ne demande rien.', 'offer'),

  // ——— JOUR DIFFICILE ———
  mk('di-d1', 'difficile', 'doux', 'Aujourd’hui est lourd. Tu n’as pas à le porter seul.', 'seek', R_SEEK),
  mk('di-d2', 'difficile', 'doux', 'Si tout frotte, on peut juste constater sans solutionner.', 'seek', R_SEEK),
  mk('di-n1', 'difficile', 'neutre', 'Journée rude. C’est noté.', 'seek', R_SEEK),
  mk('di-e1', 'difficile', 'energique', 'Tu tiens encore. Un pas, puis un autre.', 'seek', R_SEEK),
  mk('di-c1', 'difficile', 'court', 'C’est lourd.', 'seek', R_SEEK),
  mk('di-c2', 'difficile', 'court', 'Journée difficile.', 'seek', R_SEEK),
  mk('di-o1', 'difficile', 'doux', 'Je reste disponible pour ce jour difficile.', 'offer'),

  // ——— PRÉSENCE ———
  mk('pr-d1', 'presence', 'doux', 'Je suis là, sans rien exiger.', 'offer'),
  mk('pr-d2', 'presence', 'doux', 'Présence simple. Tu peux juste la recevoir.', 'offer'),
  mk('pr-n1', 'presence', 'neutre', 'Quelqu’un est de ton côté pour un moment.', 'offer'),
  mk('pr-e1', 'presence', 'energique', 'Tu n’es pas seul dans ce passage.', 'offer'),
  mk('pr-c1', 'presence', 'court', 'Je suis là.', 'offer'),
  mk('pr-c2', 'presence', 'court', 'Je reste.', 'offer'),
  mk('pr-s1', 'presence', 'doux', 'J’aurais besoin de sentir une présence discrète.', 'seek', R_SEEK),

  // ——— COURAGE ———
  mk('cu-d1', 'courage', 'doux', 'Le courage peut être tout petit. Ça compte quand même.', 'offer'),
  mk('cu-n1', 'courage', 'neutre', 'Tu as déjà tenu jusqu’ici. Ce n’est pas rien.', 'offer'),
  mk('cu-e1', 'courage', 'energique', 'Continue. Même imparfaitement.', 'offer'),
  mk('cu-e2', 'courage', 'energique', 'Force tranquille. Tu peux y aller.', 'offer'),
  mk('cu-c1', 'courage', 'court', 'Tu tiens.', 'offer'),
  mk('cu-c2', 'courage', 'court', 'Un pas de plus.', 'offer'),
  mk('cu-s1', 'courage', 'neutre', 'J’ai besoin d’un peu de courage de l’extérieur.', 'seek', R_SEEK),

  // ——— DOUCEUR ———
  mk('do-d1', 'douceur', 'doux', 'Un peu de douceur, sans condition.', 'offer'),
  mk('do-d2', 'douceur', 'doux', 'Tu mérites de la tendresse, même les jours sans éclat.', 'offer'),
  mk('do-n1', 'douceur', 'neutre', 'Douceur simple, envoyée sans attendre de réponse.', 'offer'),
  mk('do-c1', 'douceur', 'court', 'Doucement.', 'offer'),
  mk('do-c2', 'douceur', 'court', 'Tout doux.', 'offer'),
  mk('do-s1', 'douceur', 'doux', 'J’aurais besoin d’un mot doux.', 'seek', R_SEEK),

  // ——— ESPOIR ———
  mk('es-d1', 'espoir', 'doux', 'Ça peut s’alléger, même si ce n’est pas aujourd’hui.', 'offer'),
  mk('es-n1', 'espoir', 'neutre', 'Rien n’est figé pour toujours.', 'offer'),
  mk('es-e1', 'espoir', 'energique', 'Il y a encore de la place pour un demain différent.', 'offer'),
  mk('es-c1', 'espoir', 'court', 'Ça peut aller mieux.', 'offer'),
  mk('es-s1', 'espoir', 'doux', 'J’ai du mal à y croire aujourd’hui.', 'seek', R_SEEK),

  // ——— GRATITUDE ———
  mk('gr-d1', 'gratitude', 'doux', 'Merci d’exister de l’autre côté de cet écran.', 'offer'),
  mk('gr-n1', 'gratitude', 'neutre', 'Je suis reconnaissant pour cette présence.', 'offer'),
  mk('gr-c1', 'gratitude', 'court', 'Merci.', 'offer'),
  mk('gr-s1', 'gratitude', 'doux', 'Je voulais juste dire merci.', 'both'),

  // ——— MATIN ———
  mk('ma-d1', 'matin', 'doux', 'Bonjour discret. La journée peut commencer sans précipitation.', 'offer'),
  mk('ma-n1', 'matin', 'neutre', 'Nouveau jour. Un pas après l’autre.', 'offer'),
  mk('ma-e1', 'matin', 'energique', 'On démarre. Tu peux y aller.', 'offer'),
  mk('ma-c1', 'matin', 'court', 'Bonjour.', 'offer'),
  mk('ma-s1', 'matin', 'doux', 'Matin difficile à démarrer.', 'seek', R_SEEK),

  // ——— RECONNEXION ———
  mk('re-d1', 'reconnexion', 'doux', 'Revenir ici est déjà un geste. Bienvenue.', 'both'),
  mk('re-n1', 'reconnexion', 'neutre', 'Tu peux reprendre sans te justifier.', 'both'),
  mk('re-c1', 'reconnexion', 'court', 'Je reviens.', 'both'),
  mk('re-s1', 'reconnexion', 'doux', 'J’étais parti. J’ai besoin de reprendre contact doucement.', 'seek', R_SEEK),

  // ——— CLÔTURE ———
  mk('cl-d1', 'cloture', 'doux', 'On peut fermer ce chapitre avec calme.', 'offer'),
  mk('cl-n1', 'cloture', 'neutre', 'Fin de pacte possible, sans dramatiser.', 'offer'),
  mk('cl-c1', 'cloture', 'court', 'À bientôt, peut-être.', 'offer'),
  mk('cl-s1', 'cloture', 'neutre', 'Je sens que c’est le moment de conclure.', 'seek', R_SEEK),

  // ——— REMERCIEMENT ———
  mk('rm-d1', 'remerciement', 'doux', 'Merci d’avoir tenu avec moi.', 'both'),
  mk('rm-d2', 'remerciement', 'doux', 'Ta présence a compté. Vraiment.', 'both'),
  mk('rm-n1', 'remerciement', 'neutre', 'Merci pour ce temps partagé.', 'both'),
  mk('rm-c1', 'remerciement', 'court', 'Merci pour tout.', 'both'),
  mk('rm-e1', 'remerciement', 'energique', 'Merci. Ça m’a aidé à tenir.', 'both'),

  // ——— MOTIVATION (tons manquants) ———
  mk('mo-d1', 'motivation', 'doux', 'Pour ton rendez-vous : tu peux y aller en douceur, sans te forcer à briller.', 'offer'),
  mk('mo-n1', 'motivation', 'neutre', 'Entretien ou démarche : une chose à la fois suffit.', 'offer'),
  mk('mo-c1', 'motivation', 'court', 'Vas-y.', 'offer'),
  mk('mo-c2', 'motivation', 'court', 'Tu peux.', 'offer'),
  mk('mo-s1', 'motivation', 'doux', 'J’ai le trac avant un rendez-vous. Un mot doux m’aiderait.', 'seek', R_SEEK),
];
