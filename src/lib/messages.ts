export type MessageCategory =
  | 'presence'
  | 'difficile'
  | 'fatigue'
  | 'courage'
  | 'gratitude'
  | 'nuit'
  | 'espoir'
  | 'anxiete'
  | 'douceur'
  | 'matin'
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
  anxiete: 'Anxiété',
  douceur: 'Douceur',
  matin: 'Matin',
  cloture: 'Clôture',
};

const R = {
  merci: ['Merci.', 'Merci. Ça m’aide.', 'Je reçois.', 'Reçu.'],
  presence: ['Ta présence compte.', 'Merci d’être là.', 'Je me sens moins seul.', 'Présence reçue.'],
  force: ['Je tiens.', 'Je continue.', 'Ça me donne un peu de force.', 'Je m’accroche.'],
};

export const SUPPORT_MESSAGES: SupportOpening[] = [
  // ——— PRÉSENCE (12) ———
  { id: 'p1', category: 'presence', text: 'Je ne connais pas ta journée, mais je reste un peu avec toi.', responses: ['Merci. Ça m’aide un peu.', 'Je reçois. Silence aussi.', 'Ta présence compte.', 'Je tiens grâce à ça.'] },
  { id: 'p2', category: 'presence', text: 'Tu n’as rien à expliquer. Je suis là quand même.', responses: ['Merci de ne rien demander.', 'C’est rare et précieux.', 'Je respire un peu mieux.', 'Je reçois sans répondre plus.'] },
  { id: 'p3', category: 'presence', text: 'Même sans mots, quelqu’un pense à toi en ce moment.', responses: ['Ça me touche.', 'Merci d’exister quelque part.', 'Je me sens moins seul.', 'Je reçois.'] },
  { id: 'p4', category: 'presence', text: 'Je tiens un peu de place pour toi, sans attendre de réponse.', responses: ['Merci pour cette place.', 'Je m’y pose un instant.', 'C’est doux.', 'Silence reçu.'] },
  { id: 'p5', category: 'presence', text: 'Tu n’as pas à être fort ici. Juste présent, si tu peux.', responses: ['Je suis là, fatigué.', 'Merci de le dire.', 'Je reste un peu.', 'Présent, sans force.'] },
  { id: 'p6', category: 'presence', text: 'Je veille un moment avec toi. Rien d’autre.', responses: ['Merci de veiller.', 'Ça me rassure.', 'Je m’endors un peu moins seul.', 'Reçu.'] },
  { id: 'p7', category: 'presence', text: 'Tu n’es pas invisible. Quelqu’un te fait de la place.', responses: ['Merci de me voir.', 'Ça change quelque chose.', 'Je me pose ici.', 'Reçu.'] },
  { id: 'p8', category: 'presence', text: 'Je ne cherche pas à te comprendre. Juste à rester près.', responses: ['C’est exactement ce qu’il me faut.', 'Merci.', 'Pas besoin de plus.', 'Reçu.'] },
  { id: 'p9', category: 'presence', text: 'Cette présence est simple. Et c’est voulu.', responses: ['La simplicité me fait du bien.', 'Merci.', 'Je reste dans la simplicité.', 'Reçu.'] },
  { id: 'p10', category: 'presence', text: 'Tu peux juste être là. Sans performance.', responses: ['Sans performance, oui.', 'Merci pour cette liberté.', 'Je suis là, simplement.', 'Reçu.'] },
  { id: 'p11', category: 'presence', text: 'Je suis de l’autre côté du silence. Avec toi.', responses: ['Je le sens un peu.', 'Merci.', 'Silence partagé.', 'Reçu.'] },
  { id: 'p12', category: 'presence', text: 'Pas besoin de répondre tout de suite. Je reste.', responses: ['Merci pour le temps.', 'Je reviens plus tard peut-être.', 'Présence notée.', 'Reçu.'] },

  // ——— JOUR DIFFICILE (12) ———
  { id: 'd1', category: 'difficile', text: 'Si c’est lourd aujourd’hui, tu n’as pas à le porter seul.', responses: ['C’est lourd, mais je tiens.', 'Merci. Ça m’aide un peu.', 'J’ai besoin de cette présence.', 'Je reçois. Silence aussi.'] },
  { id: 'd2', category: 'difficile', text: 'Les jours difficiles existent. Tu as le droit d’en traverser un.', responses: ['Oui, c’est un de ces jours.', 'Merci de le reconnaître.', 'Je traverse.', 'Je reçois.'] },
  { id: 'd3', category: 'difficile', text: 'Tu n’as pas à faire semblant que tout va bien.', responses: ['Merci. Je n’y arrive pas aujourd’hui.', 'C’est vrai, ça soulage.', 'Je reste honnête ici.', 'Reçu sans masque.'] },
  { id: 'd4', category: 'difficile', text: 'Même si tout semble figé, tu n’es pas abandonné.', responses: ['Ça fait du bien de l’entendre.', 'Je m’accroche à ça.', 'Merci.', 'Présence reçue.'] },
  { id: 'd5', category: 'difficile', text: 'Si la journée t’a pris beaucoup, tu as le droit de te poser.', responses: ['Je me pose un peu.', 'Merci pour la permission.', 'C’était trop, oui.', 'Je reçois.'] },
  { id: 'd6', category: 'difficile', text: 'Tu n’as rien à prouver ce soir.', responses: ['Merci. Je n’en peux plus de prouver.', 'Je me repose dans cette phrase.', 'Silence accepté.', 'Reçu.'] },
  { id: 'd7', category: 'difficile', text: 'Ce n’est pas parce que c’est dur que tu échoues.', responses: ['J’avais besoin de l’entendre.', 'Merci.', 'Je continue quand même.', 'Reçu avec soulagement.'] },
  { id: 'd8', category: 'difficile', text: 'Aujourd’hui peut être une journée à survivre. C’est déjà beaucoup.', responses: ['Oui, survivre.', 'Merci de le valider.', 'Je survole le reste.', 'Reçu.'] },
  { id: 'd9', category: 'difficile', text: 'Tu n’as pas à être productif pour mériter du repos.', responses: ['Merci. J’en avais besoin.', 'Je m’arrête un peu.', 'Repos mérité sans preuve.', 'Reçu.'] },
  { id: 'd10', category: 'difficile', text: 'Si tout te dépasse, respire. Un seul souffle suffit pour commencer.', responses: ['Je souffle.', 'Merci.', 'Un souffle à la fois.', 'Reçu.'] },
  { id: 'd11', category: 'difficile', text: 'Ce poids que tu portes n’a pas à être invisible.', responses: ['Merci de le voir.', 'Il est lourd, oui.', 'Je le pose un instant ici.', 'Reçu.'] },
  { id: 'd12', category: 'difficile', text: 'Tu as le droit de dire « aujourd’hui non » à beaucoup de choses.', responses: ['Aujourd’hui non, pour beaucoup.', 'Merci pour la permission.', 'Je dis non un peu.', 'Reçu.'] },

  // ——— FATIGUE (10) ———
  { id: 'f1', category: 'fatigue', text: 'Tu as le droit d’être fatigué. Vraiment.', responses: ['Oui, je suis épuisé.', 'Merci de le dire simplement.', 'Je m’autorise un peu.', 'Reçu.'] },
  { id: 'f2', category: 'fatigue', text: 'Reposer n’est pas abandonner.', responses: ['Je me le répète grâce à toi.', 'Merci.', 'Je me repose alors.', 'Silence et repos.'] },
  { id: 'f3', category: 'fatigue', text: 'Même les plus solides ont besoin de s’asseoir parfois.', responses: ['Je m’assieds un moment.', 'Ça me touche.', 'Merci.', 'Reçu.'] },
  { id: 'f4', category: 'fatigue', text: 'Si ton corps ou ton cœur demande une pause, écoute-le.', responses: ['J’essaie d’écouter.', 'Merci pour ce rappel.', 'Pause acceptée.', 'Je reçois.'] },
  { id: 'f5', category: 'fatigue', text: 'Tu n’as pas à tout tenir aujourd’hui.', responses: ['Je lâche un peu.', 'Merci.', 'C’est déjà beaucoup.', 'Reçu.'] },
  { id: 'f6', category: 'fatigue', text: 'La fatigue n’efface pas ta valeur.', responses: ['J’en avais besoin.', 'Merci de le rappeler.', 'Je me le note.', 'Reçu doucement.'] },
  { id: 'f7', category: 'fatigue', text: 'Épuisé n’est pas faible. C’est humain.', responses: ['Humain, oui.', 'Merci.', 'Je m’accepte fatigué.', 'Reçu.'] },
  { id: 'f8', category: 'fatigue', text: 'Tu peux ralentir sans te justifier.', responses: ['Je ralentis.', 'Sans justification, merci.', 'Vitesse réduite.', 'Reçu.'] },
  { id: 'f9', category: 'fatigue', text: 'Le repos fait partie du chemin, pas une parenthèse honteuse.', responses: ['Je l’intègre alors.', 'Merci.', 'Repos sur le chemin.', 'Reçu.'] },
  { id: 'f10', category: 'fatigue', text: 'Si tu n’as plus d’énergie pour les autres, commence par toi.', responses: ['Pour moi d’abord.', 'Merci de le dire.', 'Je me priorise un peu.', 'Reçu.'] },

  // ——— COURAGE (10) ———
  { id: 'c1', category: 'courage', text: 'Tu continues. Même petit, c’est déjà du courage.', responses: ['Merci de le voir ainsi.', 'Je continue alors.', 'Ça me donne un peu de force.', 'Reçu.'] },
  { id: 'c2', category: 'courage', text: 'Se lever certains matins est déjà une victoire.', responses: ['Aujourd’hui c’était le cas.', 'Merci.', 'Je me le concède.', 'Reçu.'] },
  { id: 'c3', category: 'courage', text: 'Tu n’as pas besoin d’être héroïque pour être digne.', responses: ['Ça me soulage.', 'Merci.', 'Je reste simple alors.', 'Reçu.'] },
  { id: 'c4', category: 'courage', text: 'Demander de l’aide, même en silence, est une force.', responses: ['C’est pour ça que je suis ici.', 'Merci de le dire.', 'Je m’autorise ça.', 'Reçu.'] },
  { id: 'c5', category: 'courage', text: 'Tu as déjà traversé des choses. Tu traverses encore.', responses: ['Oui, et j’en suis fatigué.', 'Merci de le reconnaître.', 'Je tiens encore.', 'Reçu.'] },
  { id: 'c6', category: 'courage', text: 'Un pas très petit reste un pas.', responses: ['Je fais ce pas-là.', 'Merci.', 'Ça me suffit aujourd’hui.', 'Reçu.'] },
  { id: 'c7', category: 'courage', text: 'Rester debout intérieurement compte, même si personne ne le voit.', responses: ['Quelqu’un le voit un peu, merci.', 'Je reste debout.', 'Merci.', 'Reçu.'] },
  { id: 'c8', category: 'courage', text: 'Tu n’as pas à gagner. Tu as juste à traverser.', responses: ['Traverser, pas gagner.', 'Merci pour cette distinction.', 'Je traverse.', 'Reçu.'] },
  { id: 'c9', category: 'courage', text: 'La douceur envers soi est aussi une forme de courage.', responses: ['J’essaie d’être doux avec moi.', 'Merci.', 'Courage doux accepté.', 'Reçu.'] },
  { id: 'c10', category: 'courage', text: 'Tu tiens. Même si c’est de justesse.', responses: ['De justesse, oui.', 'Merci de le voir.', 'Je tiens encore.', 'Reçu.'] },

  // ——— GRATITUDE (8) ———
  { id: 'g1', category: 'gratitude', text: 'Merci d’être là, même sans que je te connaisse.', responses: ['Merci à toi aussi.', 'Ça me touche.', 'Présence partagée.', 'Reçu avec gratitude.'] },
  { id: 'g2', category: 'gratitude', text: 'Ta présence, même discrète, a de la valeur.', responses: ['Merci de le dire.', 'Je me le rappelle.', 'Ça compte pour moi aussi.', 'Reçu.'] },
  { id: 'g3', category: 'gratitude', text: 'Je suis reconnaissant qu’on puisse se tenir ainsi.', responses: ['Moi aussi.', 'C’est rare et beau.', 'Merci.', 'Reçu.'] },
  { id: 'g4', category: 'gratitude', text: 'Merci pour ce silence partagé.', responses: ['Merci aussi.', 'Ce silence me fait du bien.', 'Je le garde précieusement.', 'Reçu.'] },
  { id: 'g5', category: 'gratitude', text: 'Tu n’as rien donné de spectaculaire, et pourtant ça compte.', responses: ['Merci de le voir.', 'Ça me rassure.', 'Je continue modestement.', 'Reçu.'] },
  { id: 'g6', category: 'gratitude', text: 'Merci d’avoir choisi de rester un moment.', responses: ['Merci d’avoir ouvert l’espace.', 'C’était naturel.', 'Présence choisie.', 'Reçu.'] },
  { id: 'g7', category: 'gratitude', text: 'Ce petit lien anonyme me fait du bien. Merci.', responses: ['À moi aussi.', 'Lien reçu.', 'Merci en retour.', 'Reçu.'] },
  { id: 'g8', category: 'gratitude', text: 'Je n’oublierai pas qu’on s’est tenu, même brièvement.', responses: ['Moi non plus.', 'Brièvement, mais vraiment.', 'Merci.', 'Reçu.'] },

  // ——— NUIT / SOLITUDE (10) ———
  { id: 'n1', category: 'nuit', text: 'Si la nuit est longue, tu n’es pas le seul à la traverser.', responses: ['Cette nuit est longue, oui.', 'Merci d’être là.', 'Je me sens un peu moins seul.', 'Reçu.'] },
  { id: 'n2', category: 'nuit', text: 'Même à cette heure, quelqu’un peut tenir avec toi.', responses: ['Merci d’être éveillé avec moi.', 'Ça change quelque chose.', 'Je reçois.', 'Silence nocturne partagé.'] },
  { id: 'n3', category: 'nuit', text: 'La solitude pèse parfois plus la nuit. Je le sais.', responses: ['Oui, ce soir surtout.', 'Merci de le nommer.', 'Je tiens.', 'Reçu.'] },
  { id: 'n4', category: 'nuit', text: 'Si tu n’arrives pas à dormir, tu n’as pas à le faire seul.', responses: ['Je n’y arrive pas.', 'Merci.', 'Ta présence aide.', 'Reçu.'] },
  { id: 'n5', category: 'nuit', text: 'Cette heure difficile peut être un peu moins froide à deux.', responses: ['Elle l’est un peu moins.', 'Merci.', 'Je reste un moment.', 'Reçu.'] },
  { id: 'n6', category: 'nuit', text: 'Bonsoir, tout simplement. Sans exigence.', responses: ['Bonsoir.', 'Merci pour la simplicité.', 'Bonne nuit presque.', 'Reçu.'] },
  { id: 'n7', category: 'nuit', text: 'Les pensées tournent parfois la nuit. Tu n’es pas fou. Tu es fatigué.', responses: ['Fatigué, oui.', 'Merci de le normaliser.', 'Je laisse tourner moins fort.', 'Reçu.'] },
  { id: 'n8', category: 'nuit', text: 'Si le silence de la nuit fait trop de bruit, je pose un peu de présence dedans.', responses: ['Le silence est moins vide.', 'Merci.', 'Présence dans le bruit.', 'Reçu.'] },
  { id: 'n9', category: 'nuit', text: 'Tu peux juste attendre que le jour revienne. Sans te forcer.', responses: ['J’attends le jour.', 'Sans me forcer, merci.', 'Patience douce.', 'Reçu.'] },
  { id: 'n10', category: 'nuit', text: 'Cette nuit passera. Comme les autres. Tu n’es pas seul à la compter.', responses: ['Je la compte avec toi.', 'Merci.', 'Elle passera.', 'Reçu.'] },

  // ——— ESPOIR LÉGER (10) ———
  { id: 'e1', category: 'espoir', text: 'Rien n’est réglé, mais demain existe encore.', responses: ['J’y pense avec toi.', 'Merci pour cette ouverture.', 'Je m’y accroche un peu.', 'Reçu.'] },
  { id: 'e2', category: 'espoir', text: 'Un jour plus doux est possible. Pas certain, possible.', responses: ['Possible, oui.', 'Merci de ne pas promettre trop.', 'Je garde ça.', 'Reçu.'] },
  { id: 'e3', category: 'espoir', text: 'Tu n’as pas à y croire fort. Juste un peu suffit parfois.', responses: ['Un peu, j’y arrive.', 'Merci.', 'Je tente.', 'Reçu.'] },
  { id: 'e4', category: 'espoir', text: 'Il reste des instants qui ne font pas mal. On peut s’y tenir.', responses: ['J’en cherche un.', 'Merci.', 'Je m’y tiens.', 'Reçu.'] },
  { id: 'e5', category: 'espoir', text: 'Ce n’est pas fini. Même si c’est flou.', responses: ['Flou, mais pas fini.', 'Merci.', 'Je continue.', 'Reçu.'] },
  { id: 'e6', category: 'espoir', text: 'Une petite lumière quelque part suffit parfois à orienter.', responses: ['J’en cherche une.', 'Merci pour l’image.', 'Je m’oriente un peu.', 'Reçu.'] },
  { id: 'e7', category: 'espoir', text: 'Tu n’as pas à tout résoudre ce soir.', responses: ['Pas ce soir.', 'Merci.', 'Demain suffit.', 'Reçu.'] },
  { id: 'e8', category: 'espoir', text: 'Il y a encore de la place pour un souffle plus léger.', responses: ['J’y crois un peu.', 'Merci.', 'Souffle plus léger.', 'Reçu.'] },
  { id: 'e9', category: 'espoir', text: 'Ce qui est difficile aujourd’hui ne définit pas toute ta vie.', responses: ['Merci de le rappeler.', 'Je l’élargis un peu.', 'Pas toute ma vie.', 'Reçu.'] },
  { id: 'e10', category: 'espoir', text: 'Tu peux laisser une porte entrouverte. Même petite.', responses: ['Entrouverte.', 'Merci.', 'Petite porte ok.', 'Reçu.'] },

  // ——— ANXIÉTÉ (10) ———
  { id: 'a1', category: 'anxiete', text: 'Si ton esprit tourne trop vite, tu peux poser une chose à la fois.', responses: ['Une chose à la fois.', 'Merci.', 'Je ralentis le tour.', 'Reçu.'] },
  { id: 'a2', category: 'anxiete', text: 'L’inquiétude n’est pas une faiblesse. C’est une alerte fatiguée.', responses: ['Alerte fatiguée, oui.', 'Merci de le dire ainsi.', 'Je l’écoute moins fort.', 'Reçu.'] },
  { id: 'a3', category: 'anxiete', text: 'Tu n’as pas à anticiper toutes les catastrophes ce soir.', responses: ['Je lâche l’anticipation un peu.', 'Merci.', 'Pas toutes ce soir.', 'Reçu.'] },
  { id: 'a4', category: 'anxiete', text: 'Respire. Pas pour tout régler. Juste pour rester.', responses: ['Je respire pour rester.', 'Merci.', 'Respiration simple.', 'Reçu.'] },
  { id: 'a5', category: 'anxiete', text: 'Ce nœud dans la poitrine peut exister sans que tu le combattes tout de suite.', responses: ['Je le laisse un moment.', 'Merci.', 'Sans combat immédiat.', 'Reçu.'] },
  { id: 'a6', category: 'anxiete', text: 'Tu es en sécurité dans cette seconde. Rien d’autre à gérer pour l’instant.', responses: ['Cette seconde, ok.', 'Merci.', 'Seconde par seconde.', 'Reçu.'] },
  { id: 'a7', category: 'anxiete', text: 'Les pensées anxieuses mentent souvent. Tu peux douter d’elles un peu.', responses: ['Je doute d’elles un peu.', 'Merci.', 'Moins de crédit aux pensées.', 'Reçu.'] },
  { id: 'a8', category: 'anxiete', text: 'Tu n’as pas à être calme. Juste à ne pas être seul avec le bruit.', responses: ['Moins seul avec le bruit.', 'Merci.', 'Pas besoin d’être calme.', 'Reçu.'] },
  { id: 'a9', category: 'anxiete', text: 'Si le corps est en alerte, dis-lui que tu as vu le signal.', responses: ['Signal vu.', 'Merci.', 'Corps entendu.', 'Reçu.'] },
  { id: 'a10', category: 'anxiete', text: 'Une angoisse peut passer. Même si elle revient demain, elle peut passer encore.', responses: ['Elle peut passer.', 'Merci.', 'Je lui laisse le temps.', 'Reçu.'] },

  // ——— DOUCEUR (10) ———
  { id: 'du1', category: 'douceur', text: 'Sois un peu plus doux avec toi, si tu peux.', responses: ['J’essaie.', 'Merci pour le rappel.', 'Douceur acceptée.', 'Reçu.'] },
  { id: 'du2', category: 'douceur', text: 'Tu mérites la même patience que tu offres aux autres.', responses: ['Je me la dois aussi.', 'Merci.', 'Patience pour moi.', 'Reçu.'] },
  { id: 'du3', category: 'douceur', text: 'Un geste tendre envers soi n’est pas de l’égoïsme.', responses: ['Pas de l’égoïsme.', 'Merci.', 'Geste tendre ok.', 'Reçu.'] },
  { id: 'du4', category: 'douceur', text: 'Tu peux te parler comme tu parlerais à quelqu’un que tu aimes.', responses: ['J’essaie ce ton.', 'Merci.', 'Ton plus doux.', 'Reçu.'] },
  { id: 'du5', category: 'douceur', text: 'Il n’y a pas de honte à avoir besoin de chaleur.', responses: ['Besoin de chaleur ok.', 'Merci.', 'Pas de honte.', 'Reçu.'] },
  { id: 'du6', category: 'douceur', text: 'Laisse une petite place au réconfort, même s’il est minime.', responses: ['Petite place ouverte.', 'Merci.', 'Réconfort minime accepté.', 'Reçu.'] },
  { id: 'du7', category: 'douceur', text: 'Tu n’as pas à tout mériter pour avoir le droit d’être bien traité.', responses: ['Sans mérite préalable.', 'Merci.', 'Droit simple.', 'Reçu.'] },
  { id: 'du8', category: 'douceur', text: 'Une couverture, un verre d’eau, un silence : ça peut être assez.', responses: ['Assez, oui.', 'Merci.', 'Les petites choses.', 'Reçu.'] },
  { id: 'du9', category: 'douceur', text: 'Tu as le droit d’être fragile sans te juger.', responses: ['Fragile sans jugement.', 'Merci.', 'Je me juge moins.', 'Reçu.'] },
  { id: 'du10', category: 'douceur', text: 'Que ce message soit une main posée doucement, rien de plus.', responses: ['Main reçue.', 'Merci.', 'Douceur notée.', 'Reçu.'] },

  // ——— MATIN (8) ———
  { id: 'm1', category: 'matin', text: 'Bonjour. Tu n’as pas à être prêt. Juste à commencer doucement.', responses: ['Début doux.', 'Merci.', 'Pas prêt, mais là.', 'Reçu.'] },
  { id: 'm2', category: 'matin', text: 'Ce matin peut être minimal. Ce n’est pas un échec.', responses: ['Minimal ok.', 'Merci.', 'Pas un échec.', 'Reçu.'] },
  { id: 'm3', category: 'matin', text: 'Se lever compte. Le reste peut attendre.', responses: ['Levé. Le reste attend.', 'Merci.', 'Une chose faite.', 'Reçu.'] },
  { id: 'm4', category: 'matin', text: 'Si le jour s’annonce lourd, tu n’as pas à le porter d’un coup.', responses: ['Pas d’un coup.', 'Merci.', 'Par tranches.', 'Reçu.'] },
  { id: 'm5', category: 'matin', text: 'Un café, une respiration, une présence : c’est déjà un début.', responses: ['Début accepté.', 'Merci.', 'Petits débuts.', 'Reçu.'] },
  { id: 'm6', category: 'matin', text: 'Tu peux rentrer dans la journée sans te forcer à sourire.', responses: ['Sans sourire forcé.', 'Merci.', 'Entrée honnête.', 'Reçu.'] },
  { id: 'm7', category: 'matin', text: 'Bonne journée — ou journée supportable. Les deux sont valides.', responses: ['Supportable suffit.', 'Merci.', 'Valide.', 'Reçu.'] },
  { id: 'm8', category: 'matin', text: 'Ce matin, tu n’es pas seul à te demander comment tenir.', responses: ['Moins seul avec la question.', 'Merci.', 'On tient un peu.', 'Reçu.'] },

  // ——— CLÔTURE (8) ———
  { id: 'cl1', category: 'cloture', text: 'Merci d’avoir tenu avec moi ces jours-ci.', responses: ['Merci à toi aussi.', 'Ça a compté.', 'Je n’oublierai pas ce silence.', 'Reçu avec gratitude.'] },
  { id: 'cl2', category: 'cloture', text: 'Ce pacte se termine, mais la présence a existé.', responses: ['Oui, elle a existé.', 'Merci.', 'Je la garde.', 'Reçu.'] },
  { id: 'cl3', category: 'cloture', text: 'Je te souhaite une suite un peu plus douce.', responses: ['À toi aussi.', 'Merci pour ce vœu.', 'J’essaie.', 'Reçu.'] },
  { id: 'cl4', category: 'cloture', text: 'On se quitte sans se connaître, et pourtant quelque chose s’est passé.', responses: ['Oui, quelque chose.', 'C’était réel.', 'Merci.', 'Reçu.'] },
  { id: 'cl5', category: 'cloture', text: 'Prends soin de toi, autant que tu peux.', responses: ['Toi aussi.', 'J’essaierai.', 'Merci.', 'Reçu.'] },
  { id: 'cl6', category: 'cloture', text: 'Dernier signe : je suis content d’avoir tenu avec toi.', responses: ['Moi aussi.', 'Merci pour tout.', 'Beau silence.', 'Reçu jusqu’au bout.'] },
  { id: 'cl7', category: 'cloture', text: 'Que la suite te laisse un peu plus d’air.', responses: ['Un peu plus d’air.', 'Merci.', 'Je le souhaite aussi.', 'Reçu.'] },
  { id: 'cl8', category: 'cloture', text: 'Au revoir, sans dramatiser. Juste avec reconnaissance.', responses: ['Au revoir, reconnaissant.', 'Merci.', 'Simple et vrai.', 'Reçu.'] },
];

export function getMessageById(id: string): SupportOpening | undefined {
  return SUPPORT_MESSAGES.find((m) => m.id === id);
}

export function getMessagesByCategory(category: MessageCategory): SupportOpening[] {
  return SUPPORT_MESSAGES.filter((m) => m.category === category);
}

export function getMessageCount(): number {
  return SUPPORT_MESSAGES.length;
}
