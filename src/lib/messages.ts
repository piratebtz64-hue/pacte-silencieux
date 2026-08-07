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
  | 'colere'
  | 'deuil'
  | 'reconnexion'
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
  nuit: 'Nuit',
  espoir: 'Espoir',
  anxiete: 'Anxiété',
  douceur: 'Douceur',
  matin: 'Matin',
  colere: 'Colère',
  deuil: 'Deuil / perte',
  reconnexion: 'Reconnexion',
  cloture: 'Clôture',
};

export const SUPPORT_MESSAGES: SupportOpening[] = [
  // PRÉSENCE
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

  // JOUR DIFFICILE
  { id: 'd1', category: 'difficile', text: 'Si c’est lourd aujourd’hui, tu n’as pas à le porter seul.', responses: ['C’est lourd, mais je tiens.', 'Merci. Ça m’aide un peu.', 'J’ai besoin de cette présence.', 'Je reçois. Silence aussi.'] },
  { id: 'd2', category: 'difficile', text: 'Les jours difficiles existent. Tu as le droit d’en traverser un.', responses: ['Oui, c’est un de ces jours.', 'Merci de le reconnaître.', 'Je traverse.', 'Je reçois.'] },
  { id: 'd3', category: 'difficile', text: 'Tu n’as pas à faire semblant que tout va bien.', responses: ['Merci. Je n’y arrive pas aujourd’hui.', 'C’est vrai, ça soulage.', 'Je reste honnête ici.', 'Reçu sans masque.'] },
  { id: 'd4', category: 'difficile', text: 'Même si tout semble figé, tu n’es pas abandonné.', responses: ['Ça fait du bien de l’entendre.', 'Je m’accroche à ça.', 'Merci.', 'Présence reçue.'] },
  { id: 'd5', category: 'difficile', text: 'Si la journée t’a pris beaucoup, tu as le droit de te poser.', responses: ['Je me pose un peu.', 'Merci pour la permission.', 'C’était trop, oui.', 'Je reçois.'] },
  { id: 'd6', category: 'difficile', text: 'Tu n’as rien à prouver ce soir.', responses: ['Merci. Je n’en peux plus de prouver.', 'Je me repose dans cette phrase.', 'Silence accepté.', 'Reçu.'] },
  { id: 'd7', category: 'difficile', text: 'Ce n’est pas parce que c’est dur que tu échoues.', responses: ['J’avais besoin de l’entendre.', 'Merci.', 'Je continue quand même.', 'Reçu avec soulagement.'] },
  { id: 'd8', category: 'difficile', text: 'Aujourd’hui peut être une journée à survivre. C’est déjà beaucoup.', responses: ['Oui, survivre.', 'Merci de le valider.', 'Je survole le reste.', 'Reçu.'] },

  // FATIGUE
  { id: 'f1', category: 'fatigue', text: 'Tu as le droit d’être fatigué. Vraiment.', responses: ['Oui, je suis épuisé.', 'Merci de le dire simplement.', 'Je m’autorise un peu.', 'Reçu.'] },
  { id: 'f2', category: 'fatigue', text: 'Reposer n’est pas abandonner.', responses: ['Je me le répète grâce à toi.', 'Merci.', 'Je me repose alors.', 'Silence et repos.'] },
  { id: 'f3', category: 'fatigue', text: 'Même les plus solides ont besoin de s’asseoir parfois.', responses: ['Je m’assieds un moment.', 'Ça me touche.', 'Merci.', 'Reçu.'] },
  { id: 'f4', category: 'fatigue', text: 'Tu n’as pas à tout tenir aujourd’hui.', responses: ['Je lâche un peu.', 'Merci.', 'C’est déjà beaucoup.', 'Reçu.'] },
  { id: 'f5', category: 'fatigue', text: 'La fatigue n’efface pas ta valeur.', responses: ['J’en avais besoin.', 'Merci de le rappeler.', 'Je me le note.', 'Reçu doucement.'] },
  { id: 'f6', category: 'fatigue', text: 'Épuisé n’est pas faible. C’est humain.', responses: ['Humain, oui.', 'Merci.', 'Je m’accepte fatigué.', 'Reçu.'] },

  // COURAGE
  { id: 'c1', category: 'courage', text: 'Tu continues. Même petit, c’est déjà du courage.', responses: ['Merci de le voir ainsi.', 'Je continue alors.', 'Ça me donne un peu de force.', 'Reçu.'] },
  { id: 'c2', category: 'courage', text: 'Se lever certains matins est déjà une victoire.', responses: ['Aujourd’hui c’était le cas.', 'Merci.', 'Je me le concède.', 'Reçu.'] },
  { id: 'c3', category: 'courage', text: 'Tu n’as pas besoin d’être héroïque pour être digne.', responses: ['Ça me soulage.', 'Merci.', 'Je reste simple alors.', 'Reçu.'] },
  { id: 'c4', category: 'courage', text: 'Demander de l’aide, même en silence, est une force.', responses: ['C’est pour ça que je suis ici.', 'Merci de le dire.', 'Je m’autorise ça.', 'Reçu.'] },
  { id: 'c5', category: 'courage', text: 'Un pas très petit reste un pas.', responses: ['Je fais ce pas-là.', 'Merci.', 'Ça me suffit aujourd’hui.', 'Reçu.'] },
  { id: 'c6', category: 'courage', text: 'Tu n’as pas à gagner. Tu as juste à traverser.', responses: ['Traverser, pas gagner.', 'Merci pour cette distinction.', 'Je traverse.', 'Reçu.'] },

  // GRATITUDE
  { id: 'g1', category: 'gratitude', text: 'Merci d’être là, même sans que je te connaisse.', responses: ['Merci à toi aussi.', 'Ça me touche.', 'Présence partagée.', 'Reçu avec gratitude.'] },
  { id: 'g2', category: 'gratitude', text: 'Ta présence, même discrète, a de la valeur.', responses: ['Merci de le dire.', 'Je me le rappelle.', 'Ça compte pour moi aussi.', 'Reçu.'] },
  { id: 'g3', category: 'gratitude', text: 'Merci pour ce silence partagé.', responses: ['Merci aussi.', 'Ce silence me fait du bien.', 'Je le garde précieusement.', 'Reçu.'] },
  { id: 'g4', category: 'gratitude', text: 'Ce petit lien anonyme me fait du bien. Merci.', responses: ['À moi aussi.', 'Lien reçu.', 'Merci en retour.', 'Reçu.'] },

  // NUIT
  { id: 'n1', category: 'nuit', text: 'Si la nuit est longue, tu n’es pas le seul à la traverser.', responses: ['Cette nuit est longue, oui.', 'Merci d’être là.', 'Je me sens un peu moins seul.', 'Reçu.'] },
  { id: 'n2', category: 'nuit', text: 'Même à cette heure, quelqu’un peut tenir avec toi.', responses: ['Merci d’être éveillé avec moi.', 'Ça change quelque chose.', 'Je reçois.', 'Silence nocturne partagé.'] },
  { id: 'n3', category: 'nuit', text: 'La solitude pèse parfois plus la nuit. Je le sais.', responses: ['Oui, ce soir surtout.', 'Merci de le nommer.', 'Je tiens.', 'Reçu.'] },
  { id: 'n4', category: 'nuit', text: 'Si tu n’arrives pas à dormir, tu n’as pas à le faire seul.', responses: ['Je n’y arrive pas.', 'Merci.', 'Ta présence aide.', 'Reçu.'] },
  { id: 'n5', category: 'nuit', text: 'Bonsoir, tout simplement. Sans exigence.', responses: ['Bonsoir.', 'Merci pour la simplicité.', 'Bonne nuit presque.', 'Reçu.'] },
  { id: 'n6', category: 'nuit', text: 'Les pensées tournent parfois la nuit. Tu n’es pas fou. Tu es fatigué.', responses: ['Fatigué, oui.', 'Merci de le normaliser.', 'Je laisse tourner moins fort.', 'Reçu.'] },

  // ESPOIR
  { id: 'e1', category: 'espoir', text: 'Rien n’est réglé, mais demain existe encore.', responses: ['J’y pense avec toi.', 'Merci pour cette ouverture.', 'Je m’y accroche un peu.', 'Reçu.'] },
  { id: 'e2', category: 'espoir', text: 'Un jour plus doux est possible. Pas certain, possible.', responses: ['Possible, oui.', 'Merci de ne pas promettre trop.', 'Je garde ça.', 'Reçu.'] },
  { id: 'e3', category: 'espoir', text: 'Tu n’as pas à y croire fort. Juste un peu suffit parfois.', responses: ['Un peu, j’y arrive.', 'Merci.', 'Je tente.', 'Reçu.'] },
  { id: 'e4', category: 'espoir', text: 'Ce n’est pas fini. Même si c’est flou.', responses: ['Flou, mais pas fini.', 'Merci.', 'Je continue.', 'Reçu.'] },
  { id: 'e5', category: 'espoir', text: 'Tu n’as pas à tout résoudre ce soir.', responses: ['Pas ce soir.', 'Merci.', 'Demain suffit.', 'Reçu.'] },

  // ANXIÉTÉ
  { id: 'a1', category: 'anxiete', text: 'Si ton esprit tourne trop vite, tu peux poser une chose à la fois.', responses: ['Une chose à la fois.', 'Merci.', 'Je ralentis le tour.', 'Reçu.'] },
  { id: 'a2', category: 'anxiete', text: 'L’inquiétude n’est pas une faiblesse. C’est une alerte fatiguée.', responses: ['Alerte fatiguée, oui.', 'Merci de le dire ainsi.', 'Je l’écoute moins fort.', 'Reçu.'] },
  { id: 'a3', category: 'anxiete', text: 'Tu n’as pas à anticiper toutes les catastrophes ce soir.', responses: ['Je lâche l’anticipation un peu.', 'Merci.', 'Pas toutes ce soir.', 'Reçu.'] },
  { id: 'a4', category: 'anxiete', text: 'Respire. Pas pour tout régler. Juste pour rester.', responses: ['Je respire pour rester.', 'Merci.', 'Respiration simple.', 'Reçu.'] },
  { id: 'a5', category: 'anxiete', text: 'Tu es en sécurité dans cette seconde. Rien d’autre à gérer pour l’instant.', responses: ['Cette seconde, ok.', 'Merci.', 'Seconde par seconde.', 'Reçu.'] },
  { id: 'a6', category: 'anxiete', text: 'Les pensées anxieuses mentent souvent. Tu peux douter d’elles un peu.', responses: ['Je doute d’elles un peu.', 'Merci.', 'Moins de crédit aux pensées.', 'Reçu.'] },

  // DOUCEUR
  { id: 'du1', category: 'douceur', text: 'Sois un peu plus doux avec toi, si tu peux.', responses: ['J’essaie.', 'Merci pour le rappel.', 'Douceur acceptée.', 'Reçu.'] },
  { id: 'du2', category: 'douceur', text: 'Tu mérites la même patience que tu offres aux autres.', responses: ['Je me la dois aussi.', 'Merci.', 'Patience pour moi.', 'Reçu.'] },
  { id: 'du3', category: 'douceur', text: 'Un geste tendre envers soi n’est pas de l’égoïsme.', responses: ['Pas de l’égoïsme.', 'Merci.', 'Geste tendre ok.', 'Reçu.'] },
  { id: 'du4', category: 'douceur', text: 'Il n’y a pas de honte à avoir besoin de chaleur.', responses: ['Besoin de chaleur ok.', 'Merci.', 'Pas de honte.', 'Reçu.'] },
  { id: 'du5', category: 'douceur', text: 'Tu as le droit d’être fragile sans te juger.', responses: ['Fragile sans jugement.', 'Merci.', 'Je me juge moins.', 'Reçu.'] },

  // MATIN
  { id: 'm1', category: 'matin', text: 'Bonjour. Tu n’as pas à être prêt. Juste à commencer doucement.', responses: ['Début doux.', 'Merci.', 'Pas prêt, mais là.', 'Reçu.'] },
  { id: 'm2', category: 'matin', text: 'Ce matin peut être minimal. Ce n’est pas un échec.', responses: ['Minimal ok.', 'Merci.', 'Pas un échec.', 'Reçu.'] },
  { id: 'm3', category: 'matin', text: 'Se lever compte. Le reste peut attendre.', responses: ['Levé. Le reste attend.', 'Merci.', 'Une chose faite.', 'Reçu.'] },
  { id: 'm4', category: 'matin', text: 'Bonne journée — ou journée supportable. Les deux sont valides.', responses: ['Supportable suffit.', 'Merci.', 'Valide.', 'Reçu.'] },

  // COLÈRE (nouveau)
  { id: 'co1', category: 'colere', text: 'Ta colère a le droit d’exister. Elle n’a pas à être polie.', responses: ['Elle n’est pas polie, non.', 'Merci de l’autoriser.', 'Colère reçue.', 'Reçu.'] },
  { id: 'co2', category: 'colere', text: 'Tu peux être en colère sans devoir tout détruire.', responses: ['Colère sans destruction.', 'Merci.', 'Je la contiens un peu.', 'Reçu.'] },
  { id: 'co3', category: 'colere', text: 'Ce qui t’a blessé compte. Même si personne n’a vu.', responses: ['Ça compte, oui.', 'Merci de le valider.', 'Blessure vue.', 'Reçu.'] },
  { id: 'co4', category: 'colere', text: 'Tu n’as pas à expliquer pourquoi c’est injuste. Tu peux juste le sentir.', responses: ['Je le sens.', 'Sans expliquer, merci.', 'Injusté ressenti.', 'Reçu.'] },
  { id: 'co5', category: 'colere', text: 'La colère peut être une frontière. Tu as le droit d’en avoir.', responses: ['C’est une frontière.', 'Merci.', 'Frontière posée.', 'Reçu.'] },
  { id: 'co6', category: 'colere', text: 'Tu n’es pas « trop sensible ». Tu as été trop peu respecté peut-être.', responses: ['Peut-être, oui.', 'Merci de le formuler ainsi.', 'Respect manquant nommé.', 'Reçu.'] },

  // DEUIL / PERTE (nouveau)
  { id: 'de1', category: 'deuil', text: 'La perte laisse un vide. Tu n’as pas à le remplir tout de suite.', responses: ['Le vide est là.', 'Merci de ne pas forcer.', 'Pas tout de suite.', 'Reçu.'] },
  { id: 'de2', category: 'deuil', text: 'Ce qui manque a le droit de manquer encore.', responses: ['Ça manque encore.', 'Merci.', 'Droit de manquer.', 'Reçu.'] },
  { id: 'de3', category: 'deuil', text: 'Tu peux porter un chagrin sans le justifier aux autres.', responses: ['Sans justification.', 'Merci.', 'Chagrin privé ok.', 'Reçu.'] },
  { id: 'de4', category: 'deuil', text: 'Le temps n’efface pas. Il change parfois la forme du poids.', responses: ['Le poids change de forme.', 'Merci.', 'Pas d’effacement forcé.', 'Reçu.'] },
  { id: 'de5', category: 'deuil', text: 'Tu as le droit d’être triste longtemps. Il n’y a pas de délai correct.', responses: ['Pas de délai.', 'Merci.', 'Tristesse autorisée.', 'Reçu.'] },
  { id: 'de6', category: 'deuil', text: 'Je ne remplis pas le vide. Je m’assieds un peu à côté.', responses: ['À côté, merci.', 'Présence sans combler.', 'Assis avec moi.', 'Reçu.'] },

  // RECONNEXION (nouveau)
  { id: 'r1', category: 'reconnexion', text: 'Revenir ici est déjà un geste. Merci d’être revenu.', responses: ['Merci de l’accueillir.', 'Je suis revenu.', 'Geste reçu.', 'Reçu.'] },
  { id: 'r2', category: 'reconnexion', text: 'Tu peux reprendre sans rattraper tout le retard.', responses: ['Sans rattraper.', 'Merci.', 'Reprise simple.', 'Reçu.'] },
  { id: 'r3', category: 'reconnexion', text: 'S’absenter n’annule pas le lien qu’on a tissé un moment.', responses: ['Le lien reste un peu.', 'Merci.', 'Pas annulé.', 'Reçu.'] },
  { id: 'r4', category: 'reconnexion', text: 'On repart de maintenant. Pas besoin de tout raconter.', responses: ['Maintenant suffit.', 'Merci.', 'Sans tout raconter.', 'Reçu.'] },
  { id: 'r5', category: 'reconnexion', text: 'Tu n’as pas disparu pour de vrai. Tu étais juste ailleurs un temps.', responses: ['Ailleurs un temps.', 'Merci de le voir ainsi.', 'Toujours là un peu.', 'Reçu.'] },

  // CLÔTURE
  { id: 'cl1', category: 'cloture', text: 'Merci d’avoir tenu avec moi ces jours-ci.', responses: ['Merci à toi aussi.', 'Ça a compté.', 'Je n’oublierai pas ce silence.', 'Reçu avec gratitude.'] },
  { id: 'cl2', category: 'cloture', text: 'Ce pacte se termine, mais la présence a existé.', responses: ['Oui, elle a existé.', 'Merci.', 'Je la garde.', 'Reçu.'] },
  { id: 'cl3', category: 'cloture', text: 'Je te souhaite une suite un peu plus douce.', responses: ['À toi aussi.', 'Merci pour ce vœu.', 'J’essaie.', 'Reçu.'] },
  { id: 'cl4', category: 'cloture', text: 'On se quitte sans se connaître, et pourtant quelque chose s’est passé.', responses: ['Oui, quelque chose.', 'C’était réel.', 'Merci.', 'Reçu.'] },
  { id: 'cl5', category: 'cloture', text: 'Prends soin de toi, autant que tu peux.', responses: ['Toi aussi.', 'J’essaierai.', 'Merci.', 'Reçu.'] },
  { id: 'cl6', category: 'cloture', text: 'Dernier signe : je suis content d’avoir tenu avec toi.', responses: ['Moi aussi.', 'Merci pour tout.', 'Beau silence.', 'Reçu jusqu’au bout.'] },
];

export function getMessageById(id: string): SupportOpening | undefined {
  return SUPPORT_MESSAGES.find((m) => m.id === id);
}

export function getMessagesByCategory(category: MessageCategory): SupportOpening[] {
  return SUPPORT_MESSAGES.filter((m) => m.category === category);
}

export function searchMessages(query: string): SupportOpening[] {
  const q = query.toLowerCase().trim();
  if (!q) return SUPPORT_MESSAGES;
  return SUPPORT_MESSAGES.filter(
    (m) =>
      m.text.toLowerCase().includes(q) ||
      CATEGORY_LABELS[m.category].toLowerCase().includes(q)
  );
}
